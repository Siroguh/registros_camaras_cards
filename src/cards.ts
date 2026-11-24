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
  consignaId: string | null;
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
type Manual = Ranges & {
  id: string;
  revision: number;
  zonaHoraria: string;
  vigenteDesde: string;
  vigenteHasta: string;
  motivo: string | null;
};
type Destination = {
  ubicacionId: string;
  cantidad: number;
  procedencias?: { porcionId: string; cantidad: number }[];
};
type Movement = {
  id: string;
  orden: number;
  fecha: string;
  ubicacionOrigenId: string | null;
  destinos: Destination[];
  mezclarOrigen?: boolean;
  corregidoEn: string | null;
};
type History = { lote: Lot; movimientos: Movement[] };

const inputClass =
  "w-full min-w-0 border border-solid border-ha-control-border bg-ha-input px-3 py-2 text-ha-text focus:outline-2 focus:outline-ha-text disabled:opacity-50";
const buttonClass =
  "border border-solid border-ha-control-border bg-ha-button px-3 py-2 text-ha-text hover:bg-ha-hover focus:outline-2 focus:outline-ha-text disabled:opacity-50 disabled:cursor-not-allowed";
const zone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const localNow = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const localTime = (value: string) => {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
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
  const output = el(
    "output",
    "",
    "block empty:hidden text-sm text-ha-secondary whitespace-pre-wrap",
  );
  output.dataset.status = "";
  output.setAttribute("aria-live", "polite");
  return output;
}
function styleRoot(root: ShadowRoot) {
  const style = el("style");
  style.textContent = styles;
  root.replaceChildren(style);
}

