// src/style.css?inline
var e = (e) => e ? {
	temperaturaMin: e.temperature.min,
	temperaturaMax: e.temperature.max,
	humedadMin: e.humidity.min,
	humedadMax: e.humidity.max
} : null, t = (e) => ({
	temperature: {
		min: e.temperaturaMin,
		max: e.temperaturaMax
	},
	humidity: {
		min: e.humedadMin,
		max: e.humedadMax
	}
}), n = (e) => ({
	id: e.id,
	codigo: e.code,
	zonaHoraria: e.timeZone,
	revision: e.version
});
async function r(e) {
	return (await e.callWS({
		type: "config_entries/get",
		domain: "registros_camaras"
	})).map((e) => ({
		id: e.entry_id,
		title: e.title,
		ready: e.state === "loaded"
	}));
}
async function i(e, t, n, r = {}) {
	return (await e.callWS({
		type: "call_service",
		domain: "registros_camaras",
		service: n,
		service_data: {
			config_entry_id: t,
			...r
		},
		return_response: !0
	})).response;
}
function a(t) {
	if (t.apiVersion !== 1 || t.status !== "ready") throw Error("El centro está sincronizando. Actualiza en unos segundos.");
	return {
		revision: t.revision,
		ubicaciones: t.locations.filter((e) => !e.archived).map((e) => ({
			id: e.id,
			nombre: e.name
		})),
		camaras: t.locations.filter((e) => e.kind !== "terminal" && !e.archived).map((n) => {
			let r = t.chambers.find((e) => e.locationId === n.id), i = r?.manual, a = i ? {
				...e(i.limits),
				id: i.id,
				revision: t.revision,
				zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
				vigenteDesde: new Date(i.startsAt).toISOString(),
				vigenteHasta: new Date(i.endsAt).toISOString(),
				motivo: i.reason
			} : null;
			return {
				revision: t.revision,
				ubicacionId: n.id,
				nombre: n.name,
				estado: r?.status ?? "empty",
				origen: i ? "manual" : r?.automatic ? "automatica_confirmada" : "ninguna",
				consigna: e(r?.effective ?? null),
				manual: a,
				manualHasta: a?.vigenteHasta ?? null,
				consignaId: a?.id ?? null,
				lotes: (r?.occupants ?? []).map((e) => ({
					codigo: t.lotCodes[e.lotId] ?? e.lotId,
					cantidad: e.quantity
				})),
				pendiente: r?.proposal ? {
					id: r.proposal.id,
					propuesta: e(r.proposal.limits),
					motivo: r.status,
					detectadoEn: new Date(r.proposal.createdAt).toISOString()
				} : null
			};
		})
	};
}
async function o(e, t, n, r = {}) {
	return await s(e, t, n, r);
}
async function s(e, t, r, o) {
	let s = (n, r = {}) => i(e, t, n, r);
	if (r === "snapshot") return a(await s("get_snapshot"));
	if (r === "lots") {
		let e = await s("get_lots", o);
		return {
			lotes: e.items.map((e) => n(e.lot)),
			nextBefore: e.nextBefore
		};
	}
	if (r === "movement_options") {
		let e = await s("get_movement_options", {
			lot_id: o.lot_id,
			occurred_on: o.date,
			...o.movement_id ? { correcting: o.movement_id } : {}
		}), t = await s("get_lot", { lot_id: o.lot_id });
		if (t.status !== "projected") throw Error("El lote está sincronizando.");
		return {
			lote: {
				...n(t.lot),
				revision: e.expectedRevision
			},
			fecha: o.date,
			porciones: e.portions.filter((e) => e.remaining > 0).map((e) => ({
				id: e.id,
				ubicacionId: e.locationId,
				restante: e.remaining,
				fecha: e.occurredAt,
				precision: e.precision,
				orden: e.sequence
			}))
		};
	}
	if (r === "movements") {
		let e = await s("get_movement_history", { lot_id: o.lot_id });
		if (e.status !== "projected") throw Error("El historial está sincronizando.");
		let t = await s("get_lot", { lot_id: o.lot_id });
		if (t.status !== "projected") throw Error("El lote está sincronizando.");
		return {
			lote: n(t.lot),
			movimientos: e.data.operations.filter((e) => !e.annulled).map((e) => ({
				id: e.id,
				orden: e.sourceLocationId === null ? 0 : e.sequence,
				fecha: e.occurredOn,
				ubicacionOrigenId: e.sourceLocationId,
				mezclarOrigen: e.mixSources,
				corregidoEn: e.lastReceipt.eventType === "MovementCorrected" ? e.occurredOn : null,
				destinos: e.destinations.map((e) => ({
					ubicacionId: e.locationId,
					cantidad: e.quantity,
					procedencias: e.contributions?.map((e) => ({
						porcionId: e.portionId,
						cantidad: e.quantity
					}))
				}))
			}))
		};
	}
	return c(s, r, o);
}
async function c(e, n, r) {
	let i = r.payload, a = {
		command_id: r.command_id ?? i?.id,
		expected_revision: r.expected_revision ?? i?.revision
	};
	if (n === "confirm_change") return e("confirm_proposal", {
		...a,
		location_id: r.location_id,
		proposal_id: r.proposal_id
	});
	if (n === "finish_manual") return e("finish_manual", {
		...a,
		location_id: r.location_id,
		manual_id: r.manual_id,
		reason: "Finalizada desde Home Assistant"
	});
	if (n === "set_manual" || n === "update_manual") return e(n === "set_manual" ? "schedule_manual" : "replace_manual", {
		...a,
		location_id: r.location_id,
		...n === "update_manual" ? { manual_id: r.manual_id } : {},
		limits: t(i),
		starts_at: Date.parse(i.vigenteDesde),
		ends_at: Date.parse(i.vigenteHasta),
		reason: i.motivo
	});
	if (n === "create_lot") return {
		receipt: await e("create_lot", {
			...a,
			code: i.codigo,
			quantity: i.cantidad,
			started_on: i.iniciadoEn
		}),
		lote: { codigo: i.codigo }
	};
	if (n === "register_movement" || n === "update_movement") return e(n === "register_movement" ? "create_movement" : "correct_movement", {
		...a,
		lot_id: r.lot_id,
		...n === "update_movement" ? {
			movement_id: r.movement_id,
			reason: r.reason
		} : {},
		occurred_on: i.fecha,
		source_location_id: i.ubicacionOrigenId,
		mix_sources: i.mezclarOrigen,
		destinations: i.destinos.map((e) => ({
			locationId: e.ubicacionId,
			quantity: e.cantidad,
			...e.procedencias ? { contributions: e.procedencias.map((e) => ({
				portionId: e.porcionId,
				quantity: e.cantidad
			})) } : {}
		}))
	});
	throw Error("Operación no admitida por la integración nueva.");
}
// src/command.ts
var l = (e) => typeof e == "object" && !!e && "message" in e && (e.message === "Revision changed; refresh and review" || e.message === "Operation rejected"), u = class {
	submitted;
	outcome = "new";
	revision;
	constructor(e) {
		this.revision = e;
	}
	get uncertain() {
		return this.outcome === "uncertain";
	}
	review(e) {
		if (this.uncertain) throw Error("Resultado incierto: reintenta Crear para recuperar el recibo original.");
		this.revision = e, this.submitted = void 0, this.outcome = "new";
	}
	async send(e, t) {
		if (this.outcome === "rejected") throw Error("Actualiza la revisión y revisa los datos antes de volver a crear.");
		this.submitted ??= {
			payload: structuredClone(e),
			expected_revision: this.revision,
			command_id: crypto.randomUUID()
		};
		let n = this.uncertain;
		this.outcome = "uncertain";
		try {
			return await t(structuredClone(this.submitted));
		} catch (e) {
			throw !n && l(e) && (this.outcome = "rejected"), e;
		}
	}
}, d = "w-full min-w-0 border border-solid border-ha-control-border bg-ha-input px-3 py-2 text-ha-text focus:outline-2 focus:outline-ha-text disabled:opacity-50", f = "border border-solid border-ha-control-border bg-ha-button px-3 py-2 text-ha-text hover:bg-ha-hover focus:outline-2 focus:outline-ha-text disabled:opacity-50 disabled:cursor-not-allowed", p = () => Intl.DateTimeFormat().resolvedOptions().timeZone, m = () => {
	let e = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(e.getTime() - e.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}, h = (e) => {
	let t = new Date(e);
	return (/* @__PURE__ */ new Date(t.getTime() - t.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}, g = (e) => e ? `${e.temperaturaMin}–${e.temperaturaMax} °C · ${e.humedadMin}–${e.humedadMax} %` : "Sin consigna";
function _(e, t = "", n = "") {
	let r = document.createElement(e);
	return r.textContent = t, r.className = n, r;
}
function v(e, t) {
	let n = _("button", e, f);
	return n.type = "button", n.onclick = () => void t(), n;
}
function y(e, t = "text", n = "", r = !0) {
	let i = _("label", "", "grid min-w-0 gap-1.5 text-sm");
	i.append(_("span", e));
	let a = _("input", "", d);
	return a.type = t, a.value = n, a.required = r, i.append(a), {
		wrapper: i,
		input: a
	};
}
function b(e, t, n = "", r = !0) {
	let i = _("label", "", "grid min-w-0 gap-1.5 text-sm");
	i.append(_("span", e));
	let a = _("select", "", d);
	a.required = r;
	let o = _("option", "Selecciona…");
	o.value = "", a.append(o);
	for (let e of t) {
		let t = _("option", e.label);
		t.value = e.value, a.append(t);
	}
	return a.value = n, i.append(a), {
		wrapper: i,
		input: a
	};
}
function x() {
	let e = _("output", "", "block empty:hidden text-sm text-ha-secondary whitespace-pre-wrap");
	return e.dataset.status = "", e.setAttribute("aria-live", "polite"), e;
}
function S(e) {
	let t = _("style");
	t.textContent = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after{--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}::backdrop{--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-black:#000;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-semibold:600;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before{box-sizing:border-box;border:0 solid;margin:0;padding:0}::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.visible{visibility:visible}.fixed{position:fixed}.static{position:static}.inset-x-0{inset-inline:0}.top-\\[var\\(--rc-dialog-center\\,50dvh\\)\\]{top:var(--rc-dialog-center,50dvh)}.bottom-auto{bottom:auto}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-0{margin:0}.mx-auto{margin-inline:auto}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.max-h-\\[var\\(--rc-card-height\\,calc\\(100dvh-6rem\\)\\)\\]{max-height:var(--rc-card-height,calc(100dvh - 6rem))}.max-h-\\[var\\(--rc-dialog-height\\,calc\\(100dvh-1\\.5rem\\)\\)\\]{max-height:var(--rc-dialog-height,calc(100dvh - 1.5rem))}.min-h-0{min-height:0}.w-\\[min\\(36rem\\,calc\\(100vw-1\\.5rem\\)\\)\\]{width:min(36rem,100vw - 1.5rem)}.w-full{width:100%}.min-w-0{min-width:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.\\[transform\\:translateY\\(-50\\%\\)\\]{transform:translateY(-50%)}.cursor-pointer{cursor:pointer}.touch-pan-y{--tw-pan-y:pan-y;touch-action:var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, )}.resize{resize:both}.\\[scrollbar-width\\:thin\\]{scrollbar-width:thin}.\\[scrollbar-gutter\\:stable\\]{scrollbar-gutter:stable}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-center{align-items:center}.justify-end{justify-content:flex-end}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-solid{--tw-border-style:solid;border-style:solid}.border-ha-border{border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0))}.border-ha-control-border{border-color:var(--secondary-text-color,#727272)}.bg-ha-button{background-color:var(--secondary-background-color,#f5f5f5)}.bg-ha-input{background-color:var(--input-fill-color,var(--secondary-background-color,#f5f5f5))}.bg-ha-surface{background-color:var(--ha-card-background,var(--card-background-color,#fff))}.p-0{padding:0}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.px-3{padding-inline:calc(var(--spacing) * 3)}.py-2{padding-block:calc(var(--spacing) * 2)}.pt-3{padding-top:calc(var(--spacing) * 3)}.\\[padding-bottom\\:max\\(0\\.75rem\\,env\\(safe-area-inset-bottom\\)\\)\\]{padding-bottom:max(.75rem, env(safe-area-inset-bottom))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.whitespace-pre-wrap{white-space:pre-wrap}.text-ha-secondary{color:var(--secondary-text-color,#727272)}.text-ha-text{color:var(--primary-text-color,#212121)}.\\[--ha-card-border-radius\\:0px\\]{--ha-card-border-radius:0px}.\\[--ha-card-border-width\\:0px\\]{--ha-card-border-width:0px}.\\[overflow-anchor\\:none\\]{overflow-anchor:none}.backdrop\\:bg-black\\/70::backdrop{background-color:#000000b3}@supports (color:color-mix(in lab, red, red)){.backdrop\\:bg-black\\/70::backdrop{background-color:color-mix(in oklab, var(--color-black) 70%, transparent)}}.open\\:flex:is([open],:popover-open,:open){display:flex}.open\\:flex-col:is([open],:popover-open,:open){flex-direction:column}.empty\\:hidden:empty{display:none}@media (hover:hover){.hover\\:bg-ha-hover:hover{background-color:var(--primary-text-color,#212121)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-ha-hover:hover{background-color:color-mix(in srgb, var(--primary-text-color,#212121) 12%, var(--ha-card-background,var(--card-background-color,#fff)))}}}.focus\\:outline-2:focus{outline-style:var(--tw-outline-style);outline-width:2px}.focus\\:outline-ha-text:focus{outline-color:var(--primary-text-color,#212121)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}:is(.\\[\\&\\:not\\(\\:has\\(\\:not\\(\\[hidden\\]\\)\\)\\)\\]\\:hidden:not(:has(:not([hidden]))),.\\[\\&\\:not\\(\\:has\\(button\\)\\)\\:not\\(\\:has\\(output\\:not\\(\\:empty\\)\\)\\)\\]\\:hidden:not(:has(button)):not(:has(output:not(:empty)))){display:none}}:host{min-height:0;display:block}@property --tw-pan-x{syntax:\"*\";inherits:false}@property --tw-pan-y{syntax:\"*\";inherits:false}@property --tw-pinch-zoom{syntax:\"*\";inherits:false}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}", e.replaceChildren(t);
}
function C(e) {
	let t = e.closest("[data-scroll-body]");
	if (!t) return;
	let n = t.getBoundingClientRect(), r = e.getBoundingClientRect();
	r.top < n.top || r.height > n.height ? t.scrollTop += r.top - n.top - 8 : r.bottom > n.bottom && (t.scrollTop += r.bottom - n.bottom + 8);
}
function w(e, t) {
	e.style.colorScheme = t.themes ? t.themes.darkMode ? "dark" : "light" : "inherit";
}
var T = class extends HTMLElement {
	config = { type: "" };
	ha;
	body = _("div");
	heading = _("h2");
	readings = _("div");
	actions = _("div");
	panel = _("div");
	layoutObserver;
	popupHost = null;
	layoutFrame = 0;
	actionOrigin = null;
	refreshing = !1;
	activity = 0;
	viewportChanged = () => {
		cancelAnimationFrame(this.layoutFrame), this.layoutFrame = requestAnimationFrame(() => this.updateViewportLayout());
	};
	snapshot;
	busy = !1;
	timer;
	initialized = !1;
	rendered = !1;
	generation = 0;
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this.shadowRoot.addEventListener("keydown", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) && e.stopPropagation();
		}), this.shadowRoot.addEventListener("focusin", this.viewportChanged), this.shadowRoot.addEventListener("invalid", (e) => {
			e.preventDefault();
			let t = e.target, n = t.form?.querySelector(":invalid") ?? t, r = t.parentElement?.querySelector("[data-field-error]") ?? _("span", "", "text-sm text-ha-text");
			r.dataset.fieldError = "", r.id ||= `error-${crypto.randomUUID()}`, r.textContent = t.validationMessage, t.parentElement?.append(r), t.setAttribute("aria-describedby", r.id), t.setAttribute("aria-invalid", "true"), this.message("Revisa los campos marcados."), requestAnimationFrame(() => {
				n.focus({ preventScroll: !0 }), C(n);
			});
		}, !0), this.shadowRoot.addEventListener("input", (e) => {
			let t = e.target;
			t.matches("input,select") && (t.removeAttribute("aria-invalid"), t.removeAttribute("aria-describedby"), t.parentElement?.querySelector("[data-field-error]")?.remove());
		});
	}
	setConfig(e) {
		this.config = { ...e }, this.initialized = !1, this.snapshot = void 0, this.rendered = !1, this.generation++, this.mount(), this.start();
	}
	set hass(e) {
		this.ha = e, w(this, e), this.start(), this.updateMeasurements();
	}
	connectedCallback() {
		window.addEventListener("resize", this.viewportChanged), window.visualViewport?.addEventListener("resize", this.viewportChanged), window.visualViewport?.addEventListener("scroll", this.viewportChanged), this.layoutObserver ??= new ResizeObserver(this.viewportChanged), this.layoutObserver.observe(this), this.start(), this.watch(), this.viewportChanged();
	}
	disconnectedCallback() {
		clearInterval(this.timer), this.timer = void 0, window.removeEventListener("resize", this.viewportChanged), window.visualViewport?.removeEventListener("resize", this.viewportChanged), window.visualViewport?.removeEventListener("scroll", this.viewportChanged), this.layoutObserver?.disconnect(), this.popupHost?.removeEventListener("transitionend", this.viewportChanged), this.popupHost = null, cancelAnimationFrame(this.layoutFrame);
	}
	getCardSize() {
		return 5;
	}
	static getConfigElement() {
		return document.createElement("registros-camaras-editor");
	}
	mount() {
		let e = this.shadowRoot;
		S(e);
		let t = _("ha-card", "", "block min-h-0 [--ha-card-border-radius:0px] [--ha-card-border-width:0px]"), n = _("div", "", "flex min-h-0 max-h-[var(--rc-card-height,calc(100dvh-6rem))] flex-col overflow-hidden bg-ha-surface text-ha-text border border-solid border-ha-control-border");
		this.panel = n, this.heading = _("h2", this.config.title || this.defaultTitle(), "text-xl font-semibold"), this.readings = _("div", "", "empty:hidden");
		let r = _("header", "", "grid shrink-0 gap-3 border-b border-solid border-ha-border bg-ha-surface p-4 [&:not(:has(:not([hidden])))]:hidden");
		r.append(this.heading, this.readings), this.body = this.scrollBody(), this.body.setAttribute("role", "region"), this.heading.id = `card-${crypto.randomUUID()}`, this.body.setAttribute("aria-labelledby", this.heading.id), this.actions = _("div", "", "flex flex-wrap justify-end gap-2 empty:hidden"), n.append(r, this.body, this.footer(this.actions)), t.append(n), e.append(t), this.viewportChanged();
	}
	scrollBody() {
		let e = _("div", "", "grid min-h-0 content-start gap-4 overflow-y-auto overscroll-contain touch-pan-y p-4 [scrollbar-gutter:stable] [scrollbar-width:thin] [overflow-anchor:none]");
		e.dataset.scrollBody = "", e.tabIndex = 0;
		for (let t of [
			"touchstart",
			"touchmove",
			"touchend",
			"touchcancel"
		]) e.addEventListener(t, (e) => e.stopPropagation(), { passive: !0 });
		return e;
	}
	footer(e, t) {
		let n = _("footer", "", "grid shrink-0 gap-2 border-t border-solid border-ha-border bg-ha-surface p-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] [&:not(:has(button)):not(:has(output:not(:empty)))]:hidden"), r = _("div", "", "flex flex-wrap items-center justify-end gap-2");
		return t && r.append(t), r.append(e), n.append(x(), r), n;
	}
	dockSubmit(e, t) {
		e.id ||= `form-${crypto.randomUUID()}`, t.setAttribute("form", e.id), (e.closest("dialog")?.querySelector("[data-dialog-actions]") ?? this.actions).replaceChildren(t);
	}
	popup() {
		let e = this;
		for (; e;) {
			if (e.classList.contains("bubble-pop-up")) return e;
			e = e.parentElement ?? e.getRootNode().host;
		}
		return null;
	}
	updateViewportLayout() {
		if (!this.isConnected) return;
		let e = window.visualViewport, t = e?.height ?? window.innerHeight, n = e?.offsetTop ?? 0, r = this.popup();
		r !== this.popupHost && (this.popupHost?.removeEventListener("transitionend", this.viewportChanged), this.popupHost = r, r?.addEventListener("transitionend", this.viewportChanged)), r && (r.style.setProperty("--rc-viewport-height", `${t}px`), r.style.setProperty("--rc-viewport-top", `${n}px`));
		let i = t - 96;
		if (r) {
			let e = getComputedStyle(r), n = r.querySelector(".bubble-pop-up-container"), a = n ? getComputedStyle(n) : null, o = (e) => Number.parseFloat(e ?? "") || 0, s = r.querySelector(".bubble-header-container"), c = o(e.maxHeight) || t - 32;
			i = Math.min(t, c) - (s?.offsetHeight ?? 0) - o(e.paddingTop) - o(e.paddingBottom) - o(e.borderTopWidth) - o(e.borderBottomWidth) - o(e.rowGap) - o(a?.paddingTop) - o(a?.paddingBottom);
		}
		this.style.setProperty("--rc-card-height", `${Math.max(120, i)}px`), this.style.setProperty("--rc-dialog-height", `${Math.max(120, t - 24)}px`), this.style.setProperty("--rc-dialog-center", `${n + t / 2}px`), this.heading.hidden = !!r, this.readings.hidden = !this.readings.childElementCount;
		let a = this.shadowRoot.activeElement;
		a?.matches("input,select,textarea") && C(a);
	}
	watch() {
		this.timer ||= setInterval(() => {
			!this.busy && this.isConnected && !document.hidden && !this.shadowRoot.querySelector("dialog[open]") && this.refresh(!0);
		}, 6e4);
	}
	start() {
		this.isConnected && this.ha && !this.initialized && !this.busy && (this.initialized = !0, this.mount(), clearInterval(this.timer), this.timer = void 0, this.config.entry_id ? (this.run(async () => {
			this.snapshot = await this.request("snapshot"), await this.render(), this.rendered = !0;
		}), this.watch()) : this.message("Conexión sin configurar."));
	}
	async request(e, t = {}) {
		if (!this.ha || !this.config.entry_id) throw Error("Conexión sin configurar.");
		let n = this.generation, r = await o(this.ha, this.config.entry_id, e, t);
		if (n !== this.generation) throw Error("La configuración ha cambiado. Actualiza la tarjeta.");
		return r;
	}
	message(e) {
		(e ? this.shadowRoot.querySelector("dialog[open]") ?? this.panel : this.shadowRoot).querySelectorAll("[data-status]").forEach((t) => t.textContent = e);
	}
	async run(e) {
		if (this.busy) return;
		this.busy = !0, this.activity++;
		let t = this.shadowRoot.activeElement;
		this.actionOrigin = t, this.message("Procesando…");
		let n = [...this.shadowRoot.querySelectorAll("button,input,select")].map((e) => [e, e.disabled]);
		n.forEach(([e]) => e.disabled = !0);
		try {
			await e(), this.message("");
		} catch (e) {
			this.message(e instanceof Error ? e.message : String(e?.message || e));
		} finally {
			this.busy = !1, this.actionOrigin = null, n.forEach(([e, t]) => e.disabled = t), t?.isConnected && !this.shadowRoot.querySelector("dialog[open]") && t.focus({ preventScroll: !0 }), this.viewportChanged(), this.initialized || this.start();
		}
	}
	async refresh(e = !1) {
		if (e && this.rendered) {
			if (this.refreshing) return;
			this.refreshing = !0;
			let e = this.generation, t = this.activity;
			try {
				let n = await this.request("snapshot");
				!this.busy && this.isConnected && e === this.generation && t === this.activity && !this.shadowRoot.querySelector("dialog[open]") && (this.snapshot = n, this.refreshed(), this.viewportChanged());
			} catch (n) {
				!this.busy && e === this.generation && t === this.activity && !this.shadowRoot.querySelector("dialog[open]") && this.message(String(n.message ?? n));
			} finally {
				this.refreshing = !1;
			}
		} else await this.run(async () => {
			this.snapshot = await this.request("snapshot"), this.rendered ? this.refreshed() : (await this.render(), this.rendered = !0);
		});
	}
	refreshed() {}
	updateMeasurements() {}
	dialog(e) {
		let t = this.shadowRoot.activeElement ?? this.actionOrigin, n = _("dialog", "", "fixed inset-x-0 bottom-auto top-[var(--rc-dialog-center,50dvh)] m-0 mx-auto w-[min(36rem,calc(100vw-1.5rem))] max-h-[var(--rc-dialog-height,calc(100dvh-1.5rem))] [transform:translateY(-50%)] overflow-hidden border border-solid border-ha-control-border bg-ha-surface p-0 text-ha-text open:flex open:flex-col backdrop:bg-black/70"), r = _("h3", e, "shrink-0 border-b border-solid border-ha-border bg-ha-surface p-4 text-xl font-semibold");
		r.id = `dialog-${crypto.randomUUID()}`, n.setAttribute("aria-labelledby", r.id), n.append(r);
		let i = _("form", "", "grid gap-4"), a = this.scrollBody();
		a.setAttribute("role", "region"), a.setAttribute("aria-labelledby", r.id), a.append(i);
		let o = _("div", "", "flex flex-wrap gap-2");
		return o.dataset.dialogActions = "", n.append(a, this.footer(o, v("Cancelar", () => n.close()))), n.addEventListener("cancel", (e) => {
			this.busy && e.preventDefault();
		}), n.onclose = () => {
			n.remove(), t?.focus({ preventScroll: !0 });
		}, this.shadowRoot.append(n), this.viewportChanged(), {
			dialog: n,
			form: i
		};
	}
}, E = class extends T {
	renderedCamera = "";
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
		if (this.shadowRoot.querySelector("dialog") || JSON.stringify(this.camera()) === this.renderedCamera) return;
		let e = this.body.scrollTop, t = this.body.querySelector("details")?.open, n = this.shadowRoot.activeElement?.textContent;
		this.render();
		let r = this.body.querySelector("details");
		r && (r.open = !!t), this.body.scrollTop = e, n && [...this.actions.querySelectorAll("button")].find((e) => e.textContent === n)?.focus({ preventScroll: !0 });
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
		this.body.replaceChildren(), this.actions.replaceChildren(), this.readings.replaceChildren();
		let e = this.camera();
		if (this.renderedCamera = JSON.stringify(e), this.heading.textContent = this.config.title || e?.nombre || this.defaultTitle(), !e) {
			this.body.append(_("p", "Cámara sin configurar."));
			return;
		}
		let t = _("div", "", "grid grid-cols-2 gap-3");
		for (let [e, n] of [["temperature", "Temperatura"], ["humidity", "Humedad"]]) {
			let r = _("div"), i = _("p", "", "text-lg");
			i.dataset.measurement = e, r.append(_("p", n, "text-sm text-ha-secondary"), i), t.append(r);
		}
		if (this.readings.append(t), this.readings.hidden = !1, this.body.append(_("p", e.consigna ? `Consigna: ${g(e.consigna)}` : "Sin consigna")), e.origen === "automatica_confirmada" && this.body.append(_("p", "Automática", "text-sm text-ha-secondary")), e.manualHasta && this.body.append(_("p", `Manual hasta ${new Date(e.manualHasta).toLocaleString(this.ha?.locale?.language, {
			dateStyle: "short",
			timeStyle: "short"
		})}`)), e.pendiente && (this.body.append(_("p", `Pendiente: ${g(e.pendiente.propuesta)}`, "border-t border-solid border-ha-border pt-3")), this.actions.append(v("Revisar", () => this.confirm(e)))), e.manualHasta) {
			let t = _("div", "", "flex flex-wrap gap-2");
			t.append(v("Editar manual", () => this.run(async () => this.manual(e, await this.currentManual(e)))), v("Finalizar manual", () => this.run(async () => this.finishManual(e, await this.currentManual(e))))), this.actions.append(t);
		} else this.actions.append(v("Consigna manual", () => this.manual(e)));
		this.actions.append(v("Actualizar", () => this.refresh()));
		let n = _("details");
		n.append(_("summary", `Lotes (${e.lotes.length})`, "cursor-pointer"));
		let r = _("ul", "", "mt-2 grid gap-2");
		for (let t of e.lotes) r.append(_("li", `${t.codigo} · ${t.cantidad} ud`));
		n.append(r), this.body.append(n), this.updateMeasurements();
	}
	confirm(e) {
		let t = crypto.randomUUID(), n = e.pendiente, { dialog: r, form: i } = this.dialog("Cambio de consigna");
		i.append(_("p", `Actual: ${g(e.consigna)}`), _("p", `Propuesta: ${g(n.propuesta)}`));
		let a = v("Confirmar", () => {});
		a.type = "submit", this.dockSubmit(i, a), i.onsubmit = (i) => {
			i.preventDefault(), this.run(async () => {
				await this.request("confirm_change", {
					command_id: t,
					expected_revision: e.revision,
					location_id: e.ubicacionId,
					proposal_id: n.id
				}), r.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, r.showModal();
	}
	async currentManual(e) {
		if (!e.manual || e.manual.id !== e.consignaId) throw Error("La consigna ha cambiado. Actualiza la tarjeta.");
		return e.manual;
	}
	finishManual(e, t) {
		let n = crypto.randomUUID(), { dialog: r, form: i } = this.dialog("Finalizar manual");
		i.append(_("p", g(t)));
		let a = v("Confirmar", () => {});
		a.type = "submit", this.dockSubmit(i, a), i.onsubmit = (i) => {
			i.preventDefault(), this.run(async () => {
				await this.request("finish_manual", {
					command_id: n,
					expected_revision: e.revision,
					location_id: e.ubicacionId,
					manual_id: t.id,
					payload: { revision: t.revision }
				}), r.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, r.showModal();
	}
	manual(e, t) {
		let n = crypto.randomUUID(), { dialog: r, form: i } = this.dialog("Consigna manual"), a = t?.id ?? crypto.randomUUID(), o = t ? h(t.vigenteDesde) : m(), s = t ? h(t.vigenteHasta) : "", c = y("Desde", "datetime-local", o);
		c.input.readOnly = !!t;
		let l = y("Hasta", "datetime-local", s);
		i.append(c.wrapper, l.wrapper);
		let u = /* @__PURE__ */ new Map();
		for (let [n, r] of [
			["temperaturaMin", "Temperatura mínima (°C)"],
			["temperaturaMax", "Temperatura máxima (°C)"],
			["humedadMin", "Humedad mínima (%)"],
			["humedadMax", "Humedad máxima (%)"]
		]) {
			let a = y(r, "number", String((t ?? e.consigna)?.[n] ?? ""));
			a.input.step = "any", n.startsWith("humedad") && (a.input.min = "0", a.input.max = "100"), u.set(n, a.input), i.append(a.wrapper);
		}
		let d = y("Motivo", "text", t?.motivo ?? "", !1);
		d.input.maxLength = 2e3, i.append(d.wrapper);
		let f = v("Guardar", () => {});
		f.type = "submit", this.dockSubmit(i, f);
		let g = () => ({
			desde: Date.parse(t ? t.vigenteDesde : c.input.value),
			hasta: Date.parse(t && l.input.value === s ? t.vigenteHasta : l.input.value)
		});
		i.addEventListener("input", () => {
			let e = g();
			l.input.setCustomValidity(e.hasta <= e.desde ? "El fin debe ser posterior al inicio." : "");
			for (let e of ["temperatura", "humedad"]) {
				let t = u.get(`${e}Min`), n = u.get(`${e}Max`);
				n.setCustomValidity(t.value !== "" && n.value !== "" && Number(n.value) < Number(t.value) ? "El máximo debe ser igual o mayor que el mínimo." : "");
			}
		}), i.onsubmit = (i) => {
			i.preventDefault();
			let o = g(), s = {
				id: a,
				revision: t?.revision ?? 0,
				zonaHoraria: t?.zonaHoraria ?? p(),
				vigenteDesde: new Date(o.desde).toISOString(),
				vigenteHasta: new Date(o.hasta).toISOString(),
				motivo: d.input.value,
				...Object.fromEntries([...u].map(([e, t]) => [e, Number(t.value)]))
			};
			this.run(async () => {
				await this.request(t ? "update_manual" : "set_manual", {
					command_id: n,
					expected_revision: e.revision,
					location_id: e.ubicacionId,
					manual_id: a,
					payload: s
				}), r.close(), this.snapshot = await this.request("snapshot"), this.render();
			});
		}, r.showModal();
	}
}, D = class extends T {
	static getStubConfig() {
		return { type: "custom:registros-lot-card" };
	}
	defaultTitle() {
		return "Nuevo lote";
	}
	render() {
		this.body.replaceChildren(), this.actions.replaceChildren();
		let e = _("form", "", "grid gap-4"), t = new u(this.snapshot.revision), n = y("Código del lote");
		n.input.maxLength = 200;
		let r = y("Cantidad (ud)", "number");
		r.input.min = "1", r.input.step = "1", r.input.max = String(2 ** 53 - 1);
		let i = y("Fecha de inicio", "date", m().slice(0, 10)), a = v("Crear", () => {}), o = v("Actualizar revisión", () => this.run(async () => {
			if (t.uncertain) throw Error("Resultado incierto: reintenta Crear para recuperar el recibo original.");
			this.snapshot = await this.request("snapshot"), t.review(this.snapshot.revision);
			for (let e of [
				n.input,
				r.input,
				i.input
			]) e.readOnly = !1;
		}));
		a.type = "submit", e.append(n.wrapper, r.wrapper, i.wrapper), e.onsubmit = (e) => {
			e.preventDefault();
			let a = {
				codigo: n.input.value,
				cantidad: Number(r.input.value),
				iniciadoEn: i.input.value,
				zonaHoraria: p()
			};
			this.run(async () => {
				let e;
				try {
					e = await t.send(a, (e) => this.request("create_lot", e));
				} catch (e) {
					for (let e of [
						n.input,
						r.input,
						i.input
					]) e.readOnly = t.uncertain;
					throw e;
				}
				this.actions.replaceChildren(), this.body.replaceChildren(_("p", `${e.lote.codigo} · Creado`, "font-semibold"), v("Nuevo", () => this.run(async () => {
					this.snapshot = await this.request("snapshot"), this.render();
				})));
			});
		}, this.body.append(e), this.dockSubmit(e, a), this.actions.append(o);
	}
}, O = class extends T {
	static getStubConfig() {
		return { type: "custom:registros-movement-card" };
	}
	defaultTitle() {
		return "Nuevo movimiento";
	}
	lots = [];
	nextBefore = null;
	options;
	sequence = 0;
	searchTimer;
	disconnectedCallback() {
		super.disconnectedCallback(), clearTimeout(this.searchTimer);
	}
	async render() {
		this.body.replaceChildren(), this.actions.replaceChildren();
		let e = y("Buscar lote", "search", "", !1), t = b("Lote", []), n = y("Fecha", "date", m().slice(0, 10)), r = _("div", "", "grid gap-4"), i = _("div", "", "grid gap-3"), a = v("Más", () => this.run(() => o(!1))), o = async (n = !0) => {
			let r = ++this.sequence, i = await this.request("lots", {
				search: e.input.value,
				...n || this.nextBefore === null ? {} : { before: this.nextBefore }
			});
			if (r !== this.sequence) return;
			this.lots = n ? i.lotes : [...this.lots, ...i.lotes];
			let o = t.input.value, s = b("Lote", this.lots.map((e) => ({
				value: e.id,
				label: e.codigo
			})), o);
			t.input.replaceChildren(...Array.from(s.input.children)), t.input.value = o, this.nextBefore = i.nextBefore, a.hidden = i.nextBefore === null;
		}, s = async (e = !1) => {
			let a = this.body.scrollTop, o = e && !!i.querySelector("details")?.open, c = e ? Number(i.querySelector("details")?.dataset.count ?? 10) : 10;
			if (r.replaceChildren(), i.replaceChildren(), this.actions.replaceChildren(), this.options = void 0, !t.input.value || !n.input.value) return;
			let [l, u] = await Promise.all([this.request("movement_options", {
				lot_id: t.input.value,
				date: n.input.value
			}), this.request("movements", { lot_id: t.input.value })]);
			this.options = l;
			let d = () => s(!0);
			this.renderMovement(r, l, void 0, d), this.renderHistory(i, u, d, c), i.querySelector("details").open = o, this.body.scrollTop = e ? a : 0;
		}, c = () => this.run(s);
		e.input.oninput = () => {
			clearTimeout(this.searchTimer), this.searchTimer = setTimeout(() => {
				this.run(async () => {
					r.replaceChildren(), i.replaceChildren(), this.actions.replaceChildren(), t.input.value = "", this.options = void 0, await o();
				});
			}, 300);
		}, t.input.onchange = () => void c(), n.input.onchange = () => void c(), this.body.append(e.wrapper, t.wrapper, a, n.wrapper, r, i), await o();
	}
	renderHistory(e, t, n, r = 10) {
		let i = _("details");
		i.append(_("summary", `Movimientos (${t.movimientos.length})`, "cursor-pointer"));
		let a = _("div", "", "mt-3 grid gap-3"), o = [...t.movimientos].reverse(), s = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? "Entrada", c = 0, l = v("Más", () => u()), u = (e = 10) => {
			let r = this.body.scrollTop;
			for (let r of o.slice(c, c + e)) {
				let e = _("div", "", "grid gap-2 border-t border-solid border-ha-border pt-3");
				e.append(_("p", `${r.fecha} · #${r.orden}${r.corregidoEn ? " · Corregido" : ""}`, "text-sm text-ha-secondary"));
				for (let t of r.destinos) e.append(_("p", `${s(r.ubicacionOrigenId)} → ${s(t.ubicacionId)} · ${t.cantidad} ud`));
				r.orden !== 0 && e.append(Object.assign(v("Corregir", () => this.run(() => this.editMovement(t.lote.id, r.id, n))), { id: `movement-${r.id}` })), a.append(e);
			}
			c += e, i.dataset.count = String(c), l.hidden = c >= o.length, this.body.scrollTop = r;
		};
		u(r), i.append(a, l), e.append(i);
	}
	async editMovement(e, t, n) {
		let r = await this.request("movements", { lot_id: e }), i = r.movimientos.find((e) => e.id === t);
		if (!i || i.orden === 0) throw Error("Movimiento no disponible.");
		let { dialog: a, form: o } = this.dialog("Corregir movimiento"), s = _("div", "", "grid gap-4");
		o.replaceWith(s);
		let c = y("Fecha", "date", i.fecha), l = _("div", "", "grid gap-4");
		s.append(c.wrapper, l);
		let u = async () => {
			if (l.replaceChildren(), a.querySelector("[data-dialog-actions]").replaceChildren(), !c.input.value) return;
			let o = await this.request("movement_options", {
				lot_id: e,
				date: c.input.value,
				movement_id: t
			}), s = await this.request("movements", { lot_id: e });
			if (JSON.stringify(s.movimientos) !== JSON.stringify(r.movimientos)) throw Error("El lote ha cambiado. Cierra y vuelve a corregir.");
			this.renderMovement(l, o, i, async () => {
				a.close(), await n(), this.shadowRoot.getElementById(`movement-${t}`)?.focus({ preventScroll: !0 });
			});
		};
		c.input.onchange = () => void this.run(u);
		try {
			await u(), a.showModal();
		} catch (e) {
			throw a.remove(), e;
		}
	}
	renderMovement(e, t, n, r) {
		let i = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? e, a = [...new Set(t.porciones.map((e) => e.ubicacionId))];
		if (!a.length) {
			e.append(_("p", "Sin existencias."));
			return;
		}
		let o = b("Origen", a.map((e) => ({
			value: e,
			label: i(e)
		})), n?.ubicacionOrigenId ?? ""), s = _("div", "", "grid gap-4");
		e.append(o.wrapper, s);
		let c = () => {
			if (s.replaceChildren(), (e.closest("dialog")?.querySelector("[data-dialog-actions]") ?? this.actions).replaceChildren(), !o.input.value) return;
			let i = t.porciones.filter((e) => e.ubicacionId === o.input.value), a = i.reduce((e, t) => e + t.restante, 0), c = n?.ubicacionOrigenId === o.input.value ? n : void 0, l = b("Tipo", [{
				value: "full",
				label: "Completo"
			}, {
				value: "split",
				label: "Parcial / reparto"
			}], c ? "split" : "full"), u = _("form", "", "grid gap-4"), d = _("div", "", "grid gap-4"), f = _("p"), p = y("Mezcla física", "checkbox", "", !1);
			p.input.checked = c?.mezclarOrigen ?? !1;
			let m = [], h = n?.id ?? crypto.randomUUID(), g = crypto.randomUUID(), x = y("Motivo de la corrección", "text", "", !!n), S = () => {
				let e = m.reduce((e, t) => e + Number(t.amount.value), 0);
				f.textContent = `Salida: ${e} ud · Restante: ${a - e} ud`;
			}, w = (e) => {
				let t = _("div", "", "grid min-w-0 gap-3 border border-solid border-ha-border p-3"), n = b("Destino", (this.snapshot?.ubicaciones ?? []).filter((e) => e.id !== o.input.value).map((e) => ({
					value: e.id,
					label: e.nombre
				})), e?.ubicacionId), r = y("Cantidad", "number", e ? String(e.cantidad) : l.input.value === "full" ? String(a) : "");
				r.input.min = "1", r.input.max = String(a), r.input.step = "1", r.input.readOnly = l.input.value === "full";
				let s = /* @__PURE__ */ new Map();
				if (t.append(n.wrapper, r.wrapper), l.input.value === "split" && !p.input.checked) {
					t.append(_("p", "Procedencia", "text-sm text-ha-secondary"));
					for (let n of i) {
						let r = y(`#${n.orden} · ${n.fecha} · ${n.precision} · ${n.restante} ud`, "number", String(e?.procedencias?.find((e) => e.porcionId === n.id)?.cantidad ?? (e && !e.procedencias?.length ? i.length === 1 ? e.cantidad : e.cantidad === a ? n.restante : 0 : 0)));
						r.input.min = "0", r.input.max = String(n.restante), r.input.step = "1", s.set(n.id, r.input), t.append(r.wrapper);
					}
				}
				let c = {
					node: t,
					location: n.input,
					amount: r.input,
					sources: s
				};
				m.push(c), l.input.value !== "full" && t.append(v("Quitar", () => {
					m.splice(m.indexOf(c), 1), t.remove(), S();
				})), r.input.oninput = S, d.append(t), S();
			}, T = v("Añadir destino", () => {
				let e = this.body.scrollTop;
				w(), this.body.scrollTop = e, m.at(-1)?.location.focus({ preventScroll: !0 });
				let t = m.at(-1);
				t && C(t.node);
			});
			T.hidden = !0;
			let E = () => {
				m.length = 0, d.replaceChildren(), T.hidden = l.input.value === "full", p.wrapper.hidden = l.input.value === "full", w();
			};
			l.input.onchange = E, p.input.onchange = E;
			let D = v(n ? "Guardar" : "Registrar", () => {});
			if (D.type = "submit", u.append(l.wrapper, p.wrapper, d, T, f), n && u.append(x.wrapper), s.append(u), this.dockSubmit(u, D), c) {
				T.hidden = !1;
				for (let e of c.destinos) w(e);
			} else E();
			u.onsubmit = (i) => {
				i.preventDefault();
				let a = {
					id: h,
					revision: t.lote.revision,
					fecha: t.fecha,
					ubicacionOrigenId: o.input.value,
					mezclarOrigen: p.input.checked && l.input.value === "split",
					destinos: m.map((e) => ({
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
						command_id: g,
						reason: x.input.value,
						lot_id: t.lote.id,
						movement_id: n?.id,
						payload: a
					}), r ? await r() : e.replaceChildren(_("p", "Registrado", "font-semibold"));
				});
			};
		};
		o.input.onchange = c, n && c();
	}
}, k = class extends HTMLElement {
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
		this.ha = e, w(this, e), this.load();
	}
	async load() {
		if (!this.ha || this.loading || this.loaded) return;
		this.loading = !0;
		let e = this.config.entry_id;
		try {
			this.entries = await r(this.ha);
			let t = e ? await o(this.ha, e, "snapshot") : void 0;
			if (e !== this.config.entry_id) return;
			this.snapshot = t, this.loaded = !0, this.render();
		} catch (e) {
			this.render(), this.shadowRoot.append(_("p", String(e.message ?? e), "p-3 text-ha-text bg-ha-surface"));
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
		S(this.shadowRoot);
		let e = _("div", "", "grid gap-4 bg-ha-surface p-4 text-ha-text"), t = y("Título (opcional)", "text", this.config.title ?? "", !1);
		t.input.onchange = () => this.change("title", t.input.value);
		let n = b("Conexión", this.entries.map((e) => ({
			value: e.id,
			label: `${e.title}${e.ready ? "" : " · sin conexión"}`
		})), this.config.entry_id);
		if (n.input.onchange = () => this.change("entry_id", n.input.value), e.append(t.wrapper, n.wrapper), this.config.type === "custom:registros-camera-card") {
			let t = b("Cámara", (this.snapshot?.camaras ?? []).map((e) => ({
				value: e.ubicacionId,
				label: e.nombre
			})), this.config.location_id);
			t.input.onchange = () => this.change("location_id", t.input.value), e.append(t.wrapper);
			for (let [t, n, r] of [[
				"temperature_entity",
				"Temperatura (opcional)",
				"temperature"
			], ["humidity_entity", "Humedad (opcional)"]]) {
				let i = b(n, Object.entries(this.ha?.states ?? {}).filter(([e, t]) => e.startsWith("sensor.") && t.attributes.device_class === (r ?? "humidity")).map(([e, t]) => ({
					value: e,
					label: String(t.attributes.friendly_name ?? e)
				})), this.config[t], !1);
				i.input.onchange = () => this.change(t, i.input.value), e.append(i.wrapper);
			}
		}
		this.shadowRoot.append(e);
	}
};
customElements.define("registros-camaras-editor", k), customElements.define("registros-camera-card", E), customElements.define("registros-lot-card", D), customElements.define("registros-movement-card", O);
var A = window;
A.customCards ??= [], A.customCards.push({
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
