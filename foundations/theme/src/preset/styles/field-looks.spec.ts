import { describe, expect, it } from "vitest";

import { fieldLooks } from "#preset/styles/field-looks.ts";

describe("fieldLooks", () => {
  it("draws an outlined field on the panel surface with the control's boundary and the states the fragment writes", () => {
    expect(fieldLooks.outline.value).toStrictEqual({
      _hover: { borderColor: "fg.subtle" },
      _invalid: { borderColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.panel",
      borderColor: "border.emphasized",
    });
  });

  it("draws a subtle field on the muted well with a bottom edge an empty one is known by", () => {
    expect(fieldLooks.subtle.value).toStrictEqual({
      _hover: { borderBlockEndColor: "fg.subtle" },
      _invalid: { borderBlockEndColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.muted",
      borderBlockEndColor: "border.emphasized",
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    });
  });

  it("leaves a flushed field its bottom edge alone at the control's boundary and moves that edge with the states", () => {
    expect(fieldLooks.flushed.value).toStrictEqual({
      _hover: { borderBlockEndColor: "fg.subtle" },
      _invalid: { borderBlockEndColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "transparent",
      borderBlockEndColor: "border.emphasized",
      borderColor: "transparent",
      borderRadius: "0",
    });
  });
});