function revealField(element: HTMLElement) {
  const body = element.closest<HTMLElement>("[data-scroll-body]");
  if (!body) return;
  const bounds = body.getBoundingClientRect();
  const field = element.getBoundingClientRect();
  if (field.top < bounds.top || field.height > bounds.height)
    body.scrollTop += field.top - bounds.top - 8;
  else if (field.bottom > bounds.bottom) body.scrollTop += field.bottom - bounds.bottom + 8;
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
  protected readings = el("div");
  protected actions = el("div");
  private panel = el("div");
  private layoutObserver?: ResizeObserver;
  private popupHost: HTMLElement | null = null;
  private layoutFrame = 0;
  private actionOrigin: HTMLElement | null = null;
  private refreshing = false;
  private activity = 0;
  private readonly viewportChanged = () => {
    cancelAnimationFrame(this.layoutFrame);
    this.layoutFrame = requestAnimationFrame(() => this.updateViewportLayout());
  };
  protected snapshot?: Snapshot;
  protected busy = false;
  private timer?: ReturnType<typeof setInterval>;
  private initialized = false;
  private rendered = false;
  protected generation = 0;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.addEventListener("keydown", (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
        event.stopPropagation();
    });
    this.shadowRoot!.addEventListener("focusin", this.viewportChanged);
    this.shadowRoot!.addEventListener(
      "invalid",
      (event) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement;
        const input = target.form?.querySelector<HTMLElement>(":invalid") ?? target;
        const error =
          target.parentElement?.querySelector<HTMLElement>("[data-field-error]") ??
          el("span", "", "text-sm text-ha-text");
        error.dataset.fieldError = "";
        error.id ||= `error-${crypto.randomUUID()}`;
        error.textContent = target.validationMessage;
        target.parentElement?.append(error);
        target.setAttribute("aria-describedby", error.id);
        target.setAttribute("aria-invalid", "true");
        this.message("Revisa los campos marcados.");
        requestAnimationFrame(() => {
          input.focus({ preventScroll: true });
          revealField(input);
        });
      },
      true,
    );
    this.shadowRoot!.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.matches("input,select")) return;
      target.removeAttribute("aria-invalid");
      target.removeAttribute("aria-describedby");
      target.parentElement?.querySelector("[data-field-error]")?.remove();
    });
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
    window.addEventListener("resize", this.viewportChanged);
    window.visualViewport?.addEventListener("resize", this.viewportChanged);
    window.visualViewport?.addEventListener("scroll", this.viewportChanged);
    this.layoutObserver ??= new ResizeObserver(this.viewportChanged);
    this.layoutObserver.observe(this);
    this.start();
    this.watch();
    this.viewportChanged();
  }
  disconnectedCallback() {
    clearInterval(this.timer);
    this.timer = undefined;
    window.removeEventListener("resize", this.viewportChanged);
    window.visualViewport?.removeEventListener("resize", this.viewportChanged);
    window.visualViewport?.removeEventListener("scroll", this.viewportChanged);
    this.layoutObserver?.disconnect();
    this.popupHost?.removeEventListener("transitionend", this.viewportChanged);
    this.popupHost = null;
    cancelAnimationFrame(this.layoutFrame);
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
      "block min-h-0 [--ha-card-border-radius:0px] [--ha-card-border-width:0px]",
    );
    const panel = el(
      "div",
      "",
      "flex min-h-0 max-h-[var(--rc-card-height,calc(100dvh-6rem))] flex-col overflow-hidden bg-ha-surface text-ha-text border border-solid border-ha-control-border",
    );
    this.panel = panel;
    this.heading = el("h2", this.config.title || this.defaultTitle(), "text-xl font-semibold");
    this.readings = el("div", "", "empty:hidden");
    const header = el(
      "header",
      "",
      "grid shrink-0 gap-3 border-b border-solid border-ha-border bg-ha-surface p-4 [&:not(:has(:not([hidden])))]:hidden",
    );
    header.append(this.heading, this.readings);
    this.body = this.scrollBody();
    this.body.setAttribute("role", "region");
    this.heading.id = `card-${crypto.randomUUID()}`;
    this.body.setAttribute("aria-labelledby", this.heading.id);
    this.actions = el("div", "", "flex flex-wrap justify-end gap-2 empty:hidden");
    panel.append(header, this.body, this.footer(this.actions));
    card.append(panel);
    root.append(card);
    this.viewportChanged();
  }
  private scrollBody() {
    const body = el(
      "div",
      "",
      "grid min-h-0 content-start gap-4 overflow-y-auto overscroll-contain touch-pan-y p-4 [scrollbar-gutter:stable] [scrollbar-width:thin] [overflow-anchor:none]",
    );
    body.dataset.scrollBody = "";
    body.tabIndex = 0;
    return body;
  }
  private footer(actions: HTMLElement, cancel?: HTMLButtonElement) {
    const footer = el(
      "footer",
      "",
      "grid shrink-0 gap-2 border-t border-solid border-ha-border bg-ha-surface p-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] [&:not(:has(button)):not(:has(output:not(:empty)))]:hidden",
    );
    const row = el("div", "", "flex flex-wrap items-center justify-end gap-2");
    if (cancel) row.append(cancel);
    row.append(actions);
    footer.append(status(), row);
    return footer;
  }
  protected dockSubmit(form: HTMLFormElement, submit: HTMLButtonElement) {
    form.id ||= `form-${crypto.randomUUID()}`;
    submit.setAttribute("form", form.id);
    const actions =
      form.closest("dialog")?.querySelector<HTMLElement>("[data-dialog-actions]") ?? this.actions;
    actions.replaceChildren(submit);
  }
  private popup() {
    let node: HTMLElement | null = this;
    while (node) {
      if (node.classList.contains("bubble-pop-up")) return node;
      node = node.parentElement ?? ((node.getRootNode() as ShadowRoot).host as HTMLElement | null);
    }
    return null;
  }
  private updateViewportLayout() {
    if (!this.isConnected) return;
    const viewport = window.visualViewport;
    const height = viewport?.height ?? window.innerHeight;
    const top = viewport?.offsetTop ?? 0;
    const popup = this.popup();
    if (popup !== this.popupHost) {
      this.popupHost?.removeEventListener("transitionend", this.viewportChanged);
      this.popupHost = popup;
      popup?.addEventListener("transitionend", this.viewportChanged);
    }
    if (popup) {
      popup.style.setProperty("--rc-viewport-height", `${height}px`);
      popup.style.setProperty("--rc-viewport-top", `${top}px`);
    }
    const available = popup
      ? top + height - this.panel.getBoundingClientRect().top - 24
      : height - 96;
    this.style.setProperty("--rc-card-height", `${Math.max(120, available)}px`);
    this.style.setProperty("--rc-dialog-height", `${Math.max(120, height - 24)}px`);
    this.style.setProperty("--rc-dialog-center", `${top + height / 2}px`);
    // The configured Bubble header supplies the same title and close action.
    this.heading.hidden = Boolean(popup);
    this.readings.hidden = !this.readings.childElementCount;
    const focused = this.shadowRoot!.activeElement as HTMLElement | null;
    if (focused?.matches("input,select,textarea")) revealField(focused);
  }
  private watch() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      if (
        !this.busy &&
        this.isConnected &&
        !document.hidden &&
        !this.shadowRoot!.querySelector("dialog[open]")
      )
        void this.refresh(true);
    }, 60_000);
  }
  private start() {
    if (!this.isConnected || !this.ha || this.initialized || this.busy) return;
    this.initialized = true;
    this.mount();
    clearInterval(this.timer);
    this.timer = undefined;
    if (!this.config.entry_id) {
      this.message("Conexión sin configurar.");
      return;
    }
    void this.run(async () => {
      this.snapshot = await this.request<Snapshot>("snapshot");
      await this.render();
      this.rendered = true;
    });
    this.watch();
  }
  protected async request<T>(operation: string, data: Record<string, unknown> = {}): Promise<T> {
    if (!this.ha || !this.config.entry_id) throw new Error("Conexión sin configurar.");
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
    const scope = text
      ? (this.shadowRoot!.querySelector("dialog[open]") ?? this.panel)
      : this.shadowRoot!;
    scope
      .querySelectorAll<HTMLOutputElement>("[data-status]")
      .forEach((n) => (n.textContent = text));
  }
  protected async run(work: () => Promise<void>) {
    if (this.busy) return;
    this.busy = true;
    this.activity++;
    const focused = this.shadowRoot!.activeElement as HTMLElement | null;
    this.actionOrigin = focused;
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
      this.actionOrigin = null;
      previous.forEach(([n, disabled]) => (n.disabled = disabled));
      if (focused?.isConnected && !this.shadowRoot!.querySelector("dialog[open]"))
        focused.focus({ preventScroll: true });
      this.viewportChanged();
      if (!this.initialized) this.start();
    }
  }
  protected async refresh(quiet = false) {
    if (quiet && this.rendered) {
      if (this.refreshing) return;
      this.refreshing = true;
      const generation = this.generation;
      const activity = this.activity;
      try {
        const snapshot = await this.request<Snapshot>("snapshot");
        if (
          !this.busy &&
          this.isConnected &&
          generation === this.generation &&
          activity === this.activity &&
          !this.shadowRoot!.querySelector("dialog[open]")
        ) {
          this.snapshot = snapshot;
          this.refreshed();
          this.viewportChanged();
        }
      } catch (error) {
        if (
          !this.busy &&
          generation === this.generation &&
          activity === this.activity &&
          !this.shadowRoot!.querySelector("dialog[open]")
        )
          this.message(String((error as Error).message ?? error));
      } finally {
        this.refreshing = false;
      }
      return;
    }
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
    const origin = (this.shadowRoot!.activeElement as HTMLElement | null) ?? this.actionOrigin;
    const dialog = el(
      "dialog",
      "",
      "fixed inset-x-0 bottom-auto top-[var(--rc-dialog-center,50dvh)] m-0 mx-auto w-[min(36rem,calc(100vw-1.5rem))] max-h-[var(--rc-dialog-height,calc(100dvh-1.5rem))] [transform:translateY(-50%)] overflow-hidden border border-solid border-ha-control-border bg-ha-surface p-0 text-ha-text open:flex open:flex-col backdrop:bg-black/70",
    );
    const heading = el(
      "h3",
      title,
      "shrink-0 border-b border-solid border-ha-border bg-ha-surface p-4 text-xl font-semibold",
    );
    heading.id = `dialog-${crypto.randomUUID()}`;
    dialog.setAttribute("aria-labelledby", heading.id);
    dialog.append(heading);
    const form = el("form", "", "grid gap-4");
    const body = this.scrollBody();
    body.setAttribute("role", "region");
    body.setAttribute("aria-labelledby", heading.id);
    body.append(form);
    const actions = el("div", "", "flex flex-wrap gap-2");
    actions.dataset.dialogActions = "";
    dialog.append(
      body,
      this.footer(
        actions,
        button("Cancelar", () => dialog.close()),
      ),
    );
    dialog.addEventListener("cancel", (event) => {
      if (this.busy) event.preventDefault();
    });
    dialog.onclose = () => {
      dialog.remove();
      origin?.focus({ preventScroll: true });
    };
    this.shadowRoot!.append(dialog);
    this.viewportChanged();
    return { dialog, form };
  }
}

