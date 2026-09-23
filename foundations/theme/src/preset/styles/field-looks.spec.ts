import { describe, expect, it } from "vitest";

import { FIELD_EDGE } from "#authoring/recipes/field.ts";
import { fieldLooks, wrappedFieldLooks } from "#preset/styles/field-looks.ts";

describe("fieldLooks", () => {
  it("draws an outlined field on the panel surface with the edge the fragment's property carries", () => {
    expect(fieldLooks.outline.value).toStrictEqual({
      _readOnly: { background: "bg.subtle" },
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
    });
  });

  it("draws a subtle field on the muted well with a bottom edge an empty one is known by", () => {
    expect(fieldLooks.subtle.value).toStrictEqual({
      _focusVisible: { outlineStyle: "none" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.muted",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    });
  });

  it("leaves a flushed field its bottom edge alone and reports focus by that edge", () => {
    expect(fieldLooks.flushed.value).toStrictEqual({
      _focusVisible: { outlineStyle: "none" },
      _readOnly: { background: "bg.subtle" },
      background: "transparent",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderColor: "transparent",
      borderRadius: "0",
    });
  });

  it("restates no state a look used to write over the fragment", () => {
    expect.hasAssertions();

    for (const look of Object.values(fieldLooks)) {
      expect(look.value).not.toHaveProperty("_hover");
      expect(look.value).not.toHaveProperty("_invalid");
    }
  });
});

describe("wrappedFieldLooks", () => {
  it("reads the read-only state from the control the box holds", () => {
    expect(wrappedFieldLooks.outline.value).toStrictEqual({
      "&:has(> :read-only:not(:disabled))": { background: "bg.subtle" },
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
    });
  });

  it("turns the ring off a flushed box from the control that holds the focus", () => {
    expect(wrappedFieldLooks.flushed.value).toMatchObject({
      "&:has(> :focus-visible, > [data-focus-visible])": { outlineStyle: "none" },
    });
  });

  it("leaves an outlined box the ring the fragment draws", () => {
    expect(wrappedFieldLooks.outline.value).not.toHaveProperty(
      "&:has(> :focus-visible, > [data-focus-visible])",
    );
  });
});
