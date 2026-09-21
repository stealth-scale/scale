/**
 * Reports the compiler's diagnostics through the bundler's warning channel.
 *
 * @remarks
 *   The compiler returns its diagnostics alongside whatever it compiled, so a recipe it could not
 *   read or a token nothing defines is a rule missing from the stylesheet. Unreported, that rule
 *   goes missing with nothing said about it.
 */

import { type Diagnostic } from "#pandacss.ts";

/**
 * Delivers one message to the person running the build.
 *
 * @remarks
 *   The plugin passes the bundler's `warn`, bound to its context. A specification passes a
 *   function of its own, so the reporter runs without a bundler.
 */
export type Report = (message: string) => void;

/**
 * The compile a run of diagnostics belongs to, as it reads in the message.
 */
export type Stage = "the class names" | "the contributors" | "the design system" | "the stylesheet";

/**
 * Returns true when any diagnostic is an error, which is one the compiler could not compile past.
 */
export function hasErrors(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some((held) => held.severity === "error");
}

/**
 * The severities the plugin reports as a warning.
 *
 * @remarks
 *   The compiler emits `info` for its own progress, which belongs in the build log rather than in
 *   a warning.
 */
const LOUD: ReadonlySet<string> = new Set(["error", "warning"]);

/**
 * Formats one diagnostic as a single line carrying its severity, code, message, file and help.
 *
 * @remarks
 *   The compiler's own formatter frames the source span, which reads well in its own terminal
 *   output and badly inside a bundler's warning.
 */
function lineOf(held: Diagnostic): string {
  const where = held.file === undefined ? "" : ` (${held.file})`;
  const help = (held.help ?? []).join(" ");

  return `${held.severity} ${held.code}: ${held.message}${where}${help === "" ? "" : ` — ${help}`}`;
}

/**
 * Reports every error and warning of one compile as a single message, and reports nothing where
 * there is neither.
 *
 * @remarks
 *   One message rather than one per diagnostic, because a single mistake in a configuration
 *   produces the same diagnostic a dozen times and a dozen warnings hides the rest of the log. An
 *   `info` diagnostic is dropped rather than reported.
 * @returns How many diagnostics were reported, which is the count the message opens with.
 */
export function reportDiagnostics(
  diagnostics: readonly Diagnostic[],
  stage: Stage,
  report: Report,
): number {
  const loud = diagnostics.filter((held) => LOUD.has(held.severity));

  if (loud.length === 0) return 0;

  report(
    [
      `${String(loud.length)} problem(s) compiling ${stage}:`,
      ...loud.map((held) => lineOf(held)),
    ].join("\n  "),
  );

  return loud.length;
}
