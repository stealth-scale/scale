import { describe, expect, it } from "vitest";

import { type Edit, edited } from "#input-mask/editing.ts";
import { maskerOf } from "#input-mask/mask.ts";

const PHONE = maskerOf({ mask: "(999) 999-9999" }).engine;

const AMOUNT = maskerOf({ number: { fraction: 2, locale: "nl-NL" } }).engine;

const EXPIRY = maskerOf({ eager: true, mask: "99/99" }).engine;

function typing(previous: string, at: number, text: string): Edit {
  return {
    caret: at + text.length,
    inputType: "insertText",
    previous,
    typed: previous.slice(0, at) + text + previous.slice(at),
  };
}

function backspace(previous: string, at: number): Edit {
  return {
    caret: at - 1,
    inputType: "deleteContentBackward",
    previous,
    typed: previous.slice(0, at - 1) + previous.slice(at),
  };
}

function forwardDelete(previous: string, at: number): Edit {
  return {
    caret: at,
    inputType: "deleteContentForward",
    previous,
    typed: previous.slice(0, at) + previous.slice(at + 1),
  };
}

describe("edited", () => {
  it.each([
    {
      edit: typing("", 0, "5"),
      label: "a digit typed into an empty value",
      want: { caret: 2, value: "(5" },
    },
    {
      edit: typing("(555", 4, "1"),
      label: "a digit typed at the end",
      want: { caret: 7, value: "(555) 1" },
    },
    {
      edit: typing("(555) 123-4567", 0, "9"),
      label: "a digit typed before the pattern's first character",
      want: { caret: 2, value: "(955) 512-3456" },
    },
    {
      edit: typing("(555) 234-567", 6, "9"),
      label: "a digit typed after unchanged text",
      want: { caret: 7, value: "(555) 923-4567" },
    },
    {
      edit: typing("(555) 123-4567", 1, "x"),
      label: "a refused letter",
      want: { caret: 1, value: "(555) 123-4567" },
    },
    {
      edit: typing("(555) 123-4567", 14, "8"),
      label: "a digit past the end of the pattern",
      want: { caret: 14, value: "(555) 123-4567" },
    },
    {
      edit: typing("", 0, "x"),
      label: "a letter refused by an empty value",
      want: { caret: 0, value: "" },
    },
    {
      edit: backspace("(555) 123-4567", 7),
      label: "Backspace after a digit",
      want: { caret: 6, value: "(555) 234-567" },
    },
    {
      edit: backspace("(555) 123-4567", 6),
      label: "Backspace after the pattern's characters",
      want: { caret: 3, value: "(551) 234-567" },
    },
    {
      edit: forwardDelete("(555) 123-4567", 9),
      label: "Delete before the pattern's character",
      want: { caret: 9, value: "(555) 123-567" },
    },
    {
      edit: backspace("(555) 123-4567", 1),
      label: "Backspace after the pattern's first character",
      want: { caret: 1, value: "(555) 123-4567" },
    },
    {
      edit: backspace("(5", 2),
      label: "Backspace after the last digit",
      want: { caret: 0, value: "" },
    },
    {
      edit: { caret: 10, inputType: undefined, previous: "", typed: "5551234567" },
      label: "an edit without an input type",
      want: { caret: 14, value: "(555) 123-4567" },
    },
    {
      edit: { caret: 4, inputType: "deleteByCut", previous: "(555) 123", typed: "(555 123" },
      label: "a cut of the pattern's characters alone",
      want: { caret: 4, value: "(555) 123" },
    },
  ])("returns $want.value with the caret at $want.caret for $label", ({ edit, want }) => {
    expect(edited(PHONE, edit)).toStrictEqual(want);
  });

  it.each([
    {
      edit: typing("156.234", 3, "7"),
      label: "a digit that adds a group separator",
      want: { caret: 5, value: "1.567.234" },
    },
    {
      edit: backspace("1.234", 2),
      label: "Backspace after a group separator",
      want: { caret: 0, value: "234" },
    },
    {
      edit: typing("12", 2, ","),
      label: "a decimal separator typed after the digits",
      want: { caret: 3, value: "12," },
    },
    {
      edit: typing("", 0, "-"),
      label: "a minus sign typed into an empty number",
      want: { caret: 1, value: "-" },
    },
  ])(
    "returns $want.value with the caret at $want.caret for $label in a number",
    ({ edit, want }) => {
      expect(edited(AMOUNT, edit)).toStrictEqual(want);
    },
  );

  it("deletes the digit before an eager pattern character on Backspace", () => {
    expect(edited(EXPIRY, backspace("12/", 3))).toStrictEqual({ caret: 1, value: "1" });
  });

  it("keeps the value and the caret on Delete before a trailing pattern character", () => {
    expect(edited(EXPIRY, forwardDelete("12/", 2))).toStrictEqual({ caret: 2, value: "12/" });
  });
});
