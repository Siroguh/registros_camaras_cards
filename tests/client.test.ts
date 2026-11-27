import { test } from "node:test";
import assert from "node:assert/strict";
import { request, entries } from "../src/client.ts";
import type { Hass, Snapshot } from "../src/cards.ts";

const range = { temperature: { min: 2, max: 6 }, humidity: { min: 50, max: 70 } };
test("cards use native HA responses, retain displayed revision and no legacy bridge", async () => {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: {},
    async callWS(message: Record<string, unknown>) {
      sent.push(message);
      if (message.type === "config_entries/get")
        return [{ entry_id: "entry", title: "Centre", state: "loaded" }];
      if (message.service === "get_snapshot")
        return {
          response: {
            apiVersion: 1,
            status: "ready",
            revision: 12,
            locations: [{ id: "camera", name: "Cámara", kind: "chamber", archived: false }],
            lotCodes: { lot: "Lote 1" },
            chambers: [
              {
                locationId: "camera",
                status: "compatible",
                effective: range,
                automatic: range,
                manual: null,
                occupants: [{ lotId: "lot", quantity: 10 }],
                proposal: { id: "proposal", limits: range, createdAt: 1000 },
              },
            ],
          },
        };
      return { response: { version: 13 } };
    },
  } as Hass;
  assert.equal((await entries(hass))[0].id, "entry");
  const data = await request<Snapshot>(hass, "entry", "snapshot");
  assert.equal(data.camaras[0].revision, 12);
  assert.deepEqual(data.camaras[0].lotes, [{ codigo: "Lote 1", cantidad: 10 }]);
  const input = {
    command_id: "stable-command",
    expected_revision: 12,
    location_id: "camera",
    proposal_id: "proposal",
  };
  await request(hass, "entry", "confirm_change", input);
  await request(hass, "entry", "confirm_change", input);
  assert.deepEqual(sent.at(-1), sent.at(-2));
  assert.deepEqual(sent.at(-1)?.service_data, { config_entry_id: "entry", ...input });
  assert.equal(sent.at(-1)?.type, "call_service");
  assert.equal(sent.at(-1)?.service, "confirm_proposal");
});

test("pending synchronization is never rendered as empty stock", async () => {
  const hass = {
    states: {},
    async callWS() {
      return { response: { apiVersion: 1, status: "pending" } };
    },
  } as Hass;
  await assert.rejects(request(hass, "entry", "snapshot"), /sincronizando/);
});

test("movement correction maps provenance and distinct command identity", async () => {
  let sent: Record<string, unknown> = {};
  const hass = {
    states: {},
    async callWS(message: Record<string, unknown>) {
      sent = message;
      return { response: { version: 14 } };
    },
  } as Hass;
  await request(hass, "entry", "update_movement", {
    command_id: "new-correction",
    lot_id: "lot",
    movement_id: "original-move",
    reason: "Recuento",
    payload: {
      revision: 13,
      fecha: "2026-11-27",
      ubicacionOrigenId: "A",
      mezclarOrigen: false,
      destinos: [
        { ubicacionId: "B", cantidad: 5, procedencias: [{ porcionId: "portion:1", cantidad: 5 }] },
      ],
    },
  });
  assert.deepEqual(sent.service_data, {
    config_entry_id: "entry",
    command_id: "new-correction",
    expected_revision: 13,
    lot_id: "lot",
    movement_id: "original-move",
    reason: "Recuento",
    occurred_on: "2026-11-27",
    source_location_id: "A",
    mix_sources: false,
    destinations: [
      { locationId: "B", quantity: 5, contributions: [{ portionId: "portion:1", quantity: 5 }] },
    ],
  });
});
