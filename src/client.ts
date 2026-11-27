import type { Camera, Entry, Hass, History, Lot, Manual, Options, Ranges, Snapshot } from "./cards";

type Limits = { temperature: { min: number; max: number }; humidity: { min: number; max: number } };
type Chamber = {
  locationId: string;
  status: string;
  effective: Limits | null;
  automatic: Limits | null;
  manual: { id: string; startsAt: number; endsAt: number; reason: string; limits: Limits } | null;
  proposal: { id: string; limits: Limits | null; createdAt: number } | null;
  occupants?: { lotId: string; quantity: number }[];
};
type RawSnapshot = {
  apiVersion: number;
  status: string;
  revision: number;
  lotCodes: Record<string, string>;
  locations: { id: string; name: string; kind: string; archived: boolean }[];
  chambers: Chamber[];
};
type RawLot = { id: string; code: string; timeZone: string; version: number };
const ranges = (v: Limits | null): Ranges | null =>
  v
    ? {
        temperaturaMin: v.temperature.min,
        temperaturaMax: v.temperature.max,
        humedadMin: v.humidity.min,
        humedadMax: v.humidity.max,
      }
    : null;
const limits = (v: Ranges): Limits => ({
  temperature: { min: v.temperaturaMin, max: v.temperaturaMax },
  humidity: { min: v.humedadMin, max: v.humedadMax },
});
const lot = (v: RawLot): Lot => ({
  id: v.id,
  codigo: v.code,
  zonaHoraria: v.timeZone,
  revision: v.version,
});

export async function entries(hass: Hass): Promise<Entry[]> {
  const values = await hass.callWS<{ entry_id: string; title: string; state: string }[]>({
    type: "config_entries/get",
    domain: "registros_camaras",
  });
  return values.map((v) => ({ id: v.entry_id, title: v.title, ready: v.state === "loaded" }));
}

export async function service<T>(
  hass: Hass,
  entry: string,
  name: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  const result = await hass.callWS<{ response: T }>({
    type: "call_service",
    domain: "registros_camaras",
    service: name,
    service_data: { config_entry_id: entry, ...data },
    return_response: true,
  });
  return result.response;
}

function snapshot(v: RawSnapshot): Snapshot {
  if (v.apiVersion !== 1 || v.status !== "ready")
    throw new Error("El centro está sincronizando. Actualiza en unos segundos.");
  return {
    revision: v.revision,
    ubicaciones: v.locations.filter((l) => !l.archived).map((l) => ({ id: l.id, nombre: l.name })),
    camaras: v.locations
      .filter((l) => l.kind !== "terminal" && !l.archived)
      .map((location) => {
        const c = v.chambers.find((c) => c.locationId === location.id);
        const m = c?.manual;
        const manual: Manual | null = m
          ? {
              ...ranges(m.limits)!,
              id: m.id,
              revision: v.revision,
              zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
              vigenteDesde: new Date(m.startsAt).toISOString(),
              vigenteHasta: new Date(m.endsAt).toISOString(),
              motivo: m.reason,
            }
          : null;
        return {
          revision: v.revision,
          ubicacionId: location.id,
          nombre: location.name,
          estado: c?.status ?? "empty",
          origen: m ? "manual" : c?.automatic ? "automatica_confirmada" : "ninguna",
          consigna: ranges(c?.effective ?? null),
          manual,
          manualHasta: manual?.vigenteHasta ?? null,
          consignaId: manual?.id ?? null,
          lotes: (c?.occupants ?? []).map((o) => ({
            codigo: v.lotCodes[o.lotId] ?? o.lotId,
            cantidad: o.quantity,
          })),
          pendiente: c?.proposal
            ? {
                id: c.proposal.id,
                propuesta: ranges(c.proposal.limits),
                motivo: c.status,
                detectadoEn: new Date(c.proposal.createdAt).toISOString(),
              }
            : null,
        } satisfies Camera;
      }),
  };
}

