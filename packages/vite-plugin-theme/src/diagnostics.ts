/**
 * Hands what the compiler found to the bundler, which puts a message in front of the person
 * running the build.
 *
 * @remarks
 *   The compiler reports what it could not make sense of, such as a recipe it could not read or a
 *   token nothing defines, and returns the list beside whatever it managed to compile. Left unread,
 *   each one is a rule missing from the stylesheet and nothing said about it.
 */

import { type Diagnostic } from "#pandacss.ts";

/**
 * Delivers one message to the person running the build.
 *
 * @remarks
 *   The bundler's own `warn`, taken as a function rather than as its context, so a specification
 *   drives the reporter without a bundler.
 */
export type Report = (message: string) => void;

/**
 * Tells which compile a run of diagnostics belongs to.
 */
export type Stage = "the class names" | "the contributors" | "the design system" | "the stylesheet";

/**
 * Reports whether any diagnostic is an error, which is one the compiler could not compile past.
 */
export function hasErrors(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some((held) => held.severity === "error");
}

/**
 * Lists the severities worth interrupting somebody for.
 *
 * @remarks
 *   `info` is the compiler narrating its own work, which belongs in the build log and not in a
 *   warning.
 */
const LOUD: ReadonlySet<string> = new Set(["error", "warning"]);

/**
 * Writes one diagnostic as a line somebody can act on.
 *
 * @remarks
 *   The compiler's own formatter draws a frame around the source span, which reads well in a
 *   terminal the compiler owns and badly inside a bundler's warning.
 */
function lineOf(held: Diagnostic): string {
  const where = held.file === undefined ? "" : ` (${held.file})`;
  const help = (held.help ?? []).join(" ");

  return `${held.severity} ${held.code}: ${held.message}${where}${help === "" ? "" : ` — ${help}`}`;
}

/**
 * Reports every diagnostic worth reading as one message, and says nothing where there is none.
 *
 * @remarks
 *   One message rather than one per diagnostic, because a mistake in a configuration produces the
 *   same diagnostic a dozen times, and a dozen warnings is a wall somebody scrolls past.
 * @returns How many diagnostics were reported.
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
