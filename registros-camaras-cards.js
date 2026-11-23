// src/style.css?inline
var e = "w-full min-w-0 border border-neutral-500 bg-neutral-950 px-3 py-2 text-neutral-100 focus:outline-2 focus:outline-neutral-200 disabled:opacity-50", t = () => Intl.DateTimeFormat().resolvedOptions().timeZone, n = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}, r = (e) => e ? `${e.temperaturaMin}–${e.temperaturaMax} °C · ${e.humedadMin}–${e.humedadMax} %` : "Sin consigna";
function i(e, t = "", n = "") {
	let r = document.createElement(e);
	return r.textContent = t, r.className = n, r;
}
function a(e, t) {
	let n = i("button", e, "border border-neutral-500 bg-neutral-800 px-3 py-2 text-neutral-100 hover:bg-neutral-700 focus:outline-2 focus:outline-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed");
	return n.type = "button", n.onclick = () => void t(), n;
}
function o(t, n = "text", r = "", a = !0) {
	let o = i("label", "", "grid min-w-0 gap-1.5 text-sm");
	o.append(i("span", t));
	let s = i("input", "", e);
	return s.type = n, s.value = r, s.required = a, o.append(s), {
		wrapper: o,
		input: s
	};
}
function s(t, n, r = "", a = !0) {
	let o = i("label", "", "grid min-w-0 gap-1.5 text-sm");
	o.append(i("span", t));
	let s = i("select", "", e);
	s.required = a;
	let c = i("option", "Selecciona…");
	c.value = "", s.append(c);
	for (let e of n) {
		let t = i("option", e.label);
		t.value = e.value, s.append(t);
	}
	return s.value = r, o.append(s), {
		wrapper: o,
		input: s
	};
}
function c() {
	let e = i("output", "", "block text-sm text-neutral-300 whitespace-pre-wrap");
	return e.dataset.status = "", e.setAttribute("aria-live", "polite"), e;
}
function l(e) {
	let t = i("style");
	t.textContent = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after{--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}::backdrop{--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-neutral-100:#f5f5f5;--color-neutral-200:#e5e5e5;--color-neutral-300:#d4d4d4;--color-neutral-400:#a1a1a1;--color-neutral-500:#737373;--color-neutral-600:#525252;--color-neutral-700:#404040;--color-neutral-800:#262626;--color-neutral-900:#171717;--color-neutral-950:#0a0a0a;--color-black:#000;--spacing:.25rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-semibold:600;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}@supports (color:lab(0% 0 0)){:root,:host{--color-neutral-100:lab(96.52% -.0000298023 .0000119209);--color-neutral-200:lab(90.952% 0 -.0000119209);--color-neutral-300:lab(84.92% 0 -.0000119209);--color-neutral-400:lab(66.128% -.0000298023 .0000119209);--color-neutral-500:lab(48.496% 0 0);--color-neutral-600:lab(34.924% 0 0);--color-neutral-700:lab(27.036% 0 0);--color-neutral-800:lab(15.204% 0 -.00000596046);--color-neutral-900:lab(7.78201% -.0000149012 0);--color-neutral-950:lab(2.75381% 0 0)}}}@layer base{*,:after,:before{box-sizing:border-box;border:0 solid;margin:0;padding:0}::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.fixed{position:fixed}.static{position:static}.inset-0{inset:0}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-auto{margin:auto}.mt-2{margin-top:calc(var(--spacing) * 2)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.block{display:block}.grid{display:grid}.hidden{display:none}.max-h-\\[90vh\\]{max-height:90vh}.w-\\[min\\(36rem\\,95vw\\)\\]{width:min(36rem,95vw)}.w-full{width:100%}.min-w-0{min-width:0}.cursor-pointer{cursor:pointer}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.overflow-y-auto{overflow-y:auto}.rounded-none{border-radius:0}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-neutral-500{border-color:var(--color-neutral-500)}.border-neutral-600{border-color:var(--color-neutral-600)}.bg-neutral-800{background-color:var(--color-neutral-800)}.bg-neutral-900{background-color:var(--color-neutral-900)}.bg-neutral-950{background-color:var(--color-neutral-950)}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.px-1{padding-inline:var(--spacing)}.px-3{padding-inline:calc(var(--spacing) * 3)}.py-2{padding-block:calc(var(--spacing) * 2)}.pt-3{padding-top:calc(var(--spacing) * 3)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.whitespace-pre-wrap{white-space:pre-wrap}.text-neutral-100{color:var(--color-neutral-100)}.text-neutral-300{color:var(--color-neutral-300)}.text-neutral-400{color:var(--color-neutral-400)}.backdrop\\:bg-black\\/70::backdrop{background-color:#000000b3}@supports (color:color-mix(in lab, red, red)){.backdrop\\:bg-black\\/70::backdrop{background-color:color-mix(in oklab, var(--color-black) 70%, transparent)}}@media (hover:hover){.hover\\:bg-neutral-700:hover{background-color:var(--color-neutral-700)}}.focus\\:outline-2:focus{outline-style:var(--tw-outline-style);outline-width:2px}.focus\\:outline-neutral-200:focus{outline-color:var(--color-neutral-200)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}", e.replaceChildren(t);
}
var u = class extends HTMLElement {
	config = { type: "" };
	ha;
	body = i("div");
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
		this.ha = e, this.start(), this.updateMeasurements();
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
		l(e);
		let t = i("ha-card", "", "block rounded-none bg-neutral-900 text-neutral-100 border border-neutral-600 p-4"), n = i("h2", this.config.title || this.defaultTitle(), "mb-4 text-xl font-semibold");
		this.body = i("div", "", "grid gap-4"), t.append(n, this.body, c()), e.append(t);
	}
	start() {
		this.isConnected && this.ha && !this.initialized && !this.busy && (this.initialized = !0, this.mount(), clearInterval(this.timer), this.config.entry_id ? (this.run(async () => {
			this.snapshot = await this.request("snapshot"), await this.render(), this.rendered = !0;
		}), this.timer = setInterval(() => {
			!this.busy && this.isConnected && !document.hidden && this.refresh();
		}, 6e4)) : this.message("Edita la tarjeta y selecciona la conexión de Registros Cámaras."));
	}
	async request(e, t = {}) {
		if (!this.ha || !this.config.entry_id) throw Error("Selecciona una conexión en el editor de la tarjeta.");
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
			await e(), this.message("Operación completada.");
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
		let t = this.shadowRoot.activeElement, n = i("dialog", "", "fixed inset-0 m-auto w-[min(36rem,95vw)] max-h-[90vh] overflow-y-auto border border-neutral-500 bg-neutral-900 p-5 text-neutral-100 backdrop:bg-black/70");
		n.append(i("h3", e, "mb-4 text-xl font-semibold"));
		let r = i("form", "", "grid gap-4");
		return n.append(r, c(), a("Cerrar", () => n.close())), n.addEventListener("cancel", (e) => {
			this.busy && e.preventDefault();
		}), n.onclose = () => {
			n.remove(), t?.focus();
		}, this.shadowRoot.append(n), {
			dialog: n,
			form: r
		};
	}
}, d = class extends u {
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
		for (let [e, t] of [["temperature", this.config.temperature_entity], ["humidity", this.config.humidity_entity]]) {
			let n = this.shadowRoot.querySelector(`[data-measurement="${e}"]`);
			if (n) {
				let e = t ? this.ha?.states[t] : void 0;
				n.textContent = e ? `${e.state} ${e.attributes.unit_of_measurement ?? ""}` : "Sin sensor seleccionado";
			}
		}
	}
	render() {
		this.body.replaceChildren();
		let e = this.camera();
		if (!e) {
			this.body.append(i("p", "Selecciona una cámara en el editor visual."));
			return;
		}
		this.body.append(i("h3", e.nombre, "font-semibold"));
		let t = i("div", "", "grid grid-cols-2 gap-3");
		for (let [e, n] of [["temperature", "Temperatura medida"], ["humidity", "Humedad medida"]]) {
			let r = i("div"), a = i("p", "", "text-lg");
			a.dataset.measurement = e, r.append(i("p", n, "text-sm text-neutral-400"), a), t.append(r);
		}
		this.body.append(t, i("p", `Consigna vigente: ${r(e.consigna)}`), i("p", `Origen: ${e.origen.replaceAll("_", " ")}`, "text-sm text-neutral-400")), e.manualHasta && this.body.append(i("p", `Excepción manual hasta ${new Date(e.manualHasta).toLocaleString()}`)), e.pendiente && (this.body.append(i("p", `Propuesta pendiente: ${r(e.pendiente.propuesta)}`, "border-t border-neutral-600 pt-3")), this.body.append(a("Ver cambio y confirmar", () => this.confirm(e)))), this.body.append(a("Consigna manual", () => this.manual(e)), a("Actualizar", () => this.refresh()));
		let n = i("details");
		n.append(i("summary", `Lotes presentes (${e.lotes.length})`, "cursor-pointer"));
		let o = i("ul", "", "mt-2 grid gap-2");
		for (let t of e.lotes) o.append(i("li", `${t.codigo} · ${t.cantidad} ud`));
		n.append(o), this.body.append(n), this.body.append(i("p", "La consigna es una referencia de la aplicación, no una orden a un actuador.", "text-xs text-neutral-400")), this.updateMeasurements();
	}
	confirm(e) {
		let t = e.pendiente, { dialog: n, form: o } = this.dialog("Confirmar cambio automático");
		o.append(i("p", `Actual: ${r(e.consigna)}`), i("p", `Propuesta: ${r(t.propuesta)}`), i("p", t.motivo));
		let s = a("Confirmar esta propuesta", () => {});
		s.type = "submit", o.append(s), o.onsubmit = (r) => {
			r.preventDefault(), this.run(async () => {
				await this.request("confirm_change", {
					location_id: e.ubicacionId,
					proposal_id: t.id
				}), n.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, n.showModal();
	}
	manual(e) {
		let { dialog: r, form: s } = this.dialog("Consigna manual temporal"), c = crypto.randomUUID(), l = o("Desde", "datetime-local", n()), u = o("Hasta (obligatorio)", "datetime-local");
		s.append(l.wrapper, u.wrapper);
		let d = /* @__PURE__ */ new Map();
		for (let [t, n] of [
			["temperaturaMin", "Temperatura mínima (°C)"],
			["temperaturaMax", "Temperatura máxima (°C)"],
			["humedadMin", "Humedad mínima (%)"],
			["humedadMax", "Humedad máxima (%)"]
		]) {
			let r = o(n, "number", String(e.consigna?.[t] ?? ""));
			r.input.step = "any", t.startsWith("humedad") && (r.input.min = "0", r.input.max = "100"), d.set(t, r.input), s.append(r.wrapper);
		}
		let f = o("Motivo", "text", "", !1);
		f.input.maxLength = 2e3, s.append(f.wrapper, i("p", `Horas en ${t()}. Al finalizar vuelve la última automática confirmada.`, "text-sm text-neutral-400"));
		let p = a("Guardar consigna manual", () => {});
		p.type = "submit", s.append(p), s.onsubmit = (n) => {
			n.preventDefault();
			let i = {
				id: c,
				revision: 0,
				zonaHoraria: t(),
				vigenteDesde: new Date(l.input.value).toISOString(),
				vigenteHasta: new Date(u.input.value).toISOString(),
				motivo: f.input.value,
				...Object.fromEntries([...d].map(([e, t]) => [e, Number(t.value)]))
			};
			this.run(async () => {
				await this.request("set_manual", {
					location_id: e.ubicacionId,
					payload: i
				}), r.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, r.showModal();
	}
}, f = class extends u {
	requestId = crypto.randomUUID();
	static getStubConfig() {
		return { type: "custom:registros-lot-card" };
	}
	defaultTitle() {
		return "Nuevo lote";
	}
	render() {
		this.body.replaceChildren();
		let e = i("form", "", "grid gap-4"), r = o("Código del lote");
		r.input.maxLength = 200;
		let s = o("Cantidad (unidades)", "number");
		s.input.min = "1", s.input.step = "1", s.input.max = String(2 ** 53 - 1);
		let c = o("Fecha de inicio", "date", n().slice(0, 10)), l = a("Crear lote", () => {});
		l.type = "submit", e.append(r.wrapper, s.wrapper, c.wrapper, i("p", `Zona horaria: ${t()}. La API registra la entrada inicial según el plan de movimientos.`, "text-sm text-neutral-400"), l), e.onsubmit = (e) => {
			e.preventDefault();
			let n = {
				id: this.requestId,
				codigo: r.input.value,
				cantidad: Number(s.input.value),
				iniciadoEn: (/* @__PURE__ */ new Date(`${c.input.value}T12:00:00`)).toISOString(),
				zonaHoraria: t()
			};
			this.run(async () => {
				let e = await this.request("create_lot", { payload: n });
				this.requestId = crypto.randomUUID(), this.body.replaceChildren(i("p", `Lote ${e.lote.codigo} creado.`, "font-semibold"), a("Crear otro lote", () => this.render()));
			});
		}, this.body.append(e);
	}
}, p = class extends u {
	static getStubConfig() {
		return { type: "custom:registros-movement-card" };
	}
	defaultTitle() {
		return "Registrar movimiento";
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
		let e = o("Filtrar lotes por código", "search", "", !1), t = s("Lote", []), r = o("Fecha efectiva del movimiento", "date", n().slice(0, 10)), c = i("div", "", "grid gap-4"), l = a("Cargar más lotes", () => this.run(() => u(!1))), u = async (n = !0) => {
			let r = ++this.sequence, i = await this.request("lots", {
				search: e.input.value,
				offset: n ? 0 : this.lots.length
			});
			if (r !== this.sequence) return;
			this.lots = n ? i.lotes : [...this.lots, ...i.lotes];
			let a = t.input.value, o = s("Lote", this.lots.map((e) => ({
				value: e.id,
				label: e.codigo
			})), a);
			t.input.replaceChildren(...Array.from(o.input.children)), t.input.value = a, l.hidden = this.lots.length >= i.total;
		}, d = () => this.run(async () => {
			c.replaceChildren(), this.options = void 0, t.input.value && r.input.value && (this.options = await this.request("movement_options", {
				lot_id: t.input.value,
				date: r.input.value
			}), this.renderMovement(c));
		});
		e.input.oninput = () => {
			clearTimeout(this.searchTimer), this.searchTimer = setTimeout(() => {
				this.run(async () => {
					c.replaceChildren(), t.input.value = "", this.options = void 0, await u();
				});
			}, 300);
		}, t.input.onchange = () => void d(), r.input.onchange = () => void d(), this.body.append(e.wrapper, t.wrapper, l, r.wrapper, c), await u();
	}
	renderMovement(e) {
		let t = this.options, n = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? e, r = [...new Set(t.porciones.map((e) => e.ubicacionId))];
		if (!r.length) {
			e.append(i("p", "No hay porciones disponibles en esa fecha. Revisa la fecha o el lote."));
			return;
		}
		let c = s("Origen", r.map((e) => ({
			value: e,
			label: n(e)
		}))), l = i("div", "", "grid gap-4");
		e.append(c.wrapper, l), c.input.onchange = () => {
			if (l.replaceChildren(), !c.input.value) return;
			let n = t.porciones.filter((e) => e.ubicacionId === c.input.value), r = n.reduce((e, t) => e + t.restante, 0), u = s("Tipo de movimiento", [{
				value: "full",
				label: `Mover todo (${r} ud)`
			}, {
				value: "split",
				label: "Parcial o reparto entre destinos"
			}], "full"), d = i("form", "", "grid gap-4"), f = i("div", "", "grid gap-4"), p = i("p"), m = o("El origen está físicamente mezclado", "checkbox", "", !1), h = [], g = crypto.randomUUID(), _ = () => {
				let e = h.reduce((e, t) => e + Number(t.amount.value), 0);
				p.textContent = `${e} ud a mover · ${r - e} ud permanecen en origen. Fecha: ${t.fecha} (${t.lote.zonaHoraria}).`;
			}, v = () => {
				let e = i("fieldset", "", "grid min-w-0 gap-3 border border-neutral-600 p-3");
				e.append(i("legend", "Destino", "px-1"));
				let t = s("Ubicación de destino", (this.snapshot?.ubicaciones ?? []).filter((e) => e.id !== c.input.value).map((e) => ({
					value: e.id,
					label: e.nombre
				}))), l = o("Cantidad", "number", u.input.value === "full" ? String(r) : "");
				l.input.min = "1", l.input.max = String(r), l.input.step = "1", l.input.readOnly = u.input.value === "full";
				let d = /* @__PURE__ */ new Map();
				if (e.append(t.wrapper, l.wrapper), u.input.value === "split" && !m.input.checked) {
					e.append(i("p", "Procedencia: indica cuántas unidades salen de cada porción.", "text-sm text-neutral-400"));
					for (let t of n) {
						let n = o(`#${t.orden} · ${t.fecha} · ${t.precision} · disponibles ${t.restante} ud`, "number", "0");
						n.input.min = "0", n.input.max = String(t.restante), n.input.step = "1", d.set(t.id, n.input), e.append(n.wrapper);
					}
				}
				let p = {
					node: e,
					location: t.input,
					amount: l.input,
					sources: d
				};
				h.push(p), u.input.value !== "full" && e.append(a("Quitar destino", () => {
					h.splice(h.indexOf(p), 1), e.remove(), _();
				})), l.input.oninput = _, f.append(e), _();
			}, y = a("Añadir destino", v);
			y.hidden = !0;
			let b = () => {
				h.length = 0, f.replaceChildren(), y.hidden = u.input.value === "full", m.wrapper.hidden = u.input.value === "full", v();
			};
			u.input.onchange = b, m.input.onchange = b;
			let x = a("Registrar movimiento", () => {});
			x.type = "submit", d.append(u.wrapper, m.wrapper, f, y, p, x), l.append(d), b(), d.onsubmit = (n) => {
				n.preventDefault();
				let r = {
					id: g,
					revision: t.lote.revision,
					fecha: t.fecha,
					ubicacionOrigenId: c.input.value,
					mezclarOrigen: m.input.checked && u.input.value === "split",
					destinos: h.map((e) => ({
						ubicacionId: e.location.value,
						cantidad: Number(e.amount.value),
						...e.sources.size ? { procedencias: [...e.sources].filter(([, e]) => Number(e.value) > 0).map(([e, t]) => ({
							porcionId: e,
							cantidad: Number(t.value)
						})) } : {}
					}))
				};
				this.run(async () => {
					await this.request("register_movement", {
						lot_id: t.lote.id,
						payload: r
					}), e.replaceChildren(i("p", "Movimiento registrado. Selecciona de nuevo el lote para cargar las cantidades actualizadas.", "font-semibold"));
				});
			};
		};
	}
}, m = class extends HTMLElement {
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
		this.ha = e, this.load();
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
			this.render(), this.shadowRoot.append(i("p", String(e.message ?? e), "p-3 text-neutral-100 bg-neutral-900"));
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
		l(this.shadowRoot);
		let e = i("div", "", "grid gap-4 bg-neutral-900 p-4 text-neutral-100"), t = o("Título (opcional)", "text", this.config.title ?? "", !1);
		t.input.onchange = () => this.change("title", t.input.value);
		let n = s("Conexión de Registros Cámaras", this.entries.map((e) => ({
			value: e.id,
			label: `${e.title}${e.ready ? "" : " · sin conexión"}`
		})), this.config.entry_id);
		if (n.input.onchange = () => this.change("entry_id", n.input.value), e.append(t.wrapper, n.wrapper), this.config.type === "custom:registros-camera-card") {
			let t = s("Cámara", (this.snapshot?.camaras ?? []).map((e) => ({
				value: e.ubicacionId,
				label: e.nombre
			})), this.config.location_id);
			t.input.onchange = () => this.change("location_id", t.input.value), e.append(t.wrapper);
			for (let [t, n, r] of [[
				"temperature_entity",
				"Sensor de temperatura existente (opcional)",
				"temperature"
			], ["humidity_entity", "Sensor de humedad existente (opcional)"]]) {
				let i = s(n, Object.entries(this.ha?.states ?? {}).filter(([e, t]) => e.startsWith("sensor.") && t.attributes.device_class === (r ?? "humidity")).map(([e, t]) => ({
					value: e,
					label: String(t.attributes.friendly_name ?? e)
				})), this.config[t], !1);
				i.input.onchange = () => this.change(t, i.input.value), e.append(i.wrapper);
			}
		}
		e.append(i("p", "Si no hay conexiones, añade y configura primero la integración Registros Cámaras. Los controles requieren un usuario administrador de HA.", "text-sm text-neutral-400")), this.shadowRoot.append(e);
	}
};
customElements.define("registros-camaras-editor", m), customElements.define("registros-camera-card", d), customElements.define("registros-lot-card", f), customElements.define("registros-movement-card", p);
var h = window;
h.customCards ??= [], h.customCards.push({
	type: "registros-camera-card",
	name: "Registros Cámaras · Cámara",
	description: "Estado, propuestas automáticas y consignas manuales.",
	preview: !1
}, {
	type: "registros-lot-card",
	name: "Registros Cámaras · Nuevo lote",
	description: "Alta de lotes mediante la API.",
	preview: !1
}, {
	type: "registros-movement-card",
	name: "Registros Cámaras · Movimiento",
	description: "Traslados y repartos con fecha y procedencia.",
	preview: !1
});
