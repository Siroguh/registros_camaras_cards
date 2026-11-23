import styles from "./style.css?inline";

type Config = {
  type: string;
  entry_id?: string;
  location_id?: string;
  title?: string;
  temperature_entity?: string;
  humidity_entity?: string;
};
type State = { state: string; attributes: Record<string, unknown> };
type Hass = {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  states: Record<string, State>;
  user?: { is_admin: boolean };
  themes?: { darkMode: boolean };
  locale?: { language: string };
};
type Entry = { id: string; title: string; ready: boolean };
type Ranges = {
  temperaturaMin: number;
  temperaturaMax: number;
  humedadMin: number;
  humedadMax: number;
};
type Camera = {
  ubicacionId: string;
  nombre: string;
  estado: string;
  origen: string;
  consigna: Ranges | null;
  manualHasta: string | null;
  lotes: { codigo: string; cantidad: number }[];
  pendiente: { id: string; propuesta: Ranges | null; motivo: string; detectadoEn: string } | null;
};
type Snapshot = { camaras: Camera[]; ubicaciones: { id: string; nombre: string }[] };
type Lot = { id: string; codigo: string; zonaHoraria: string; revision: number };
type Portion = {
  id: string;
  ubicacionId: string;
  restante: number;
  fecha: string;
  precision: string;
  orden: number;
};
type Options = { lote: Lot; fecha: string; porciones: Portion[] };

const inputClass =
  "w-full min-w-0 border border-solid border-ha-control-border bg-ha-input px-3 py-2 text-ha-text focus:outline-2 focus:outline-ha-text disabled:opacity-50";
const buttonClass =
  "border border-solid border-ha-control-border bg-ha-button px-3 py-2 text-ha-text hover:bg-ha-hover focus:outline-2 focus:outline-ha-text disabled:opacity-50 disabled:cursor-not-allowed";
const zone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const localNow = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const ranges = (r: Ranges | null) =>
  r
    ? `${r.temperaturaMin}–${r.temperaturaMax} °C · ${r.humedadMin}–${r.humedadMax} %`
    : "Sin consigna";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}
function button(text: string, action: () => void | Promise<void>) {
  const node = el("button", text, buttonClass);
  node.type = "button";
  node.onclick = () => void action();
  return node;
}
function field(label: string, type = "text", value = "", required = true) {
  const wrapper = el("label", "", "grid min-w-0 gap-1.5 text-sm");
  wrapper.append(el("span", label));
  const input = el("input", "", inputClass);
  input.type = type;
  input.value = value;
  input.required = required;
  wrapper.append(input);
  return { wrapper, input };
}
function select(
  label: string,
  items: { value: string; label: string }[],
  value = "",
  required = true,
) {
  const wrapper = el("label", "", "grid min-w-0 gap-1.5 text-sm");
  wrapper.append(el("span", label));
  const input = el("select", "", inputClass);
  input.required = required;
  const empty = el("option", "Selecciona…");
  empty.value = "";
  input.append(empty);
  for (const item of items) {
    const option = el("option", item.label);
    option.value = item.value;
    input.append(option);
  }
  input.value = value;
  wrapper.append(input);
  return { wrapper, input };
}
function status() {
  const output = el("output", "", "block empty:hidden text-sm text-ha-secondary whitespace-pre-wrap");
  output.dataset.status = "";
  output.setAttribute("aria-live", "polite");
  return output;
}
function styleRoot(root: ShadowRoot) {
  const style = el("style");
  style.textContent = styles;
  root.replaceChildren(style);
}

function syncTheme(host: HTMLElement, hass: Hass) {
  // Native date pickers, selects and checkboxes must follow HA, not the OS theme.
  host.style.colorScheme = hass.themes ? (hass.themes.darkMode ? "dark" : "light") : "inherit";
}

