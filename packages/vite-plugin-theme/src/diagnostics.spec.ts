import { describe, expect, it } from "vitest";

import { hasErrors, reportDiagnostics } from "#diagnostics.ts";
import { type Diagnostic } from "#pandacss.ts";

function said(severity: Diagnostic["severity"], over: Partial<Diagnostic> = {}): Diagnostic {
  return { code: "PANDA1", message: "a recipe went unread", severity, ...over };
}

function collected(): { report: (message: string) => void; said: string[] } {
  const held: string[] = [];

  return { report: (message) => void held.push(message), said: held };
}

describe("reportDiagnostics", () => {
  it("reports nothing when the compiler found nothing", () => {
    const heard = collected();

    expect(reportDiagnostics([], "the stylesheet", heard.report)).toBe(0);
    expect(heard.said).toStrictEqual([]);
  });

  it("reports nothing for a diagnostic the compiler marked as information", () => {
    const heard = collected();

    expect(reportDiagnostics([said("info")], "the stylesheet", heard.report)).toBe(0);
    expect(heard.said).toStrictEqual([]);
  });

  it("excludes an info diagnostic from the count", () => {
    const heard = collected();
    const found = [said("error"), said("warning"), said("info")];

    expect(reportDiagnostics(found, "the stylesheet", heard.report)).toBe(2);
  });

  it("gathers every diagnostic into one message headed by the count and the stage", () => {
    const heard = collected();

    reportDiagnostics([said("error"), said("warning")], "the design system", heard.report);

    expect(heard.said).toHaveLength(1);
    expect(heard.said[0]).toContain("2 problem(s) compiling the design system");
  });

  it("writes the severity and the code and the message on one line", () => {
    const heard = collected();

    reportDiagnostics([said("error")], "the stylesheet", heard.report);

    expect(heard.said[0]).toContain("error PANDA1: a recipe went unread");
  });

  it("writes the file when the diagnostic names one", () => {
    const heard = collected();

    reportDiagnostics(
      [said("error", { file: "src/button.recipe.ts" })],
      "the stylesheet",
      heard.report,
    );

    expect(heard.said[0]).toContain("(src/button.recipe.ts)");
  });

  it("writes the help after a dash when the diagnostic offers one", () => {
    const heard = collected();

    reportDiagnostics(
      [said("warning", { help: ["name the slot"] })],
      "the stylesheet",
      heard.report,
    );

    expect(heard.said[0]).toContain("— name the slot");
  });

  it("returns true from hasErrors when one diagnostic is an error", () => {
    expect(hasErrors([said("warning"), said("error")])).toBe(true);
  });

  it("returns false from hasErrors when no diagnostic is an error", () => {
    expect(hasErrors([said("warning"), said("info")])).toBe(false);
    expect(hasErrors([])).toBe(false);
  });

  it("writes neither a file nor a help when the diagnostic offers neither", () => {
    const heard = collected();

    reportDiagnostics([said("warning")], "the stylesheet", heard.report);

    const line = (heard.said[0] ?? "").split("\n")[1] ?? "";

    expect(line).toContain("warning PANDA1");
    expect(line).not.toContain("(");
    expect(line).not.toContain("—");
  });
});
