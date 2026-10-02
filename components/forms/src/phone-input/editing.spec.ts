import { describe, expect, it } from "vitest";

import { edited } from "#phone-input/editing.ts";

describe("edited", () => {
  it("formats the number after a digit typed at the end", () => {
    expect(
      edited({
        caret: 10,
        country: "NL",
        inputType: "insertText",
        previous: "061234567",
        typed: "0612345678",
      }),
    ).toMatchObject({ caret: 11, formatted: { text: "06 12345678" } });
  });

  it("puts the caret at the end of a formatted number when the edit ends the text", () => {
    expect(
      edited({ caret: 3, country: "US", inputType: "insertText", previous: "21", typed: "212" })
        .caret,
    ).toBe(5);
  });

  it("puts the caret after the digit typed in the middle", () => {
    expect(
      edited({
        caret: 4,
        country: "NL",
        inputType: "insertText",
        previous: "06 12345678",
        typed: "06 912345678",
      }).caret,
    ).toBe(3);
  });

  it("keeps the caret after the same digits when a typed letter is dropped", () => {
    expect(
      edited({
        caret: 3,
        country: "NL",
        inputType: "insertText",
        previous: "06 12345678",
        typed: "06a 12345678",
      }),
    ).toMatchObject({ caret: 2, formatted: { text: "06 12345678" } });
  });

  it("formats an edit without an input type", () => {
    expect(
      edited({ caret: 10, country: "NL", previous: "", typed: "0612345678" }).formatted.text,
    ).toBe("06 12345678");
  });

  it("formats the digits a deletion leaves", () => {
    expect(
      edited({
        caret: 13,
        country: "US",
        inputType: "deleteContentBackward",
        previous: "(212) 555-0123",
        typed: "(212) 555-012",
      }),
    ).toMatchObject({ caret: 13, formatted: { text: "(212) 555-012" } });
  });

  it("removes the digit before a formatting character Backspace removed", () => {
    expect(
      edited({
        caret: 4,
        country: "US",
        inputType: "deleteContentBackward",
        previous: "(212)",
        typed: "(212",
      }),
    ).toMatchObject({ caret: 2, formatted: { text: "21" } });
  });

  it("removes the digit after a formatting character Delete removed", () => {
    expect(
      edited({
        caret: 9,
        country: "US",
        inputType: "deleteContentForward",
        previous: "(212) 555-0123",
        typed: "(212) 5550123",
      }),
    ).toMatchObject({ caret: 9, formatted: { text: "(212) 555-123" } });
  });

  it("keeps the number when Backspace removes a formatting character before every digit", () => {
    expect(
      edited({
        caret: 0,
        country: "US",
        inputType: "deleteContentBackward",
        previous: "(212)",
        typed: "212)",
      }).formatted.text,
    ).toBe("(212)");
  });

  it("keeps the number when Delete removes a formatting character after every digit", () => {
    expect(
      edited({
        caret: 4,
        country: "US",
        inputType: "deleteContentForward",
        previous: "(212)",
        typed: "(212",
      }).formatted.text,
    ).toBe("(212)");
  });

  it("removes the digit before a space Backspace removed", () => {
    expect(
      edited({
        caret: 2,
        country: "NL",
        inputType: "deleteContentBackward",
        previous: "06 12345678",
        typed: "0612345678",
      }),
    ).toMatchObject({ caret: 1, formatted: { text: "012 345 678" } });
  });
});