class CameraCard extends BaseCard {
  private renderedCamera = "";
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
    if (
      this.shadowRoot!.querySelector("dialog") ||
      JSON.stringify(this.camera()) === this.renderedCamera
    )
      return;
    const scroll = this.body.scrollTop;
    const expanded = this.body.querySelector("details")?.open;
    const focused = (this.shadowRoot!.activeElement as HTMLElement | null)?.textContent;
    this.render();
    const details = this.body.querySelector("details");
    if (details) details.open = Boolean(expanded);
    this.body.scrollTop = scroll;
    if (focused)
      [...this.actions.querySelectorAll("button")]
        .find((b) => b.textContent === focused)
        ?.focus({ preventScroll: true });
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
    this.actions.replaceChildren();
    this.readings.replaceChildren();
    const camera = this.camera();
    this.renderedCamera = JSON.stringify(camera);
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
    this.readings.append(readings);
    this.readings.hidden = false;
    this.body.append(
      el("p", camera.consigna ? `Consigna: ${ranges(camera.consigna)}` : "Sin consigna"),
    );
    if (camera.origen === "automatica_confirmada")
      this.body.append(el("p", "Automática", "text-sm text-ha-secondary"));
    if (camera.manualHasta)
      this.body.append(
        el(
          "p",
          `Manual hasta ${new Date(camera.manualHasta).toLocaleString(this.ha?.locale?.language, { dateStyle: "short", timeStyle: "short" })}`,
        ),
      );
    if (camera.pendiente) {
      this.body.append(
        el(
          "p",
          `Pendiente: ${ranges(camera.pendiente.propuesta)}`,
          "border-t border-solid border-ha-border pt-3",
        ),
      );
      this.actions.append(button("Revisar", () => this.confirm(camera)));
    }
    if (camera.manualHasta) {
      const actions = el("div", "", "flex flex-wrap gap-2");
      actions.append(
        button("Editar manual", () =>
          this.run(async () => this.manual(camera, await this.currentManual(camera))),
        ),
        button("Finalizar manual", () =>
          this.run(async () => this.finishManual(camera, await this.currentManual(camera))),
        ),
      );
      this.actions.append(actions);
    } else this.actions.append(button("Consigna manual", () => this.manual(camera)));
    this.actions.append(button("Actualizar", () => this.refresh()));
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
    this.dockSubmit(form, submit);
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
  private async currentManual(camera: Camera) {
    const result = await this.request<{ vigente: Manual | null }>("manuals", {
      location_id: camera.ubicacionId,
    });
    if (!result.vigente || result.vigente.id !== camera.consignaId)
      throw new Error("La consigna ha cambiado. Actualiza la tarjeta.");
    return result.vigente;
  }
  private finishManual(camera: Camera, manual: Manual) {
    const { dialog, form } = this.dialog("Finalizar manual");
    form.append(el("p", ranges(manual)));
    const submit = button("Confirmar", () => {});
    submit.type = "submit";
    this.dockSubmit(form, submit);
    form.onsubmit = (event) => {
      event.preventDefault();
      void this.run(async () => {
        await this.request("finish_manual", {
          location_id: camera.ubicacionId,
          manual_id: manual.id,
          payload: { revision: manual.revision },
        });
        dialog.close();
        this.snapshot = await this.request<Snapshot>("snapshot");
        this.render();
      });
    };
    dialog.showModal();
  }
  private manual(camera: Camera, existing?: Manual) {
    const { dialog, form } = this.dialog("Consigna manual");
    const id = existing?.id ?? crypto.randomUUID();
    const startValue = existing ? localTime(existing.vigenteDesde) : localNow();
    const endValue = existing ? localTime(existing.vigenteHasta) : "";
    const start = field("Desde", "datetime-local", startValue);
    const end = field("Hasta", "datetime-local", endValue);
    form.append(start.wrapper, end.wrapper);
    const values = new Map<string, HTMLInputElement>();
    for (const [key, label] of [
      ["temperaturaMin", "Temperatura mínima (°C)"],
      ["temperaturaMax", "Temperatura máxima (°C)"],
      ["humedadMin", "Humedad mínima (%)"],
      ["humedadMax", "Humedad máxima (%)"],
    ] as const) {
      const item = field(label, "number", String((existing ?? camera.consigna)?.[key] ?? ""));
      item.input.step = "any";
      if (key.startsWith("humedad")) {
        item.input.min = "0";
        item.input.max = "100";
      }
      values.set(key, item.input);
      form.append(item.wrapper);
    }
    const reason = field("Motivo", "text", existing?.motivo ?? "", false);
    reason.input.maxLength = 2000;
    form.append(reason.wrapper);
    const submit = button("Guardar", () => {});
    submit.type = "submit";
    this.dockSubmit(form, submit);
    const validate = () => {
      end.input.setCustomValidity(
        end.input.value && start.input.value && end.input.value <= start.input.value
          ? "El fin debe ser posterior al inicio."
          : "",
      );
      for (const prefix of ["temperatura", "humedad"]) {
        const min = values.get(`${prefix}Min`)!;
        const max = values.get(`${prefix}Max`)!;
        max.setCustomValidity(
          min.value !== "" && max.value !== "" && Number(max.value) < Number(min.value)
            ? "El máximo debe ser igual o mayor que el mínimo."
            : "",
        );
      }
    };
    form.addEventListener("input", validate);
    form.onsubmit = (event) => {
      event.preventDefault();
      const payload = {
        id,
        revision: existing?.revision ?? 0,
        zonaHoraria: existing?.zonaHoraria ?? zone(),
        vigenteDesde:
          existing && start.input.value === startValue
            ? existing.vigenteDesde
            : new Date(start.input.value).toISOString(),
        vigenteHasta:
          existing && end.input.value === endValue
            ? existing.vigenteHasta
            : new Date(end.input.value).toISOString(),
        motivo: reason.input.value,
        ...Object.fromEntries([...values].map(([key, input]) => [key, Number(input.value)])),
      };
      void this.run(async () => {
        await this.request(existing ? "update_manual" : "set_manual", {
          location_id: camera.ubicacionId,
          manual_id: id,
          payload,
        });
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
    this.actions.replaceChildren();
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
    form.append(code.wrapper, quantity.wrapper, start.wrapper);
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
        this.actions.replaceChildren();
        this.body.replaceChildren(
          el("p", `${result.lote.codigo} · Creado`, "font-semibold"),
          button("Nuevo", () => this.render()),
        );
      });
    };
    this.body.append(form);
    this.dockSubmit(form, submit);
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
    this.actions.replaceChildren();
    const search = field("Buscar lote", "search", "", false);
    const lot = select("Lote", []);
    const date = field("Fecha", "date", localNow().slice(0, 10));
    const rest = el("div", "", "grid gap-4");
    const history = el("div", "", "grid gap-3");
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
    const loadSelected = async (preserve = false) => {
      const scroll = this.body.scrollTop;
      const expanded = preserve && Boolean(history.querySelector("details")?.open);
      const count = preserve ? Number(history.querySelector("details")?.dataset.count ?? 10) : 10;
      rest.replaceChildren();
      history.replaceChildren();
      this.actions.replaceChildren();
      this.options = undefined;
      if (!lot.input.value || !date.input.value) return;
      const [options, movements] = await Promise.all([
        this.request<Options>("movement_options", {
          lot_id: lot.input.value,
          date: date.input.value,
        }),
        this.request<History>("movements", { lot_id: lot.input.value }),
      ]);
      this.options = options;
      const reload = () => loadSelected(true);
      this.renderMovement(rest, options, undefined, reload);
      this.renderHistory(history, movements, reload, count);
      history.querySelector("details")!.open = expanded;
      this.body.scrollTop = preserve ? scroll : 0;
    };
    const loadOptions = () => this.run(loadSelected);
    search.input.oninput = () => {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        void this.run(async () => {
          rest.replaceChildren();
          history.replaceChildren();
          this.actions.replaceChildren();
          lot.input.value = "";
          this.options = undefined;
          await loadLots();
        });
      }, 300);
    };
    lot.input.onchange = () => void loadOptions();
    date.input.onchange = () => void loadOptions();
    this.body.append(search.wrapper, lot.wrapper, more, date.wrapper, rest, history);
    await loadLots();
  }
  private renderHistory(
    container: HTMLElement,
    history: History,
    reload: () => Promise<void>,
    visible = 10,
  ) {
    const details = el("details");
    details.append(el("summary", `Movimientos (${history.movimientos.length})`, "cursor-pointer"));
    const list = el("div", "", "mt-3 grid gap-3");
    const ordered = [...history.movimientos].reverse();
    const name = (id: string | null) =>
      this.snapshot?.ubicaciones.find((l) => l.id === id)?.nombre ?? "Entrada";
    let count = 0;
    const more = button("Más", () => append());
    const append = (size = 10) => {
      const scroll = this.body.scrollTop;
      for (const movement of ordered.slice(count, count + size)) {
        const row = el("div", "", "grid gap-2 border-t border-solid border-ha-border pt-3");
        row.append(
          el(
            "p",
            `${movement.fecha} · #${movement.orden}${movement.corregidoEn ? " · Corregido" : ""}`,
            "text-sm text-ha-secondary",
          ),
        );
        for (const destination of movement.destinos)
          row.append(
            el(
              "p",
              `${name(movement.ubicacionOrigenId)} → ${name(destination.ubicacionId)} · ${destination.cantidad} ud`,
            ),
          );
        if (movement.orden !== 0)
          row.append(
            Object.assign(
              button("Corregir", () =>
                this.run(() => this.editMovement(history.lote.id, movement.id, reload)),
              ),
              { id: `movement-${movement.id}` },
            ),
          );
        list.append(row);
      }
      count += size;
      details.dataset.count = String(count);
      more.hidden = count >= ordered.length;
      this.body.scrollTop = scroll;
    };
    append(visible);
    details.append(list, more);
    container.append(details);
  }
  private async editMovement(lotId: string, movementId: string, reload: () => Promise<void>) {
    const history = await this.request<History>("movements", { lot_id: lotId });
    const movement = history.movimientos.find((m) => m.id === movementId);
    if (!movement || movement.orden === 0) throw new Error("Movimiento no disponible.");
    const { dialog, form } = this.dialog("Corregir movimiento");
    // The movement editor owns its form; avoid nesting forms in the dialog.
    const content = el("div", "", "grid gap-4");
    form.replaceWith(content);
    const date = field("Fecha", "date", movement.fecha);
    const fields = el("div", "", "grid gap-4");
    content.append(date.wrapper, fields);
    const load = async () => {
      fields.replaceChildren();
      dialog.querySelector("[data-dialog-actions]")!.replaceChildren();
      if (!date.input.value) return;
      const options = await this.request<Options>("movement_options", {
        lot_id: lotId,
        date: date.input.value,
        movement_id: movementId,
      });
      // Never combine a fresh stock revision with an older edit draft.
      if (options.lote.revision !== history.lote.revision)
        throw new Error("El lote ha cambiado. Cierra y vuelve a corregir.");
      this.renderMovement(fields, options, movement, async () => {
        dialog.close();
        await reload();
        this.shadowRoot!.getElementById(`movement-${movementId}`)?.focus({ preventScroll: true });
      });
    };
    date.input.onchange = () => void this.run(load);
    try {
      await load();
      dialog.showModal();
    } catch (error) {
      dialog.remove();
      throw error;
    }
  }
  private renderMovement(
    container: HTMLElement,
    options: Options,
    editing?: Movement,
    saved?: () => Promise<void>,
  ) {
    const name = (id: string) => this.snapshot?.ubicaciones.find((l) => l.id === id)?.nombre ?? id;
    const sourceIds = [...new Set(options.porciones.map((p) => p.ubicacionId))];
    if (!sourceIds.length) {
      container.append(el("p", "Sin existencias."));
      return;
    }
    const source = select(
      "Origen",
      sourceIds.map((id) => ({ value: id, label: name(id) })),
      editing?.ubicacionOrigenId ?? "",
    );
    const content = el("div", "", "grid gap-4");
    container.append(source.wrapper, content);
    const renderSource = () => {
      content.replaceChildren();
      const actions =
        container.closest("dialog")?.querySelector<HTMLElement>("[data-dialog-actions]") ??
        this.actions;
      actions.replaceChildren();
      if (!source.input.value) return;
      const portions = options.porciones.filter((p) => p.ubicacionId === source.input.value);
      const available = portions.reduce((sum, p) => sum + p.restante, 0);
      const seed = editing?.ubicacionOrigenId === source.input.value ? editing : undefined;
      const mode = select(
        "Tipo",
        [
          { value: "full", label: "Completo" },
          { value: "split", label: "Parcial / reparto" },
        ],
        seed ? "split" : "full",
      );
      const form = el("form", "", "grid gap-4");
      const rows = el("div", "", "grid gap-4");
      const summary = el("p");
      const mixing = field("Mezcla física", "checkbox", "", false);
      mixing.input.checked = seed?.mezclarOrigen ?? false;
      const destinations: {
        node: HTMLElement;
        location: HTMLSelectElement;
        amount: HTMLInputElement;
        sources: Map<string, HTMLInputElement>;
      }[] = [];
      const id = editing?.id ?? crypto.randomUUID();
      const updateSummary = () => {
        const total = destinations.reduce((sum, d) => sum + Number(d.amount.value), 0);
        summary.textContent = `Salida: ${total} ud · Restante: ${available - total} ud`;
      };
      const add = (initial?: Destination) => {
        const node = el("div", "", "grid min-w-0 gap-3 border border-solid border-ha-border p-3");
        const target = select(
          "Destino",
          (this.snapshot?.ubicaciones ?? [])
            .filter((l) => l.id !== source.input.value)
            .map((l) => ({ value: l.id, label: l.nombre })),
          initial?.ubicacionId,
        );
        const amount = field(
          "Cantidad",
          "number",
          initial ? String(initial.cantidad) : mode.input.value === "full" ? String(available) : "",
        );
        amount.input.min = "1";
        amount.input.max = String(available);
        amount.input.step = "1";
        amount.input.readOnly = mode.input.value === "full";
        const sources = new Map<string, HTMLInputElement>();
        node.append(target.wrapper, amount.wrapper);
        if (mode.input.value === "split" && !mixing.input.checked) {
          node.append(el("p", "Procedencia", "text-sm text-ha-secondary"));
          for (const portion of portions) {
            const f = field(
              `#${portion.orden} · ${portion.fecha} · ${portion.precision} · ${portion.restante} ud`,
              "number",
              String(
                initial?.procedencias?.find((p) => p.porcionId === portion.id)?.cantidad ??
                  (initial && !initial.procedencias?.length
                    ? portions.length === 1
                      ? initial.cantidad
                      : initial.cantidad === available
                        ? portion.restante
                        : 0
                    : 0),
              ),
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
      const addButton = button("Añadir destino", () => {
        const scroll = this.body.scrollTop;
        add();
        this.body.scrollTop = scroll;
        destinations.at(-1)?.location.focus({ preventScroll: true });
        const destination = destinations.at(-1);
        if (destination) revealField(destination.node);
      });
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
      const submit = button(editing ? "Guardar" : "Registrar", () => {});
      submit.type = "submit";
      form.append(mode.wrapper, mixing.wrapper, rows, addButton, summary);
      content.append(form);
      this.dockSubmit(form, submit);
      if (seed) {
        addButton.hidden = false;
        for (const destination of seed.destinos) add(destination);
      } else reset();
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
          await this.request(editing ? "update_movement" : "register_movement", {
            lot_id: options.lote.id,
            movement_id: editing?.id,
            payload,
          });
          if (saved) {
            await saved();
            return;
          }
          container.replaceChildren(el("p", "Registrado", "font-semibold"));
        });
      };
    };
    source.input.onchange = renderSource;
    if (editing) renderSource();
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