abstract class BaseCard extends HTMLElement {
  protected config: Config = { type: "" };
  protected ha?: Hass;
  protected body = el("div");
  protected heading = el("h2");
  protected snapshot?: Snapshot;
  protected busy = false;
  private timer?: ReturnType<typeof setInterval>;
  private initialized = false;
  private rendered = false;
  protected generation = 0;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config: Config) {
    this.config = { ...config };
    this.initialized = false;
    this.snapshot = undefined;
    this.rendered = false;
    this.generation++;
    this.mount();
    this.start();
  }
  set hass(hass: Hass) {
    this.ha = hass;
    syncTheme(this, hass);
    this.start();
    this.updateMeasurements();
  }
  connectedCallback() {
    this.initialized = false;
    this.start();
  }
  disconnectedCallback() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
  getCardSize() {
    return 5;
  }
  static getConfigElement() {
    return document.createElement("registros-camaras-editor");
  }
  protected mount() {
    const root = this.shadowRoot!;
    styleRoot(root);
    const card = el(
      "ha-card" as "div",
      "",
      "block [--ha-card-border-radius:0px] [--ha-card-border-width:0px]",
    );
    const panel = el("div", "", "bg-ha-surface text-ha-text border border-solid border-ha-control-border p-4");
    this.heading = el("h2", this.config.title || this.defaultTitle(), "mb-4 text-xl font-semibold");
    this.body = el("div", "", "grid gap-4");
    panel.append(this.heading, this.body, status());
    card.append(panel);
    root.append(card);
  }
  private start() {
    if (!this.isConnected || !this.ha || this.initialized || this.busy) return;
    this.initialized = true;
    this.mount();
    clearInterval(this.timer);
    if (!this.config.entry_id) {
      this.message("Conexión sin configurar.");
      return;
    }
    void this.run(async () => {
      this.snapshot = await this.request<Snapshot>("snapshot");
      await this.render();
      this.rendered = true;
    });
    this.timer = setInterval(() => {
      if (!this.busy && this.isConnected && !document.hidden) void this.refresh();
    }, 60_000);
  }
  protected async request<T>(operation: string, data: Record<string, unknown> = {}): Promise<T> {
    if (!this.ha || !this.config.entry_id)
      throw new Error("Conexión sin configurar.");
    const generation = this.generation;
    const result = await this.ha.callWS<T>({
      type: "registros_camaras/operation",
      entry_id: this.config.entry_id,
      operation,
      data,
    });
    if (generation !== this.generation)
      throw new Error("La configuración ha cambiado. Actualiza la tarjeta.");
    return result;
  }
  protected message(text: string) {
    this.shadowRoot!.querySelectorAll<HTMLOutputElement>("[data-status]").forEach(
      (n) => (n.textContent = text),
    );
  }
  protected async run(work: () => Promise<void>) {
    if (this.busy) return;
    this.busy = true;
    this.message("Procesando…");
    const previous = [
      ...this.shadowRoot!.querySelectorAll<
        HTMLButtonElement | HTMLInputElement | HTMLSelectElement
      >("button,input,select"),
    ].map((n) => [n, n.disabled] as const);
    previous.forEach(([n]) => (n.disabled = true));
    try {
      await work();
      this.message("");
    } catch (error) {
      this.message(
        error instanceof Error
          ? error.message
          : String((error as { message?: string })?.message || error),
      );
    } finally {
      this.busy = false;
      previous.forEach(([n, disabled]) => (n.disabled = disabled));
      if (!this.initialized) this.start();
    }
  }
  protected async refresh() {
    await this.run(async () => {
      this.snapshot = await this.request<Snapshot>("snapshot");
      if (!this.rendered) {
        await this.render();
        this.rendered = true;
      } else this.refreshed();
    });
  }
  protected refreshed() {}
  protected updateMeasurements() {}
  protected abstract defaultTitle(): string;
  protected abstract render(): void | Promise<void>;
  protected dialog(title: string) {
    const origin = this.shadowRoot!.activeElement as HTMLElement | null;
    const dialog = el(
      "dialog",
      "",
      "fixed inset-0 m-auto w-[min(36rem,95vw)] max-h-[90vh] overflow-y-auto border border-solid border-ha-control-border bg-ha-surface p-5 text-ha-text backdrop:bg-black/70",
    );
    dialog.append(el("h3", title, "mb-4 text-xl font-semibold"));
    const form = el("form", "", "grid gap-4");
    dialog.append(
      form,
      status(),
      button("Cerrar", () => dialog.close()),
    );
    dialog.addEventListener("cancel", (event) => {
      if (this.busy) event.preventDefault();
    });
    dialog.onclose = () => {
      dialog.remove();
      origin?.focus();
    };
    this.shadowRoot!.append(dialog);
    return { dialog, form };
  }
}

