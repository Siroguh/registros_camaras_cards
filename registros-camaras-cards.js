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
	t.textContent = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:block))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after{--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}::backdrop{--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-border-style:solid;--tw-font-weight:initial;--tw-outline-style:solid}}}@layer theme{:root,:host{--font-sans:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-black:#000;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-semibold:600;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before{box-sizing:border-box;border:0 solid;margin:0;padding:0}::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring:where(:not(iframe)){outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.visible{visibility:visible}.fixed{position:fixed}.static{position:static}.inset-x-0{inset-inline:0}.top-\\[var\\(--rc-dialog-center\\,50dvh\\)\\]{top:var(--rc-dialog-center,50dvh)}.bottom-auto{bottom:auto}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-0{margin:0}.mx-auto{margin-inline:auto}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.max-h-\\[var\\(--rc-card-height\\,calc\\(100dvh-6rem\\)\\)\\]{max-height:var(--rc-card-height,calc(100dvh - 6rem))}.max-h-\\[var\\(--rc-dialog-height\\,calc\\(100dvh-1\\.5rem\\)\\)\\]{max-height:var(--rc-dialog-height,calc(100dvh - 1.5rem))}.min-h-0{min-height:0}.w-\\[min\\(36rem\\,calc\\(100vw-1\\.5rem\\)\\)\\]{width:min(36rem,100vw - 1.5rem)}.w-full{width:100%}.min-w-0{min-width:0}.shrink-0{flex-shrink:0}.\\[transform\\:translateY\\(-50\\%\\)\\]{transform:translateY(-50%)}.cursor-pointer{cursor:pointer}.touch-pan-y{--tw-pan-y:pan-y;touch-action:var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, )}.resize{resize:both}.\\[scrollbar-width\\:thin\\]{scrollbar-width:thin}.\\[scrollbar-gutter\\:stable\\]{scrollbar-gutter:stable}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-center{align-items:center}.justify-end{justify-content:flex-end}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-solid{--tw-border-style:solid;border-style:solid}.border-ha-border{border-color:var(--ha-card-border-color,var(--divider-color,#e0e0e0))}.border-ha-control-border{border-color:var(--secondary-text-color,#727272)}.bg-ha-button{background-color:var(--secondary-background-color,#f5f5f5)}.bg-ha-input{background-color:var(--input-fill-color,var(--secondary-background-color,#f5f5f5))}.bg-ha-surface{background-color:var(--ha-card-background,var(--card-background-color,#fff))}.p-0{padding:0}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.px-3{padding-inline:calc(var(--spacing) * 3)}.py-2{padding-block:calc(var(--spacing) * 2)}.pt-3{padding-top:calc(var(--spacing) * 3)}.\\[padding-bottom\\:max\\(0\\.75rem\\,env\\(safe-area-inset-bottom\\)\\)\\]{padding-bottom:max(.75rem, env(safe-area-inset-bottom))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.whitespace-pre-wrap{white-space:pre-wrap}.text-ha-secondary{color:var(--secondary-text-color,#727272)}.text-ha-text{color:var(--primary-text-color,#212121)}.\\[--ha-card-border-radius\\:0px\\]{--ha-card-border-radius:0px}.\\[--ha-card-border-width\\:0px\\]{--ha-card-border-width:0px}.\\[overflow-anchor\\:none\\]{overflow-anchor:none}.backdrop\\:bg-black\\/70::backdrop{background-color:#000000b3}@supports (color:color-mix(in lab, red, red)){.backdrop\\:bg-black\\/70::backdrop{background-color:color-mix(in oklab, var(--color-black) 70%, transparent)}}.open\\:flex:is([open],:popover-open,:open){display:flex}.open\\:flex-col:is([open],:popover-open,:open){flex-direction:column}.empty\\:hidden:empty{display:none}@media (hover:hover){.hover\\:bg-ha-hover:hover{background-color:var(--primary-text-color,#212121)}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-ha-hover:hover{background-color:color-mix(in srgb, var(--primary-text-color,#212121) 12%, var(--ha-card-background,var(--card-background-color,#fff)))}}}.focus\\:outline-2:focus{outline-style:var(--tw-outline-style);outline-width:2px}.focus\\:outline-ha-text:focus{outline-color:var(--primary-text-color,#212121)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}:is(.\\[\\&\\:not\\(\\:has\\(\\:not\\(\\[hidden\\]\\)\\)\\)\\]\\:hidden:not(:has(:not([hidden]))),.\\[\\&\\:not\\(\\:has\\(button\\)\\)\\:not\\(\\:has\\(output\\:not\\(\\:empty\\)\\)\\)\\]\\:hidden:not(:has(button)):not(:has(output:not(:empty)))){display:none}}:host{min-height:0;display:block}@property --tw-pan-x{syntax:\"*\";inherits:false}@property --tw-pan-y{syntax:\"*\";inherits:false}@property --tw-pinch-zoom{syntax:\"*\";inherits:false}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}", e.replaceChildren(t);
}
function d(e) {
	let t = e.closest("[data-scroll-body]");
	if (!t) return;
	let n = t.getBoundingClientRect(), r = e.getBoundingClientRect();
	r.top < n.top || r.height > n.height ? t.scrollTop += r.top - n.top - 8 : r.bottom > n.bottom && (t.scrollTop += r.bottom - n.bottom + 8);
}
function f(e, t) {
	e.style.colorScheme = t.themes ? t.themes.darkMode ? "dark" : "light" : "inherit";
}
var p = class extends HTMLElement {
	config = { type: "" };
	ha;
	body = a("div");
	heading = a("h2");
	readings = a("div");
	actions = a("div");
	panel = a("div");
	layoutObserver;
	popupHost = null;
	layoutFrame = 0;
	actionOrigin = null;
	refreshing = !1;
	activity = 0;
	viewportChanged = () => {
		cancelAnimationFrame(this.layoutFrame), this.layoutFrame = requestAnimationFrame(() => this.layout());
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
			let t = e.target, n = t.form?.querySelector(":invalid") ?? t, r = t.parentElement?.querySelector("[data-field-error]") ?? a("span", "", "text-sm text-ha-text");
			r.dataset.fieldError = "", r.id ||= `error-${crypto.randomUUID()}`, r.textContent = t.validationMessage, t.parentElement?.append(r), t.setAttribute("aria-describedby", r.id), t.setAttribute("aria-invalid", "true"), this.message("Revisa los campos marcados."), requestAnimationFrame(() => {
				n.focus({ preventScroll: !0 }), d(n);
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
		this.ha = e, f(this, e), this.start(), this.updateMeasurements();
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
		u(e);
		let t = a("ha-card", "", "block min-h-0 [--ha-card-border-radius:0px] [--ha-card-border-width:0px]"), n = a("div", "", "flex min-h-0 max-h-[var(--rc-card-height,calc(100dvh-6rem))] flex-col overflow-hidden bg-ha-surface text-ha-text border border-solid border-ha-control-border");
		this.panel = n, this.heading = a("h2", this.config.title || this.defaultTitle(), "text-xl font-semibold"), this.readings = a("div", "", "empty:hidden");
		let r = a("header", "", "grid shrink-0 gap-3 border-b border-solid border-ha-border bg-ha-surface p-4 [&:not(:has(:not([hidden])))]:hidden");
		r.append(this.heading, this.readings), this.body = this.scrollBody(), this.body.setAttribute("role", "region"), this.heading.id = `card-${crypto.randomUUID()}`, this.body.setAttribute("aria-labelledby", this.heading.id), this.actions = a("div", "", "flex flex-wrap justify-end gap-2 empty:hidden"), n.append(r, this.body, this.footer(this.actions)), t.append(n), e.append(t), this.viewportChanged();
	}
	scrollBody() {
		let e = a("div", "", "grid min-h-0 content-start gap-4 overflow-y-auto overscroll-contain touch-pan-y p-4 [scrollbar-gutter:stable] [scrollbar-width:thin] [overflow-anchor:none]");
		return e.dataset.scrollBody = "", e.tabIndex = 0, e;
	}
	footer(e, t) {
		let n = a("footer", "", "grid shrink-0 gap-2 border-t border-solid border-ha-border bg-ha-surface p-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] [&:not(:has(button)):not(:has(output:not(:empty)))]:hidden"), r = a("div", "", "flex flex-wrap items-center justify-end gap-2");
		return t && r.append(t), r.append(e), n.append(l(), r), n;
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
	layout() {
		if (!this.isConnected) return;
		let e = window.visualViewport, t = e?.height ?? window.innerHeight, n = e?.offsetTop ?? 0, r = this.popup();
		r !== this.popupHost && (this.popupHost?.removeEventListener("transitionend", this.viewportChanged), this.popupHost = r, r?.addEventListener("transitionend", this.viewportChanged)), r && (r.style.setProperty("--rc-viewport-height", `${t}px`), r.style.setProperty("--rc-viewport-top", `${n}px`));
		let i = r ? n + t - this.panel.getBoundingClientRect().top - 24 : t - 96;
		this.style.setProperty("--rc-card-height", `${Math.max(120, i)}px`), this.style.setProperty("--rc-dialog-height", `${Math.max(120, t - 24)}px`), this.style.setProperty("--rc-dialog-center", `${n + t / 2}px`), this.heading.hidden = !!r, this.readings.hidden = !this.readings.childElementCount;
		let a = this.shadowRoot.activeElement;
		a?.matches("input,select,textarea") && d(a);
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
		let t = this.shadowRoot.activeElement ?? this.actionOrigin, n = a("dialog", "", "fixed inset-x-0 bottom-auto top-[var(--rc-dialog-center,50dvh)] m-0 mx-auto w-[min(36rem,calc(100vw-1.5rem))] max-h-[var(--rc-dialog-height,calc(100dvh-1.5rem))] [transform:translateY(-50%)] overflow-hidden border border-solid border-ha-control-border bg-ha-surface p-0 text-ha-text open:flex open:flex-col backdrop:bg-black/70"), r = a("h3", e, "shrink-0 border-b border-solid border-ha-border bg-ha-surface p-4 text-xl font-semibold");
		r.id = `dialog-${crypto.randomUUID()}`, n.setAttribute("aria-labelledby", r.id), n.append(r);
		let i = a("form", "", "grid gap-4"), s = this.scrollBody();
		s.setAttribute("role", "region"), s.setAttribute("aria-labelledby", r.id), s.append(i);
		let c = a("div", "", "flex flex-wrap gap-2");
		return c.dataset.dialogActions = "", n.append(s, this.footer(c, o("Cancelar", () => n.close()))), n.addEventListener("cancel", (e) => {
			this.busy && e.preventDefault();
		}), n.onclose = () => {
			n.remove(), t?.focus({ preventScroll: !0 });
		}, this.shadowRoot.append(n), this.viewportChanged(), {
			dialog: n,
			form: i
		};
	}
}, m = class extends p {
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
			this.body.append(a("p", "Cámara sin configurar."));
			return;
		}
		let t = a("div", "", "grid grid-cols-2 gap-3");
		for (let [e, n] of [["temperature", "Temperatura"], ["humidity", "Humedad"]]) {
			let r = a("div"), i = a("p", "", "text-lg");
			i.dataset.measurement = e, r.append(a("p", n, "text-sm text-ha-secondary"), i), t.append(r);
		}
		if (this.readings.append(t), this.readings.hidden = !1, this.body.append(a("p", e.consigna ? `Consigna: ${i(e.consigna)}` : "Sin consigna")), e.origen === "automatica_confirmada" && this.body.append(a("p", "Automática", "text-sm text-ha-secondary")), e.manualHasta && this.body.append(a("p", `Manual hasta ${new Date(e.manualHasta).toLocaleString(this.ha?.locale?.language, {
			dateStyle: "short",
			timeStyle: "short"
		})}`)), e.pendiente && (this.body.append(a("p", `Pendiente: ${i(e.pendiente.propuesta)}`, "border-t border-solid border-ha-border pt-3")), this.actions.append(o("Revisar", () => this.confirm(e)))), e.manualHasta) {
			let t = a("div", "", "flex flex-wrap gap-2");
			t.append(o("Editar manual", () => this.run(async () => this.manual(e, await this.currentManual(e)))), o("Finalizar manual", () => this.run(async () => this.finishManual(e, await this.currentManual(e))))), this.actions.append(t);
		} else this.actions.append(o("Consigna manual", () => this.manual(e)));
		this.actions.append(o("Actualizar", () => this.refresh()));
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
		s.type = "submit", this.dockSubmit(r, s), r.onsubmit = (r) => {
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
		s.type = "submit", this.dockSubmit(r, s), r.onsubmit = (r) => {
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
		g.type = "submit", this.dockSubmit(c, g), c.addEventListener("input", () => {
			p.input.setCustomValidity(p.input.value && f.input.value && p.input.value <= f.input.value ? "El fin debe ser posterior al inicio." : "");
			for (let e of ["temperatura", "humedad"]) {
				let t = m.get(`${e}Min`), n = m.get(`${e}Max`);
				n.setCustomValidity(t.value !== "" && n.value !== "" && Number(n.value) < Number(t.value) ? "El máximo debe ser igual o mayor que el mínimo." : "");
			}
		}), c.onsubmit = (n) => {
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
}, h = class extends p {
	requestId = crypto.randomUUID();
	static getStubConfig() {
		return { type: "custom:registros-lot-card" };
	}
	defaultTitle() {
		return "Nuevo lote";
	}
	render() {
		this.body.replaceChildren(), this.actions.replaceChildren();
		let e = a("form", "", "grid gap-4"), r = s("Código del lote");
		r.input.maxLength = 200;
		let i = s("Cantidad (ud)", "number");
		i.input.min = "1", i.input.step = "1", i.input.max = String(2 ** 53 - 1);
		let c = s("Fecha de inicio", "date", n().slice(0, 10)), l = o("Crear", () => {});
		l.type = "submit", e.append(r.wrapper, i.wrapper, c.wrapper), e.onsubmit = (e) => {
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
				this.requestId = crypto.randomUUID(), this.actions.replaceChildren(), this.body.replaceChildren(a("p", `${e.lote.codigo} · Creado`, "font-semibold"), o("Nuevo", () => this.render()));
			});
		}, this.body.append(e), this.dockSubmit(e, l);
	}
}, g = class extends p {
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
		this.body.replaceChildren(), this.actions.replaceChildren();
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
		}, f = async (e = !1) => {
			let n = this.body.scrollTop, a = e && !!l.querySelector("details")?.open, o = e ? Number(l.querySelector("details")?.dataset.count ?? 10) : 10;
			if (i.replaceChildren(), l.replaceChildren(), this.actions.replaceChildren(), this.options = void 0, !t.input.value || !r.input.value) return;
			let [s, c] = await Promise.all([this.request("movement_options", {
				lot_id: t.input.value,
				date: r.input.value
			}), this.request("movements", { lot_id: t.input.value })]);
			this.options = s;
			let u = () => f(!0);
			this.renderMovement(i, s, void 0, u), this.renderHistory(l, c, u, o), l.querySelector("details").open = a, this.body.scrollTop = e ? n : 0;
		}, p = () => this.run(f);
		e.input.oninput = () => {
			clearTimeout(this.searchTimer), this.searchTimer = setTimeout(() => {
				this.run(async () => {
					i.replaceChildren(), l.replaceChildren(), this.actions.replaceChildren(), t.input.value = "", this.options = void 0, await d();
				});
			}, 300);
		}, t.input.onchange = () => void p(), r.input.onchange = () => void p(), this.body.append(e.wrapper, t.wrapper, u, r.wrapper, i, l), await d();
	}
	renderHistory(e, t, n, r = 10) {
		let i = a("details");
		i.append(a("summary", `Movimientos (${t.movimientos.length})`, "cursor-pointer"));
		let s = a("div", "", "mt-3 grid gap-3"), c = [...t.movimientos].reverse(), l = (e) => this.snapshot?.ubicaciones.find((t) => t.id === e)?.nombre ?? "Entrada", u = 0, d = o("Más", () => f()), f = (e = 10) => {
			let r = this.body.scrollTop;
			for (let r of c.slice(u, u + e)) {
				let e = a("div", "", "grid gap-2 border-t border-solid border-ha-border pt-3");
				e.append(a("p", `${r.fecha} · #${r.orden}${r.corregidoEn ? " · Corregido" : ""}`, "text-sm text-ha-secondary"));
				for (let t of r.destinos) e.append(a("p", `${l(r.ubicacionOrigenId)} → ${l(t.ubicacionId)} · ${t.cantidad} ud`));
				r.orden !== 0 && e.append(Object.assign(o("Corregir", () => this.run(() => this.editMovement(t.lote.id, r.id, n))), { id: `movement-${r.id}` })), s.append(e);
			}
			u += e, i.dataset.count = String(u), d.hidden = u >= c.length, this.body.scrollTop = r;
		};
		f(r), i.append(s, d), e.append(i);
	}
	async editMovement(e, t, n) {
		let r = await this.request("movements", { lot_id: e }), i = r.movimientos.find((e) => e.id === t);
		if (!i || i.orden === 0) throw Error("Movimiento no disponible.");
		let { dialog: o, form: c } = this.dialog("Corregir movimiento"), l = a("div", "", "grid gap-4");
		c.replaceWith(l);
		let u = s("Fecha", "date", i.fecha), d = a("div", "", "grid gap-4");
		l.append(u.wrapper, d);
		let f = async () => {
			if (d.replaceChildren(), o.querySelector("[data-dialog-actions]").replaceChildren(), !u.input.value) return;
			let a = await this.request("movement_options", {
				lot_id: e,
				date: u.input.value,
				movement_id: t
			});
			if (a.lote.revision !== r.lote.revision) throw Error("El lote ha cambiado. Cierra y vuelve a corregir.");
			this.renderMovement(d, a, i, async () => {
				o.close(), await n(), this.shadowRoot.getElementById(`movement-${t}`)?.focus({ preventScroll: !0 });
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
		})), n?.ubicacionOrigenId ?? ""), f = a("div", "", "grid gap-4");
		e.append(u.wrapper, f);
		let p = () => {
			if (f.replaceChildren(), (e.closest("dialog")?.querySelector("[data-dialog-actions]") ?? this.actions).replaceChildren(), !u.input.value) return;
			let i = t.porciones.filter((e) => e.ubicacionId === u.input.value), l = i.reduce((e, t) => e + t.restante, 0), p = n?.ubicacionOrigenId === u.input.value ? n : void 0, m = c("Tipo", [{
				value: "full",
				label: "Completo"
			}, {
				value: "split",
				label: "Parcial / reparto"
			}], p ? "split" : "full"), h = a("form", "", "grid gap-4"), g = a("div", "", "grid gap-4"), _ = a("p"), v = s("Mezcla física", "checkbox", "", !1);
			v.input.checked = p?.mezclarOrigen ?? !1;
			let y = [], b = n?.id ?? crypto.randomUUID(), x = () => {
				let e = y.reduce((e, t) => e + Number(t.amount.value), 0);
				_.textContent = `Salida: ${e} ud · Restante: ${l - e} ud`;
			}, S = (e) => {
				let t = a("div", "", "grid min-w-0 gap-3 border border-solid border-ha-border p-3"), n = c("Destino", (this.snapshot?.ubicaciones ?? []).filter((e) => e.id !== u.input.value).map((e) => ({
					value: e.id,
					label: e.nombre
				})), e?.ubicacionId), r = s("Cantidad", "number", e ? String(e.cantidad) : m.input.value === "full" ? String(l) : "");
				r.input.min = "1", r.input.max = String(l), r.input.step = "1", r.input.readOnly = m.input.value === "full";
				let d = /* @__PURE__ */ new Map();
				if (t.append(n.wrapper, r.wrapper), m.input.value === "split" && !v.input.checked) {
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
				y.push(f), m.input.value !== "full" && t.append(o("Quitar", () => {
					y.splice(y.indexOf(f), 1), t.remove(), x();
				})), r.input.oninput = x, g.append(t), x();
			}, C = o("Añadir destino", () => {
				let e = this.body.scrollTop;
				S(), this.body.scrollTop = e, y.at(-1)?.location.focus({ preventScroll: !0 });
				let t = y.at(-1);
				t && d(t.node);
			});
			C.hidden = !0;
			let w = () => {
				y.length = 0, g.replaceChildren(), C.hidden = m.input.value === "full", v.wrapper.hidden = m.input.value === "full", S();
			};
			m.input.onchange = w, v.input.onchange = w;
			let T = o(n ? "Guardar" : "Registrar", () => {});
			if (T.type = "submit", h.append(m.wrapper, v.wrapper, g, C, _), f.append(h), this.dockSubmit(h, T), p) {
				C.hidden = !1;
				for (let e of p.destinos) S(e);
			} else w();
			h.onsubmit = (i) => {
				i.preventDefault();
				let o = {
					id: b,
					revision: t.lote.revision,
					fecha: t.fecha,
					ubicacionOrigenId: u.input.value,
					mezclarOrigen: v.input.checked && m.input.value === "split",
					destinos: y.map((e) => ({
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
		u.input.onchange = p, n && p();
	}
}, _ = class extends HTMLElement {
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
		this.ha = e, f(this, e), this.load();
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
customElements.define("registros-camaras-editor", _), customElements.define("registros-camera-card", m), customElements.define("registros-lot-card", h), customElements.define("registros-movement-card", g);
var v = window;
v.customCards ??= [], v.customCards.push({
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