// UI view models retain the layout's vocabulary. Only these explicit native HA services cross the wire.
export async function request<T>(
  hass: Hass,
  entry: string,
  operation: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  return (await operationResult(hass, entry, operation, data)) as T;
}
async function operationResult(
  hass: Hass,
  entry: string,
  operation: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  const call = <T>(name: string, body: Record<string, unknown> = {}) =>
    service<T>(hass, entry, name, body);
  if (operation === "snapshot") return snapshot(await call<RawSnapshot>("get_snapshot"));
  if (operation === "lots") {
    const page = await call<{ items: { lot: RawLot }[]; nextBefore: number | null }>(
      "get_lots",
      data,
    );
    return { lotes: page.items.map((v) => lot(v.lot)), nextBefore: page.nextBefore };
  }
  if (operation === "movement_options") {
    const options = await call<{
      expectedRevision: number;
      portions: {
        id: string;
        locationId: string;
        remaining: number;
        occurredAt: string;
        precision: string;
        sequence: number;
      }[];
    }>("get_movement_options", {
      lot_id: data.lot_id,
      occurred_on: data.date,
      ...(data.movement_id ? { correcting: data.movement_id } : {}),
    });
    const detail = await call<{ status: string; lot: RawLot }>("get_lot", { lot_id: data.lot_id });
    if (detail.status !== "projected") throw new Error("El lote está sincronizando.");
    return {
      lote: { ...lot(detail.lot), revision: options.expectedRevision },
      fecha: data.date,
      porciones: options.portions
        .filter((p) => p.remaining > 0)
        .map((p) => ({
          id: p.id,
          ubicacionId: p.locationId,
          restante: p.remaining,
          fecha: p.occurredAt,
          precision: p.precision,
          orden: p.sequence,
        })),
    } as Options;
  }
  if (operation === "movements") {
    const result = await call<{
      status: string;
      data: {
        operations: {
          id: string;
          sequence: number;
          occurredOn: string;
          sourceLocationId: string | null;
          annulled: boolean;
          mixSources: boolean;
          destinations: {
            locationId: string;
            quantity: number;
            contributions?: { portionId: string; quantity: number }[];
          }[];
          lastReceipt: { eventType: string };
        }[];
      };
    }>("get_movement_history", { lot_id: data.lot_id });
    if (result.status !== "projected") throw new Error("El historial está sincronizando.");
    const detail = await call<{ status: string; lot: RawLot }>("get_lot", { lot_id: data.lot_id });
    if (detail.status !== "projected") throw new Error("El lote está sincronizando.");
    return {
      lote: lot(detail.lot),
      movimientos: result.data.operations
        .filter((m) => !m.annulled)
        .map((m) => ({
          id: m.id,
          orden: m.sourceLocationId === null ? 0 : m.sequence,
          fecha: m.occurredOn,
          ubicacionOrigenId: m.sourceLocationId,
          mezclarOrigen: m.mixSources,
          corregidoEn: m.lastReceipt.eventType === "MovementCorrected" ? m.occurredOn : null,
          destinos: m.destinations.map((d) => ({
            ubicacionId: d.locationId,
            cantidad: d.quantity,
            procedencias: d.contributions?.map((c) => ({
              porcionId: c.portionId,
              cantidad: c.quantity,
            })),
          })),
        })),
    } satisfies History;
  }
  return sendCommand(call, operation, data);
}

type Payload = Ranges & {
  id: string;
  codigo: string;
  cantidad: number;
  iniciadoEn: string;
  revision: number;
  vigenteDesde: string;
  vigenteHasta: string;
  motivo: string;
  fecha: string;
  ubicacionOrigenId: string;
  mezclarOrigen: boolean;
  destinos: {
    ubicacionId: string;
    cantidad: number;
    procedencias?: { porcionId: string; cantidad: number }[];
  }[];
};
async function sendCommand(
  call: <T>(name: string, body: Record<string, unknown>) => Promise<T>,
  operation: string,
  data: Record<string, unknown>,
) {
  const p = data.payload as Payload;
  const common = {
    command_id: data.command_id ?? p?.id,
    expected_revision: data.expected_revision ?? p?.revision,
  };
  if (operation === "confirm_change")
    return call("confirm_proposal", {
      ...common,
      location_id: data.location_id,
      proposal_id: data.proposal_id,
    });
  if (operation === "finish_manual")
    return call("finish_manual", {
      ...common,
      location_id: data.location_id,
      manual_id: data.manual_id,
      reason: "Finalizada desde Home Assistant",
    });
  if (operation === "set_manual" || operation === "update_manual")
    return call(operation === "set_manual" ? "schedule_manual" : "replace_manual", {
      ...common,
      location_id: data.location_id,
      ...(operation === "update_manual" ? { manual_id: data.manual_id } : {}),
      limits: limits(p),
      starts_at: Date.parse(p.vigenteDesde),
      ends_at: Date.parse(p.vigenteHasta),
      reason: p.motivo,
    });
  if (operation === "create_lot") {
    const receipt = await call("create_lot", {
      ...common,
      code: p.codigo,
      quantity: p.cantidad,
      started_on: p.iniciadoEn,
    });
    return { receipt, lote: { codigo: p.codigo } };
  }
  if (operation === "register_movement" || operation === "update_movement")
    return call(operation === "register_movement" ? "create_movement" : "correct_movement", {
      ...common,
      lot_id: data.lot_id,
      ...(operation === "update_movement"
        ? { movement_id: data.movement_id, reason: data.reason }
        : {}),
      occurred_on: p.fecha,
      source_location_id: p.ubicacionOrigenId,
      mix_sources: p.mezclarOrigen,
      destinations: p.destinos.map((d) => ({
        locationId: d.ubicacionId,
        quantity: d.cantidad,
        ...(d.procedencias
          ? {
              contributions: d.procedencias.map((c) => ({
                portionId: c.porcionId,
                quantity: c.cantidad,
              })),
            }
          : {}),
      })),
    });
  throw new Error("Operación no admitida por la integración nueva.");
}