class CameraCard extends BaseCard {
  static getStubConfig() {
    return { type: "custom:registros-camera-card" };
  }
  protected defaultTitle() {
    return "Cámara";
  }
  private camera() {
    return this.snapshot?.camaras.find((c) => c.ubicacionId === this.config.location_id);
  }
  protected refreshed() {
    if (!this.shadowRoot!.querySelector("dialog")) this.render();
  }
  protected updateMeasurements() {
    const format = new Intl.NumberFormat(this.ha?.locale?.language, {
      maximumFractionDigits: 2,
      useGrouping: false,
    });
    for (const [key, id] of [
      ["temperature", this.config.temperature_entity],
      ["humidity", this.config.humidity_entity],
    ]) {
      const node = this.shadowRoot!.querySelector(`[data-measurement="${key}"]`);
      if (node) {
        const state = id ? this.ha?.states[id] : undefined;
        const value = state?.state.trim() ?? "";
        const number = value ? Number(value) : NaN;
        node.textContent = Number.isFinite(number)
          ? `${format.format(number)} ${state?.attributes.unit_of_measurement ?? ""}`.trim()
          : value && !["unknown", "unavailable"].includes(value)
            ? value
            : "—";
      }
    }
  }
  protected render() {
    this.body.replaceChildren();
    const camera = this.camera();
    this.heading.textContent = this.config.title || camera?.nombre || this.defaultTitle();
    if (!camera) {
      this.body.append(el("p", "Cámara sin configurar."));
      return;
    }
    const readings = el("div", "", "grid grid-cols-2 gap-3");
    for (const [key, label] of [
      ["temperature", "Temperatura"],
      ["humidity", "Humedad"],
    ]) {
      const block = el("div");
      const value = el("p", "", "text-lg");
      value.dataset.measurement = key;
      block.append(el("p", label, "text-sm text-ha-secondary"), value);
      readings.append(block);
    }
    this.body.append(
      readings,
      el("p", camera.consigna ? `Consigna: ${ranges(camera.consigna)}` : "Sin consigna"),
    );
    if (camera.origen === "automatica_confirmada")
      this.body.append(el("p", "Automática", "text-sm text-ha-secondary"));
    if (camera.manualHasta)
      this.body.append(
        el("p", `Manual hasta ${new Date(camera.manualHasta).toLocaleString()}`),
      );
    if (camera.pendiente) {
      this.body.append(
        el(
          "p",
          `Pendiente: ${ranges(camera.pendiente.propuesta)}`,
          "border-t border-solid border-ha-border pt-3",
        ),
      );
      this.body.append(button("Revisar", () => this.confirm(camera)));
    }
    this.body.append(
      button("Consigna manual", () => this.manual(camera)),
      button("Actualizar", () => this.refresh()),
    );
    const lots = el("details");
    lots.append(el("summary", `Lotes (${camera.lotes.length})`, "cursor-pointer"));
    const list = el("ul", "", "mt-2 grid gap-2");
    for (const lot of camera.lotes) list.append(el("li", `${lot.codigo} · ${lot.cantidad} ud`));
    lots.append(list);
    this.body.append(lots);
    this.updateMeasurements();
  }
  private confirm(camera: Camera) {
    const pending = camera.pendiente!;
    const { dialog, form } = this.dialog("Cambio de consigna");
    form.append(
      el("p", `Actual: ${ranges(camera.consigna)}`),
      el("p", `Propuesta: ${ranges(pending.propuesta)}`),
    );
    const submit = button("Confirmar", () => {});
    submit.type = "submit";
    form.append(submit);
    form.onsubmit = (event) => {
      event.preventDefault();
      void this.run(async () => {
        await this.request("confirm_change", {
          location_id: camera.ubicacionId,
          proposal_id: pending.id,
        });
        dialog.close();
        this.snapshot = await this.request<Snapshot>("snapshot");
        this.render();
      });
    };
    dialog.showModal();
  }
  private manual(camera: Camera) {
    const { dialog, form } = this.dialog("Consigna manual");
    const id = crypto.randomUUID();
    const start = field("Desde", "datetime-local", localNow());
    const end = field("Hasta", "datetime-local");
    form.append(start.wrapper, end.wrapper);
    const values = new Map<string, HTMLInputElement>();
    for (const [key, label] of [
      ["temperaturaMin", "Temperatura mínima (°C)"],
      ["temperaturaMax", "Temperatura máxima (°C)"],
      ["humedadMin", "Humedad mínima (%)"],
      ["humedadMax", "Humedad máxima (%)"],
    ] as const) {
      const item = field(label, "number", String(camera.consigna?.[key] ?? ""));
      item.input.step = "any";
      if (key.startsWith("humedad")) {
        item.input.min = "0";
        item.input.max = "100";
      }
      values.set(key, item.input);
      form.append(item.wrapper);
    }
    const reason = field("Motivo", "text", "", false);
    reason.input.maxLength = 2000;
    form.append(reason.wrapper);
    const submit = button("Guardar", () => {});
    submit.type = "submit";
    form.append(submit);
    form.onsubmit = (event) => {
      event.preventDefault();
      const payload = {
        id,
        revision: 0,
        zonaHoraria: zone(),
        vigenteDesde: new Date(start.input.value).toISOString(),
        vigenteHasta: new Date(end.input.value).toISOString(),
        motivo: reason.input.value,
        ...Object.fromEntries([...values].map(([key, input]) => [key, Number(input.value)])),
      };
      void this.run(async () => {
        await this.request("set_manual", { location_id: camera.ubicacionId, payload });
        dialog.close();
        this.snapshot = await this.request<Snapshot>("snapshot");
        this.render();
      });
    };
    dialog.showModal();
  }
}

