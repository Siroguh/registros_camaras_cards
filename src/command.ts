export const isRevisionConflict = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  error.message === "Revision changed; refresh and review";

/** Freeze uncertain writes; only a confirmed rejection allows a newly reviewed revision. */
export class ReviewedCommand<T extends Record<string, unknown>> {
  private submitted?: { payload: T; expected_revision: number; command_id: string };
  private outcome: "new" | "uncertain" | "rejected" = "new";
  private revision: number;
  constructor(revision: number) {
    this.revision = revision;
  }
  get uncertain() {
    return this.outcome === "uncertain";
  }
  review(revision: number) {
    if (this.uncertain)
      throw new Error("Resultado incierto: reintenta Crear para recuperar el recibo original.");
    this.revision = revision;
    this.submitted = undefined;
    this.outcome = "new";
  }
  async send<R>(payload: T, send: (command: NonNullable<typeof this.submitted>) => Promise<R>) {
    if (this.outcome === "rejected")
      throw new Error("Actualiza la revisión y revisa los datos antes de volver a crear.");
    this.submitted ??= {
      payload: structuredClone(payload),
      expected_revision: this.revision,
      command_id: crypto.randomUUID(),
    };
    this.outcome = "uncertain";
    try {
      return await send(structuredClone(this.submitted));
    } catch (error) {
      if (isRevisionConflict(error)) this.outcome = "rejected";
      throw error;
    }
  }
}
