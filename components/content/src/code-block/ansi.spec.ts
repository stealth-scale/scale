import { describe, expect, it } from "vitest";

import { ANSI, isPlain, parseAnsi, stripAnsi } from "#code-block/ansi.ts";
import { OUTPUT, run, sgr } from "#code-block/code-block.fixtures.tsx";

describe("ansi", () => {
  it("names the language ansi", () => {
    expect(ANSI).toBe("ansi");
  });

  it("returns one plain run for text without escapes", () => {
    expect(parseAnsi("<b>not bold</b>")).toStrictEqual([run("<b>not bold</b>")]);
  });

  it("returns no run for an empty text", () => {
    expect(parseAnsi("")).toStrictEqual([]);
  });

  it.each([
    { code: 30, color: "black" },
    { code: 31, color: "red" },
    { code: 32, color: "green" },
    { code: 33, color: "yellow" },
    { code: 34, color: "blue" },
    { code: 35, color: "magenta" },
    { code: 36, color: "cyan" },
    { code: 37, color: "white" },
  ] as const)("sets color to $color for code $code", ({ code, color }) => {
    expect(parseAnsi(`${sgr(code)}text`)).toStrictEqual([run("text", { color })]);
  });

  it.each([
    { code: 90, color: "black" },
    { code: 91, color: "red" },
    { code: 92, color: "green" },
    { code: 93, color: "yellow" },
    { code: 94, color: "blue" },
    { code: 95, color: "magenta" },
    { code: 96, color: "cyan" },
    { code: 97, color: "white" },
  ] as const)("sets color to $color for the bright code $code", ({ code, color }) => {
    expect(parseAnsi(`${sgr(code)}text`)).toStrictEqual([run("text", { color })]);
  });

  it.each([
    { code: 1, field: "bold" },
    { code: 2, field: "dim" },
    { code: 4, field: "underline" },
  ] as const)("sets $field for code $code", ({ code, field }) => {
    expect(parseAnsi(`${sgr(code)}text`)).toStrictEqual([run("text", { [field]: true })]);
  });

  it("resets the intensity for code 22", () => {
    expect(parseAnsi(`${sgr(1, 2, 4)}a${sgr(22)}b`)).toStrictEqual([
      run("a", { bold: true, dim: true, underline: true }),
      run("b", { underline: true }),
    ]);
  });

  it("clears underline for code 24", () => {
    expect(parseAnsi(`${sgr(1, 4)}a${sgr(24)}b`)).toStrictEqual([
      run("a", { bold: true, underline: true }),
      run("b", { bold: true }),
    ]);
  });

  it("clears the color for code 39", () => {
    expect(parseAnsi(`${sgr(1, 31)}a${sgr(39)}b`)).toStrictEqual([
      run("a", { bold: true, color: "red" }),
      run("b", { bold: true }),
    ]);
  });

  it("resets every field for code 0", () => {
    expect(parseAnsi(`${sgr(1, 2, 4, 31)}a${sgr(0)}b`)).toStrictEqual([
      run("a", { bold: true, color: "red", dim: true, underline: true }),
      run("b"),
    ]);
  });

  it("resets every field for a sequence without parameters", () => {
    expect(parseAnsi(`${sgr(1, 31)}a\u001B[mb`)).toStrictEqual([
      run("a", { bold: true, color: "red" }),
      run("b"),
    ]);
  });

  it("reads an empty parameter as a reset", () => {
    expect(parseAnsi(`${sgr(31)}a\u001B[;1mb`)).toStrictEqual([
      run("a", { color: "red" }),
      run("b", { bold: true }),
    ]);
  });

  it("keeps a style across a line break until a sequence changes it", () => {
    expect(parseAnsi(`${sgr(31)}one\ntwo${sgr(0)}\nthree`)).toStrictEqual([
      run("one\ntwo", { color: "red" }),
      run("\nthree"),
    ]);
  });

  it("returns the runs of the fixture output in order", () => {
    expect(parseAnsi(OUTPUT)).toStrictEqual([
      run("✓", { color: "green" }),
      run(" payout "),
      run("41ms", { dim: true }),
      run("\n"),
      run("failed", { bold: true, color: "red" }),
    ]);
  });

  it("merges two runs of one style that a dropped sequence separates", () => {
    expect(parseAnsi("before\u001B[2K\u001B[1;1Hafter")).toStrictEqual([run("beforeafter")]);
  });

  it("merges two runs when a sequence sets the style already in force", () => {
    expect(parseAnsi(`${sgr(31)}a${sgr(31)}b`)).toStrictEqual([run("ab", { color: "red" })]);
  });

  it.each([
    { form: "an erase", text: "a\u001B[2Kb" },
    { form: "a private mode", text: "a\u001B[?25lb" },
    { form: "a private sequence ending in m", text: "a\u001B[>4;2mb" },
    { form: "a sequence ending in a tilde", text: "a\u001B[3~b" },
    { form: "a sequence with an intermediate byte", text: "a\u001B[2 qb" },
  ])("drops $form", ({ text }) => {
    expect(parseAnsi(text)).toStrictEqual([run("ab")]);
  });

  it.each([
    { form: "a bell", text: "a\u001B]0;title\u0007b" },
    { form: "a string terminator", text: "a\u001B]8;;https://example.com\u001B\\b" },
  ])("drops an operating system command terminated by $form", ({ text }) => {
    expect(parseAnsi(text)).toStrictEqual([run("ab")]);
  });

  it("drops an operating system command that the text ends in", () => {
    expect(parseAnsi("a\u001B]8;;https://exa")).toStrictEqual([run("a")]);
  });

  it.each([
    { form: "a character set", text: "a\u001B(Bb" },
    { form: "a saved cursor", text: "a\u001B7b" },
  ])("drops the two-character escape of $form", ({ text }) => {
    expect(parseAnsi(text)).toStrictEqual([run("ab")]);
  });

  it("renders an extended color in the default ink", () => {
    expect(parseAnsi(`${sgr(31)}a${sgr(38, 5, 196)}b`)).toStrictEqual([
      run("a", { color: "red" }),
      run("b"),
    ]);
  });

  it("skips the two parameters of an indexed color", () => {
    expect(parseAnsi(`${sgr(38, 5, 31)}text`)).toStrictEqual([run("text")]);
  });

  it("skips the four parameters of a direct color", () => {
    expect(parseAnsi(`${sgr(1)}a${sgr(38, 2, 255, 0, 0)}b`)).toStrictEqual([
      run("ab", { bold: true }),
    ]);
  });

  it.each([
    { code: 48, form: "background" },
    { code: 58, form: "underline" },
  ])("keeps the color for a $form color", ({ code }) => {
    expect(parseAnsi(`${sgr(31)}a${sgr(code, 5, 0)}b`)).toStrictEqual([
      run("ab", { color: "red" }),
    ]);
  });

  it("reads the code after an extended color without a kind", () => {
    expect(parseAnsi(`${sgr(38, 1)}text`)).toStrictEqual([run("text", { bold: true })]);
  });

  it("reads a parameter with colon sub-parameters as its first number", () => {
    expect(parseAnsi(`${sgr(31)}a\u001B[4:3mb`)).toStrictEqual([
      run("a", { color: "red" }),
      run("b", { color: "red", underline: true }),
    ]);
  });

  it("ignores a code it does not read", () => {
    expect(parseAnsi(`${sgr(3)}a${sgr(7)}b`)).toStrictEqual([run("ab")]);
  });

  it("removes every escape from the text", () => {
    expect(stripAnsi(`${OUTPUT}\u001B]0;title\u0007\u001B(B\u001B[2K`)).toBe(
      "✓ payout 41ms\nfailed",
    );
  });

  it("returns text without escapes unchanged", () => {
    expect(stripAnsi("<b>not bold</b>")).toBe("<b>not bold</b>");
  });

  it.each([
    { label: "a plain run", plain: true, span: run("text") },
    { label: "a bold run", plain: false, span: run("text", { bold: true }) },
    { label: "a black run", plain: false, span: run("text", { color: "black" }) },
    { label: "a dim run", plain: false, span: run("text", { dim: true }) },
    { label: "an underlined run", plain: false, span: run("text", { underline: true }) },
  ])("returns $plain from isPlain for $label", ({ plain, span }) => {
    expect(isPlain(span)).toBe(plain);
  });
});