class LotCard extends BaseCard {
  private requestId = crypto.randomUUID();
  static getStubConfig() {
    return { type: "custom:registros-lot-card" };
  }
  protected defaultTitle() {
    return "Nuevo lote";
  }
  protected render() {
    this.body.replaceChildren();
    const form = el("form", "", "grid gap-4");
    const code = field("Código del lote");
    code.input.maxLength = 200;
    const quantity = field("Cantidad (ud)", "number");
    quantity.input.min = "1";
    quantity.input.step = "1";
    quantity.input.max = String(Number.MAX_SAFE_INTEGER);
    const start = field("Fecha de inicio", "date", localNow().slice(0, 10));
    const submit = button("Crear", () => {});
    submit.type = "submit";
    form.append(code.wrapper, quantity.wrapper, start.wrapper, submit);
    form.onsubmit = (event) => {
      event.preventDefault();
      const payload = {
        id: this.requestId,
        codigo: code.input.value,
        cantidad: Number(quantity.input.value),
        iniciadoEn: new Date(`${start.input.value}T12:00:00`).toISOString(),
        zonaHoraria: zone(),
      };
      void this.run(async () => {
        const result = await this.request<{ lote: Lot }>("create_lot", { payload });
        this.requestId = crypto.randomUUID();
        this.body.replaceChildren(
          el("p", `${result.lote.codigo} · Creado`, "font-semibold"),
          button("Nuevo", () => this.render()),
        );
      });
    };
    this.body.append(form);
  }
}

