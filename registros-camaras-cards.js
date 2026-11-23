// src/style.css?inline
var e = "w-full min-w-0 border border-solid border-ha-control-border bg-ha-input px-3 py-2 text-ha-text focus:outline-2 focus:outline-ha-text disabled:opacity-50", t = () => Intl.DateTimeFormat().resolvedOptions().timeZone, n = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}, r = (e) => {
	let t = new Date(e);
	return (/* @__PURE__ */ new Date(t.getTime() - t.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}, i = (e) => e ? `${e.temperaturaMin}–${e.temperaturaMax} °C · ${e.humedadMin}–${e.humedadMax} %` : "Sin consigna";
function a(e, t = "", n = "") {
	let r = document.createElement(e);
	return r.textContent = t, r.className = n, r;
}
function o(e, t) {
	let n = a("button", e, "border border-solid border-ha-control-border bg-ha-button px-3 py-2 text-ha-text hover:bg-ha-hover focus:outline-2 focus:outline-ha-text disabled:opacity-50 disabled:cursor-not-allowed");
	return n.type = "button", n.onclick = () => void t(), n;
}
function s(t, n = "text", r = "", i = !0) {
	let o = a("label", "", "grid min-w-0 gap-1.5 text-sm");
	o.append(a("span", t));
	let s = a("input", "", e);
	return s.type = n, s.value = r, s.required = i, o.append(s), {
		wrapper: o,
		input: s
	};
}
function c(t, n, r = "", i = !0) {
	let o = a("label", "", "grid min-w-0 gap-1.5 text-sm");
	o.append(a("span", t));
	let s = a("select", "", e);
	s.required = i;
	let c = a("option", "Selecciona…");
	c.value = "", s.append(c);
	for (let e of n) {
		let t = a("option", e.label);
		t.value = e.value, s.append(t);
	}
	return s.value = r, o.append(s), {
		wrapper: o,
		input: s
	};
}
function l() {
	let e = a("output", "", "block empty:hidden text-sm text-ha-secondary whitespace-pre-wrap");
	return e.dataset.status = "", e.setAttribute("aria-live", "polite"), e;
}
function u(e) {
	let t = a("style");
	t.textContent = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after{--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}::backdrop{--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-black:#000;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-semibold:600;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before{box-sizing:border-box;border:0 solid;margin:0;padding:0}::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.fixed{position:fixed}.static{position:static}.inset-0{inset:0}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-auto{margin:auto}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.max-h-\\[90vh\\]{max-height:90vh}.w-\\[min\\(36rem\\,95vw\\)\\]{width:min(36rem,95vw)}.w-full{width:100%}.min-w-0{min-width:0}.cursor-pointer{cursor:pointer}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-wrap{flex-wrap:wrap}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.overflow-y-auto{overflow-y:auto}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-solid{--tw-border-style:solid;border-style:solid}.border-ha-border{border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0))}.border-ha-control-border{border-color:var(--secondary-text-color,#727272)}.bg-ha-button{background-color:var(--secondary-background-color,#f5f5f5)}.bg-ha-input{background-color:var(--input-fill-color,var(--secondary-background-color,#f5f5f5))}.bg-ha-surface{background-color:var(--ha-card-background,var(--card-background-color,#fff))}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.py-2{padding-block:calc(var(--spacing) * 2)}.pt-3{padding-top:calc(var(--spacing) * 3)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.whitespace-pre-wrap{white-space:pre-wrap}.text-ha-secondary{color:var(--secondary-text-color,#727272)}.text-ha-text{color:var(--primary-text-color,#212121)}.\\[--ha-card-border-radius\\:0px\\]{--ha-card-border-radius:0px}.\\[--ha-card-border-width\\:0px\\]{--ha-card-border-width:0px}.backdrop\\:bg-black\\/70::backdrop{background-color:#000000b3}@supports (color:color-mix(in lab, red, red)){.backdrop\\:bg-black\\/70::backdrop{background-color:color-mix(in oklab, var(--color-black) 70%, transparent)}}.empty\\:hidden:empty{display:none}@media (hover:hover){.hover\\:bg-ha-hover:hover{background-color:var(--primary-text-color,#212121)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-ha-hover:hover{background-color:color-mix(in srgb, var(--primary-text-color,#212121) 12%, var(--ha-card-background,var(--card-background-color,#fff)))}}}.focus\\:outline-2:focus{outline-style:var(--tw-outline-style);outline-width:2px}.focus\\:outline-ha-text:focus{outline-color:var(--primary-text-color,#212121)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}", e.replaceChildren(t);
}
function d(e, t) {
	e.style.colorScheme = t.themes ? t.themes.darkMode ? "dark" : "light" : "inherit";
}
var f = class extends HTMLElement {
	config = { type: "" };
	ha;
	body = a("div");
	heading = a("h2");
	snapshot;
	busy = !1;
	timer;
	initialized = !1;
	rendered = !1;
	generation = 0;
	constructor() {
		super(), this.attachShadow({ mode: "open" });
	}
	setConfig(e) {
		this.config = { ...e }, this.initialized = !1, this.snapshot = void 0, this.rendered = !1, this.generation++, this.mount(), this.start();
	}
	set hass(e) {
		this.ha = e, d(this, e), this.start(), this.updateMeasurements();
	}
	connectedCallback() {
		this.initialized = !1, this.start();
	}
	disconnectedCallback() {
		clearInterval(this.timer), this.timer = void 0;
	}
	getCardSize() {
		return 5;
	}
	static getConfigElement() {
		return document.createElement("registros-camaras-editor");
	}
	mount() {
		let e = this.shadowRoot;
		u(e);
		let t = a("ha-card", "", "block [--ha-card-border-radius:0px] [--ha-card-border-width:0px]"), n = a("div", "", "bg-ha-surface text-ha-text border border-solid border-ha-control-border p-4");
		this.heading = a("h2", this.config.title || this.defaultTitle(), "mb-4 text-xl font-semibold"), this.body = a("div", "", "grid gap-4"), n.append(this.heading, this.body, l()), t.append(n), e.append(t);
	}
	start() {
		this.isConnected && this.ha && !this.initialized && !this.busy && (this.initialized = !0, this.mount(), clearInterval(this.timer), this.config.entry_id ? (this.run(async () => {
			this.snapshot = await this.request("snapshot"), await this.render(), this.rendered = !0;
		}), this.timer = setInterval(() => {
			!this.busy && this.isConnected && !document.hidden && this.refresh();
		}, 6e4)) : this.message("Conexión sin configurar."));
	}
	async request(e, t = {}) {
		if (!this.ha || !this.config.entry_id) throw Error("Conexión sin configurar.");
		let n = this.generation, r = await this.ha.callWS({
			type: "registros_camaras/operation",
			entry_id: this.config.entry_id,
			operation: e,
			data: t
		});
		if (n !== this.generation) throw Error("La configuración ha cambiado. Actualiza la tarjeta.");
		return r;
	}
	message(e) {
		this.shadowRoot.querySelectorAll("[data-status]").forEach((t) => t.textContent = e);
	}
	async run(e) {
		if (this.busy) return;
		this.busy = !0, this.message("Procesando…");
		let t = [...this.shadowRoot.querySelectorAll("button,input,select")].map((e) => [e, e.disabled]);
		t.forEach(([e]) => e.disabled = !0);
		try {
			await e(), this.message("");
		} catch (e) {
			this.message(e instanceof Error ? e.message : String(e?.message || e));
		} finally {
			this.busy = !1, t.forEach(([e, t]) => e.disabled = t), this.initialized || this.start();
		}
	}
	async refresh() {
		await this.run(async () => {
			this.snapshot = await this.request("snapshot"), this.rendered ? this.refreshed() : (await this.render(), this.rendered = !0);
		});
	}
	refreshed() {}
	updateMeasurements() {}
	dialog(e) {
		let t = this.shadowRoot.activeElement, n = a("dialog", "", "fixed inset-0 m-auto w-[min(36rem,95vw)] max-h-[90vh] overflow-y-auto border border-solid border-ha-control-border bg-ha-surface p-5 text-ha-text backdrop:bg-black/70");
		n.append(a("h3", e, "mb-4 text-xl font-semibold"));
		let r = a("form", "", "grid gap-4");
		return n.append(r, l(), o("Cerrar", () => n.close())), n.addEventListener("cancel", (e) => {
			this.busy && e.preventDefault();
		}), n.onclose = () => {
			n.remove(), t?.focus();
		}, this.shadowRoot.append(n), {
			dialog: n,
			form: r
		};
	}
}, p = class extends f {
	static getStubConfig() {
		return { type: "custom:registros-camera-card" };
	}
	defaultTitle() {
		return "Cámara";
	}
	camera() {
		return this.snapshot?.camaras.find((e) => e.ubicacionId === this.config.location_id);
	}
	refreshed() {
		this.shadowRoot.querySelector("dialog") || this.render();
	}
	updateMeasurements() {
		let e = new Intl.NumberFormat(this.ha?.locale?.language, {
			maximumFractionDigits: 2,
			useGrouping: !1
		});
		for (let [t, n] of [["temperature", this.config.temperature_entity], ["humidity", this.config.humidity_entity]]) {
			let r = this.shadowRoot.querySelector(`[data-measurement="${t}"]`);
			if (r) {
				let t = n ? this.ha?.states[n] : void 0, i = t?.state.trim() ?? "", a = i ? Number(i) : NaN;
				r.textContent = Number.isFinite(a) ? `${e.format(a)} ${t?.attributes.unit_of_measurement ?? ""}`.trim() : i && !["unknown", "unavailable"].includes(i) ? i : "—";
			}
		}
	}
	render() {
		this.body.replaceChildren();
		let e = this.camera();
		if (this.heading.textContent = this.config.title || e?.nombre || this.defaultTitle(), !e) {
			this.body.append(a("p", "Cámara sin configurar."));
			return;
		}
		let t = a("div", "", "grid grid-cols-2 gap-3");
		for (let [e, n] of [["temperature", "Temperatura"], ["humidity", "Humedad"]]) {
			let r = a("div"), i = a("p", "", "text-lg");
			i.dataset.measurement = e, r.append(a("p", n, "text-sm text-ha-secondary"), i), t.append(r);
		}
		if (this.body.append(t, a("p", e.consigna ? `Consigna: ${i(e.consigna)}` : "Sin consigna")), e.origen === "automatica_confirmada" && this.body.append(a("p", "Automática", "text-sm text-ha-secondary")), e.manualHasta && this.body.append(a("p", `Manual hasta ${new Date(e.manualHasta).toLocaleString()}`)), e.pendiente && (this.body.append(a("p", `Pendiente: ${i(e.pendiente.propuesta)}`, "border-t border-solid border-ha-border pt-3")), this.body.append(o("Revisar", () => this.confirm(e)))), e.manualHasta) {
			let t = a("div", "", "flex flex-wrap gap-2");
			t.append(o("Editar manual", () => this.run(async () => this.manual(e, await this.currentManual(e)))), o("Finalizar manual", () => this.run(async () => this.finishManual(e, await this.currentManual(e))))), this.body.append(t);
		} else this.body.append(o("Consigna manual", () => this.manual(e)));
		this.body.append(o("Actualizar", () => this.refresh()));
		let n = a("details");
		n.append(a("summary", `Lotes (${e.lotes.length})`, "cursor-pointer"));
		let r = a("ul", "", "mt-2 grid gap-2");
		for (let t of e.lotes) r.append(a("li", `${t.codigo} · ${t.cantidad} ud`));
		n.append(r), this.body.append(n), this.updateMeasurements();
	}
	confirm(e) {
		let t = e.pendiente, { dialog: n, form: r } = this.dialog("Cambio de consigna");
		r.append(a("p", `Actual: ${i(e.consigna)}`), a("p", `Propuesta: ${i(t.propuesta)}`));
		let s = o("Confirmar", () => {});
		s.type = "submit", r.append(s), r.onsubmit = (r) => {
			r.preventDefault(), this.run(async () => {
				await this.request("confirm_change", {
					location_id: e.ubicacionId,
					proposal_id: t.id
				}), n.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, n.showModal();
	}
	async currentManual(e) {
		let t = await this.request("manuals", { location_id: e.ubicacionId });
		if (!t.vigente || t.vigente.id !== e.consignaId) throw Error("La consigna ha cambiado. Actualiza la tarjeta.");
		return t.vigente;
	}
	finishManual(e, t) {
		let { dialog: n, form: r } = this.dialog("Finalizar manual");
		r.append(a("p", i(t)));
		let s = o("Confirmar", () => {});
		s.type = "submit", r.append(s), r.onsubmit = (r) => {
			r.preventDefault(), this.run(async () => {
				await this.request("finish_manual", {
					location_id: e.ubicacionId,
					manual_id: t.id,
					payload: { revision: t.revision }
				}), n.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, n.showModal();
	}
	manual(e, i) {
		let { dialog: a, form: c } = this.dialog("Consigna manual"), l = i?.id ?? crypto.randomUUID(), u = i ? r(i.vigenteDesde) : n(), d = i ? r(i.vigenteHasta) : "", f = s("Desde", "datetime-local", u), p = s("Hasta", "datetime-local", d);
		c.append(f.wrapper, p.wrapper);
		let m = /* @__PURE__ */ new Map();
		for (let [t, n] of [
			["temperaturaMin", "Temperatura mínima (°C)"],
			["temperaturaMax", "Temperatura máxima (°C)"],
			["humedadMin", "Humedad mínima (%)"],
			["humedadMax", "Humedad máxima (%)"]
		]) {
			let r = s(n, "number", String((i ?? e.consigna)?.[t] ?? ""));
			r.input.step = "any", t.startsWith("humedad") && (r.input.min = "0", r.input.max = "100"), m.set(t, r.input), c.append(r.wrapper);
		}
		let h = s("Motivo", "text", i?.motivo ?? "", !1);
		h.input.maxLength = 2e3, c.append(h.wrapper);
		let g = o("Guardar", () => {});
		g.type = "submit", c.append(g), c.onsubmit = (n) => {
			n.preventDefault();
			let r = {
				id: l,
				revision: i?.revision ?? 0,
				zonaHoraria: i?.zonaHoraria ?? t(),
				vigenteDesde: i && f.input.value === u ? i.vigenteDesde : new Date(f.input.value).toISOString(),
				vigenteHasta: i && p.input.value === d ? i.vigenteHasta : new Date(p.input.value).toISOString(),
				motivo: h.input.value,
				...Object.fromEntries([...m].map(([e, t]) => [e, Number(t.value)]))
			};
			this.run(async () => {
				await this.request(i ? "update_manual" : "set_manual", {
					location_id: e.ubicacionId,
					manual_id: l,
					payload: r
				}), a.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, a.showModal();
	}
}, m = class extends f {
	requestId = crypto.randomUUID();
	static getStubConfig() {
		return { type: "custom:registros-lot-card" };
	}
	defaultTitle() {
		return "Nuevo lote";
	}
	render() {
		this.body.replaceChildren();
		let e = a("form", "", "grid gap-4"), r = s("Código del lote");
		r.input.maxLength = 200;
		let i = s("Cantidad (ud)", "number");
		i.input.min = "1", i.input.step = "1", i.input.max = String(2 ** 53 - 1);
		let c = s("Fecha de inicio", "date", n().slice(0, 10)), l = o("Crear", () => {});
		l.type = "submit", e.append(r.wrapper, i.wrapper, c.wrapper, l), e.onsubmit = (e) => {
			e.preventDefault();
			let n = {
				id: this.requestId,
				codigo: r.input.value,
				cantidad: Number(i.input.value),
				iniciadoEn: (/* @__PURE__ */ new Date(`${c.input.value}T12:00:00`)).toISOString(),
				zonaHoraria: t()
			};
			this.run(async () => {
				let e = await this.request("create_lot", { payload: n });
				this.requestId = crypto.randomUUID(), this.body.replaceChildren(a("p", `${e.lote.codigo} · Creado`, "font-semibold"), o("Nuevo", () => this.render()));
			});
		}, this.body.append(e);
	}
}, h = class extends f {
	static getStubConfig() {
		return { type: "custom:registros-movement-card" };
	}
	defaultTitle() {
		return "Nuevo movimiento";
	}
	lots = [];
	options;
	sequence = 0;
	searchTimer;
	disconnectedCallback() {
		super.disconnectedCallback(), clearTimeout(this.searchTimer);
	}
	async render() {
		this.body.replaceChildren();
		let e = s("Buscar lote", "search", "", !1), t = c("Lote", []), r = s("Fecha", "date", n().slice(0, 10)), i = a("div", "", "grid gap-4"), l = a("div", "", "grid gap-3"), u = o("Más", () => this.run(() => d(!1))), d = async (n = !0) => {
			let r = ++this.sequence, i = await this.request("lots", {
				search: e.input.value,
				offset: n ? 0 : this.lots.length
			});
			if (r !== this.sequence) return;
			this.lots = n ? i.lotes : [...this.lots, ...i.lotes];
			let a = t.input.value, o = c("Lote", this.lots.map((e) => ({
				value: e.id,
				label: e.codigo
			})), a);
			t.input.replaceChildren(...Array.from(o.input.children)), t.input.value = a, u.hidden = this.lots.length >= i.total;
		}, f = async () => {
			if (i.replaceChildren(), l.replaceChildren(), this.options = void 0, !t.input.value || !r.input.value) return;
			let [e, n] = await Promise.all([this.request("movement_options", {
				lot_id: t.input.value,
				date: r.input.value
			}), this.request("movements", { lot_id: t.input.value })]);
			this.options = e, this.renderMovement(i, e, void 0, f), this.renderHistory(l, n, f);
		}, p = () => this.run(f);
		e.input.oninput = () => {
			clearTimeout(this.searchTimer), this.searchTimer = setTimeout(() => {
				this.run(async () => {
					i.replaceChildren(), l.replaceChildren(), t.input.value = "", this.options = void 0, await d();
				});
			}, 300);
		}, t.input.onchange = () => void p(), r.input.onchange = () => void p(), this.body.append(e.wrapper, t.wrapper, u, r.wrapper, i, l), await d();
	}
	renderHistory(e, t, n) {
		let r = a("details");
		r.append(a("summary", `Movimientos (${t.movimientos.length})`, "cursor-pointer"));
		let i = a("div", "", "mt-3 grid gap-3"), s = [...t.movimientos].reverse(), c = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? "Entrada", l = 0, u = o("Más", () => d()), d = () => {
			for (let e of s.slice(l, l + 10)) {
				let r = a("div", "", "grid gap-2 border-t border-solid border-ha-border pt-3");
				r.append(a("p", `${e.fecha} · #${e.orden}${e.corregidoEn ? " · Corregido" : ""}`, "text-sm text-ha-secondary"));
				for (let t of e.destinos) r.append(a("p", `${c(e.ubicacionOrigenId)} → ${c(t.ubicacionId)} · ${t.cantidad} ud`));
				e.orden !== 0 && r.append(o("Corregir", () => this.run(() => this.editMovement(t.lote.id, e.id, n)))), i.append(r);
			}
			l += 10, u.hidden = l >= s.length;
		};
		d(), r.append(i, u), e.append(r);
	}
	async editMovement(e, t, n) {
		let r = await this.request("movements", { lot_id: e }), i = r.movimientos.find((e) => e.id === t);
		if (!i || i.orden === 0) throw Error("Movimiento no disponible.");
		let { dialog: o, form: c } = this.dialog("Corregir movimiento"), l = a("div", "", "grid gap-4");
		c.replaceWith(l);
		let u = s("Fecha", "date", i.fecha), d = a("div", "", "grid gap-4");
		l.append(u.wrapper, d);
		let f = async () => {
			if (d.replaceChildren(), !u.input.value) return;
			let a = await this.request("movement_options", {
				lot_id: e,
				date: u.input.value,
				movement_id: t
			});
			if (a.lote.revision !== r.lote.revision) throw Error("El lote ha cambiado. Cierra y vuelve a corregir.");
			this.renderMovement(d, a, i, async () => {
				o.close(), await n();
			});
		};
		u.input.onchange = () => void this.run(f);
		try {
			await f(), o.showModal();
		} catch (e) {
			throw o.remove(), e;
		}
	}
	renderMovement(e, t, n, r) {
		let i = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? e, l = [...new Set(t.porciones.map((e) => e.ubicacionId))];
		if (!l.length) {
			e.append(a("p", "Sin existencias."));
			return;
		}
		let u = c("Origen", l.map((e) => ({
			value: e,
			label: i(e)
		})), n?.ubicacionOrigenId ?? ""), d = a("div", "", "grid gap-4");
		e.append(u.wrapper, d);
		let f = () => {
			if (d.replaceChildren(), !u.input.value) return;
			let i = t.porciones.filter((e) => e.ubicacionId === u.input.value), l = i.reduce((e, t) => e + t.restante, 0), f = n?.ubicacionOrigenId === u.input.value ? n : void 0, p = c("Tipo", [{
				value: "full",
				label: "Completo"
			}, {
				value: "split",
				label: "Parcial / reparto"
			}], f ? "split" : "full"), m = a("form", "", "grid gap-4"), h = a("div", "", "grid gap-4"), g = a("p"), _ = s("Mezcla física", "checkbox", "", !1);
			_.input.checked = f?.mezclarOrigen ?? !1;
			let v = [], y = n?.id ?? crypto.randomUUID(), b = () => {
				let e = v.reduce((e, t) => e + Number(t.amount.value), 0);
				g.textContent = `Salida: ${e} ud · Restante: ${l - e} ud`;
			}, x = (e) => {
				let t = a("div", "", "grid min-w-0 gap-3 border border-solid border-ha-border p-3"), n = c("Destino", (this.snapshot?.ubicaciones ?? []).filter((e) => e.id !== u.input.value).map((e) => ({
					value: e.id,
					label: e.nombre
				})), e?.ubicacionId), r = s("Cantidad", "number", e ? String(e.cantidad) : p.input.value === "full" ? String(l) : "");
				r.input.min = "1", r.input.max = String(l), r.input.step = "1", r.input.readOnly = p.input.value === "full";
				let d = /* @__PURE__ */ new Map();
				if (t.append(n.wrapper, r.wrapper), p.input.value === "split" && !_.input.checked) {
					t.append(a("p", "Procedencia", "text-sm text-ha-secondary"));
					for (let n of i) {
						let r = s(`#${n.orden} · ${n.fecha} · ${n.precision} · ${n.restante} ud`, "number", String(e?.procedencias?.find((e) => e.porcionId === n.id)?.cantidad ?? (e && !e.procedencias?.length ? i.length === 1 ? e.cantidad : e.cantidad === l ? n.restante : 0 : 0)));
						r.input.min = "0", r.input.max = String(n.restante), r.input.step = "1", d.set(n.id, r.input), t.append(r.wrapper);
					}
				}
				let f = {
					node: t,
					location: n.input,
					amount: r.input,
					sources: d
				};
				v.push(f), p.input.value !== "full" && t.append(o("Quitar", () => {
					v.splice(v.indexOf(f), 1), t.remove(), b();
				})), r.input.oninput = b, h.append(t), b();
			}, S = o("Añadir destino", () => x());
			S.hidden = !0;
			let C = () => {
				v.length = 0, h.replaceChildren(), S.hidden = p.input.value === "full", _.wrapper.hidden = p.input.value === "full", x();
			};
			p.input.onchange = C, _.input.onchange = C;
			let w = o(n ? "Guardar" : "Registrar", () => {});
			if (w.type = "submit", m.append(p.wrapper, _.wrapper, h, S, g, w), d.append(m), f) {
				S.hidden = !1;
				for (let e of f.destinos) x(e);
			} else C();
			m.onsubmit = (i) => {
				i.preventDefault();
				let o = {
					id: y,
					revision: t.lote.revision,
					fecha: t.fecha,
					ubicacionOrigenId: u.input.value,
					mezclarOrigen: _.input.checked && p.input.value === "split",
					destinos: v.map((e) => ({
						ubicacionId: e.location.value,
						cantidad: Number(e.amount.value),
						...e.sources.size ? { procedencias: [...e.sources].filter(([, e]) => Number(e.value) > 0).map(([e, t]) => ({
							porcionId: e,
							cantidad: Number(t.value)
						})) } : {}
					}))
				};
				this.run(async () => {
					await this.request(n ? "update_movement" : "register_movement", {
						lot_id: t.lote.id,
						movement_id: n?.id,
						payload: o
					}), r ? await r() : e.replaceChildren(a("p", "Registrado", "font-semibold"));
				});
			};
		};
		u.input.onchange = f, n && f();
	}
}, g = class extends HTMLElement {
	config = { type: "" };
	ha;
	entries = [];
	snapshot;
	loading = !1;
	loaded = !1;
	constructor() {
		super(), this.attachShadow({ mode: "open" });
	}
	setConfig(e) {
		let t = this.config.entry_id !== e.entry_id;
		this.config = { ...e }, t && (this.loaded = !1), this.render(), this.load();
	}
	set hass(e) {
		this.ha = e, d(this, e), this.load();
	}
	async load() {
		if (!this.ha || this.loading || this.loaded) return;
		this.loading = !0;
		let e = this.config.entry_id;
		try {
			this.entries = await this.ha.callWS({ type: "registros_camaras/entries" });
			let t = e ? await this.ha.callWS({
				type: "registros_camaras/operation",
				entry_id: e,
				operation: "snapshot"
			}) : void 0;
			if (e !== this.config.entry_id) return;
			this.snapshot = t, this.loaded = !0, this.render();
		} catch (e) {
			this.render(), this.shadowRoot.append(a("p", String(e.message ?? e), "p-3 text-ha-text bg-ha-surface"));
		} finally {
			this.loading = !1, e !== this.config.entry_id && this.load();
		}
	}
	change(e, t) {
		this.config = {
			...this.config,
			[e]: t
		}, e === "entry_id" && (delete this.config.location_id, this.snapshot = void 0, this.loaded = !1, this.load()), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this.config },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		u(this.shadowRoot);
		let e = a("div", "", "grid gap-4 bg-ha-surface p-4 text-ha-text"), t = s("Título (opcional)", "text", this.config.title ?? "", !1);
		t.input.onchange = () => this.change("title", t.input.value);
		let n = c("Conexión", this.entries.map((e) => ({
			value: e.id,
			label: `${e.title}${e.ready ? "" : " · sin conexión"}`
		})), this.config.entry_id);
		if (n.input.onchange = () => this.change("entry_id", n.input.value), e.append(t.wrapper, n.wrapper), this.config.type === "custom:registros-camera-card") {
			let t = c("Cámara", (this.snapshot?.camaras ?? []).map((e) => ({
				value: e.ubicacionId,
				label: e.nombre
			})), this.config.location_id);
			t.input.onchange = () => this.change("location_id", t.input.value), e.append(t.wrapper);
			for (let [t, n, r] of [[
				"temperature_entity",
				"Temperatura (opcional)",
				"temperature"
			], ["humidity_entity", "Humedad (opcional)"]]) {
				let i = c(n, Object.entries(this.ha?.states ?? {}).filter(([e, t]) => e.startsWith("sensor.") && t.attributes.device_class === (r ?? "humidity")).map(([e, t]) => ({
					value: e,
					label: String(t.attributes.friendly_name ?? e)
				})), this.config[t], !1);
				i.input.onchange = () => this.change(t, i.input.value), e.append(i.wrapper);
			}
		}
		this.shadowRoot.append(e);
	}
};
customElements.define("registros-camaras-editor", g), customElements.define("registros-camera-card", p), customElements.define("registros-lot-card", m), customElements.define("registros-movement-card", h);
var _ = window;
_.customCards ??= [], _.customCards.push({
	type: "registros-camera-card",
	name: "Registros Cámaras · Cámara",
	description: "",
	preview: !1
}, {
	type: "registros-lot-card",
	name: "Registros Cámaras · Nuevo lote",
	description: "",
	preview: !1
}, {
	type: "registros-movement-card",
	name: "Registros Cámaras · Nuevo movimiento",
	description: "",
	preview: !1
});