class MovementCard extends BaseCard {
  static getStubConfig() {
    return { type: "custom:registros-movement-card" };
  }
  protected defaultTitle() {
    return "Nuevo movimiento";
  }
  private lots: Lot[] = [];
  private options?: Options;
  private sequence = 0;
  private searchTimer?: ReturnType<typeof setTimeout>;
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.searchTimer);
  }
  protected async render() {
    this.body.replaceChildren();
    const search = field("Buscar lote", "search", "", false);
    const lot = select("Lote", []);
    const date = field("Fecha", "date", localNow().slice(0, 10));
    const rest = el("div", "", "grid gap-4");
    const more = button("Más", () => this.run(() => loadLots(false)));
    const loadLots = async (reset = true) => {
      const sequence = ++this.sequence;
      const result = await this.request<{ lotes: Lot[]; total: number }>("lots", {
        search: search.input.value,
        offset: reset ? 0 : this.lots.length,
      });
      if (sequence !== this.sequence) return;
      this.lots = reset ? result.lotes : [...this.lots, ...result.lotes];
      const selected = lot.input.value;
      const options = select(
        "Lote",
        this.lots.map((l) => ({ value: l.id, label: l.codigo })),
        selected,
      );
      lot.input.replaceChildren(...Array.from(options.input.children));
      lot.input.value = selected;
      more.hidden = this.lots.length >= result.total;
    };
    const loadOptions = () =>
      this.run(async () => {
        rest.replaceChildren();
        this.options = undefined;
        if (!lot.input.value || !date.input.value) return;
        this.options = await this.request<Options>("movement_options", {
          lot_id: lot.input.value,
          date: date.input.value,
        });
        this.renderMovement(rest);
      });
    search.input.oninput = () => {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        void this.run(async () => {
          rest.replaceChildren();
          lot.input.value = "";
          this.options = undefined;
          await loadLots();
        });
      }, 300);
    };
    lot.input.onchange = () => void loadOptions();
    date.input.onchange = () => void loadOptions();
    this.body.append(search.wrapper, lot.wrapper, more, date.wrapper, rest);
    await loadLots();
  }
  private renderMovement(container: HTMLElement) {
    const options = this.options!;
    const name = (id: string) => this.snapshot?.ubicaciones.find((l) => l.id === id)?.nombre ?? id;
    const sourceIds = [...new Set(options.porciones.map((p) => p.ubicacionId))];
    if (!sourceIds.length) {
      container.append(
        el("p", "Sin existencias."),
      );
      return;
    }
    const source = select(
      "Origen",
      sourceIds.map((id) => ({ value: id, label: name(id) })),
    );
    const content = el("div", "", "grid gap-4");
    container.append(source.wrapper, content);
    source.input.onchange = () => {
      content.replaceChildren();
      if (!source.input.value) return;
      const portions = options.porciones.filter((p) => p.ubicacionId === source.input.value);
      const available = portions.reduce((sum, p) => sum + p.restante, 0);
      const mode = select(
        "Tipo",
        [
          { value: "full", label: "Completo" },
          { value: "split", label: "Parcial / reparto" },
        ],
        "full",
      );
      const form = el("form", "", "grid gap-4");
      const rows = el("div", "", "grid gap-4");
      const summary = el("p");
      const mixing = field("Mezcla física", "checkbox", "", false);
      const destinations: {
        node: HTMLElement;
        location: HTMLSelectElement;
        amount: HTMLInputElement;
        sources: Map<string, HTMLInputElement>;
      }[] = [];
      const id = crypto.randomUUID();
      const updateSummary = () => {
        const total = destinations.reduce((sum, d) => sum + Number(d.amount.value), 0);
        summary.textContent = `Salida: ${total} ud · Restante: ${available - total} ud`;
      };
      const add = () => {
        const node = el("div", "", "grid min-w-0 gap-3 border border-solid border-ha-border p-3");
        const target = select(
          "Destino",
          (this.snapshot?.ubicaciones ?? [])
            .filter((l) => l.id !== source.input.value)
            .map((l) => ({ value: l.id, label: l.nombre })),
        );
        const amount = field(
          "Cantidad",
          "number",
          mode.input.value === "full" ? String(available) : "",
        );
        amount.input.min = "1";
        amount.input.max = String(available);
        amount.input.step = "1";
        amount.input.readOnly = mode.input.value === "full";
        const sources = new Map<string, HTMLInputElement>();
        node.append(target.wrapper, amount.wrapper);
        if (mode.input.value === "split" && !mixing.input.checked) {
          node.append(
            el(
              "p",
              "Procedencia",
              "text-sm text-ha-secondary",
            ),
          );
          for (const portion of portions) {
            const f = field(
              `#${portion.orden} · ${portion.fecha} · ${portion.precision} · ${portion.restante} ud`,
              "number",
              "0",
            );
            f.input.min = "0";
            f.input.max = String(portion.restante);
            f.input.step = "1";
            sources.set(portion.id, f.input);
            node.append(f.wrapper);
          }
        }
        const row = { node, location: target.input, amount: amount.input, sources };
        destinations.push(row);
        if (mode.input.value !== "full")
          node.append(
            button("Quitar", () => {
              destinations.splice(destinations.indexOf(row), 1);
              node.remove();
              updateSummary();
            }),
          );
        amount.input.oninput = updateSummary;
        rows.append(node);
        updateSummary();
      };
      const addButton = button("Añadir destino", add);
      addButton.hidden = true;
      const reset = () => {
        destinations.length = 0;
        rows.replaceChildren();
        addButton.hidden = mode.input.value === "full";
        mixing.wrapper.hidden = mode.input.value === "full";
        add();
      };
      mode.input.onchange = reset;
      mixing.input.onchange = reset;
      const submit = button("Registrar", () => {});
      submit.type = "submit";
      form.append(mode.wrapper, mixing.wrapper, rows, addButton, summary, submit);
      content.append(form);
      reset();
      form.onsubmit = (event) => {
        event.preventDefault();
        const payload = {
          id,
          revision: options.lote.revision,
          fecha: options.fecha,
          ubicacionOrigenId: source.input.value,
          mezclarOrigen: mixing.input.checked && mode.input.value === "split",
          destinos: destinations.map((d) => ({
            ubicacionId: d.location.value,
            cantidad: Number(d.amount.value),
            ...(d.sources.size
              ? {
                  procedencias: [...d.sources]
                    .filter(([, input]) => Number(input.value) > 0)
                    .map(([porcionId, input]) => ({ porcionId, cantidad: Number(input.value) })),
                }
              : {}),
          })),
        };
        void this.run(async () => {
          await this.request("register_movement", { lot_id: options.lote.id, payload });
          container.replaceChildren(
            el(
              "p",
              "Registrado",
              "font-semibold",
            ),
          );
        });
      };
    };
  }
}

class CardEditor extends HTMLElement {
  private config: Config = { type: "" };
  private ha?: Hass;
  private entries: Entry[] = [];
  private snapshot?: Snapshot;
  private loading = false;
  private loaded = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config: Config) {
    const changed = this.config.entry_id !== config.entry_id;
    this.config = { ...config };
    if (changed) this.loaded = false;
    this.render();
    void this.load();
  }
  set hass(hass: Hass) {
    this.ha = hass;
    syncTheme(this, hass);
    void this.load();
  }
  private async load() {
    if (!this.ha || this.loading || this.loaded) return;
    this.loading = true;
    const entryId = this.config.entry_id;
    try {
      this.entries = await this.ha.callWS<Entry[]>({ type: "registros_camaras/entries" });
      const snapshot = entryId
        ? await this.ha.callWS<Snapshot>({
            type: "registros_camaras/operation",
            entry_id: entryId,
            operation: "snapshot",
          })
        : undefined;
      if (entryId !== this.config.entry_id) return;
      this.snapshot = snapshot;
      this.loaded = true;
      this.render();
    } catch (error) {
      this.render();
      this.shadowRoot!.append(
        el(
          "p",
          String((error as { message?: string }).message ?? error),
          "p-3 text-ha-text bg-ha-surface",
        ),
      );
    } finally {
      this.loading = false;
      if (entryId !== this.config.entry_id) void this.load();
    }
  }
  private change(key: keyof Config, value: string) {
    this.config = { ...this.config, [key]: value };
    if (key === "entry_id") {
      delete this.config.location_id;
      this.snapshot = undefined;
      this.loaded = false;
      void this.load();
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private render() {
    styleRoot(this.shadowRoot!);
    const form = el("div", "", "grid gap-4 bg-ha-surface p-4 text-ha-text");
    const title = field("Título (opcional)", "text", this.config.title ?? "", false);
    title.input.onchange = () => this.change("title", title.input.value);
    const entry = select(
      "Conexión",
      this.entries.map((e) => ({
        value: e.id,
        label: `${e.title}${e.ready ? "" : " · sin conexión"}`,
      })),
      this.config.entry_id,
    );
    entry.input.onchange = () => this.change("entry_id", entry.input.value);
    form.append(title.wrapper, entry.wrapper);
    if (this.config.type === "custom:registros-camera-card") {
      const camera = select(
        "Cámara",
        (this.snapshot?.camaras ?? []).map((c) => ({ value: c.ubicacionId, label: c.nombre })),
        this.config.location_id,
      );
      camera.input.onchange = () => this.change("location_id", camera.input.value);
      form.append(camera.wrapper);
      for (const [key, label, deviceClass] of [
        ["temperature_entity", "Temperatura (opcional)", "temperature"],
        ["humidity_entity", "Humedad (opcional)"],
      ] as const) {
        const items = Object.entries(this.ha?.states ?? {})
          .filter(
            ([id, state]) =>
              id.startsWith("sensor.") &&
              state.attributes.device_class === (deviceClass ?? "humidity"),
          )
          .map(([id, state]) => ({
            value: id,
            label: String(state.attributes.friendly_name ?? id),
          }));
        const sensor = select(label, items, this.config[key], false);
        sensor.input.onchange = () => this.change(key, sensor.input.value);
        form.append(sensor.wrapper);
      }
    }
    this.shadowRoot!.append(form);
  }
}

customElements.define("registros-camaras-editor", CardEditor);
customElements.define("registros-camera-card", CameraCard);
customElements.define("registros-lot-card", LotCard);
customElements.define("registros-movement-card", MovementCard);
const registry = window as unknown as {
  customCards: { type: string; name: string; description: string; preview: boolean }[];
};
registry.customCards ??= [];
registry.customCards.push(
  {
    type: "registros-camera-card",
    name: "Registros Cámaras · Cámara",
    description: "",
    preview: false,
  },
  {
    type: "registros-lot-card",
    name: "Registros Cámaras · Nuevo lote",
    description: "",
    preview: false,
  },
  {
    type: "registros-movement-card",
    name: "Registros Cámaras · Nuevo movimiento",
    description: "",
    preview: false,
  },
);
