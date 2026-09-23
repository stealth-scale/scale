import { describe, expect, it } from "vitest";

import { FIELD_EDGE, WITHIN_FOCUS, WITHIN_READ_ONLY } from "#authoring/recipes/field.ts";
import { fieldLooks, wrappedFieldLooks } from "#preset/styles/field-looks.ts";

const GAINED = "calc({borderWidths.ring} - {borderWidths.control})";

const FOCUSED = {
  borderBlockEndWidth: "ring",
  [FIELD_EDGE]: "var(--focus-ring-color)",
  outlineStyle: "none",
};

const READ_ONLY = "&:is(:read-only, [aria-readonly=true]):not(:disabled)";

const WRAPPED_FOCUS = WITHIN_FOCUS;

const WRAPPED_READ_ONLY = WITHIN_READ_ONLY;

describe("fieldLooks", () => {
  it("draws the outline look on the panel surface with every edge from the edge property", () => {
    expect(fieldLooks.outline.value).toStrictEqual({
      _readOnly: { background: "bg.subtle" },
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
      [READ_ONLY]: { borderStyle: "dashed" },
    });
  });

  it("draws the subtle look on the subtle surface with a block-end edge only", () => {
    expect(fieldLooks.subtle.value).toStrictEqual({
      _focusVisible: { ...FOCUSED, paddingBlockEnd: "0" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.subtle",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderBlockEndWidth: "control",
      borderColor: "transparent",
      paddingBlockEnd: GAINED,
      [READ_ONLY]: { borderStyle: "dashed" },
    });
  });

  it("draws the flushed look with a block-end edge and no corner radius", () => {
    expect(fieldLooks.flushed.value).toStrictEqual({
      _focusVisible: { ...FOCUSED, paddingBlockEnd: "0" },
      _readOnly: { background: "bg.subtle" },
      background: "transparent",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderColor: "transparent",
      borderRadius: "0",
      paddingBlockEnd: GAINED,
      [READ_ONLY]: { borderStyle: "dashed" },
    });
  });

  it.each(["flushed", "subtle"] as const)(
    "writes the ring color to the edge of the %s look under keyboard focus",
    (look) => {
      expect(fieldLooks[look].value).toMatchObject({
        _focusVisible: { [FIELD_EDGE]: "var(--focus-ring-color)" },
      });
    },
  );

  it.each(["flushed", "subtle"] as const)(
    "widens the edge of the %s look to the ring width under keyboard focus",
    (look) => {
      expect(fieldLooks[look].value).toMatchObject({
        _focusVisible: { borderBlockEndWidth: "ring" },
      });
    },
  );

  it.each(["flushed", "subtle"] as const)(
    "trades the %s look's block-end padding for the wider edge under keyboard focus",
    (look) => {
      expect(fieldLooks[look].value).toMatchObject({
        _focusVisible: { paddingBlockEnd: "0" },
        paddingBlockEnd: GAINED,
      });
    },
  );

  it.each(["flushed", "outline", "subtle"] as const)(
    "dashes the edges of the %s look on a read-only control that is not disabled",
    (look) => {
      expect(fieldLooks[look].value).toMatchObject({ [READ_ONLY]: { borderStyle: "dashed" } });
    },
  );

  it("sets no block-end padding on the outline look", () => {
    expect(fieldLooks.outline.value).not.toHaveProperty("paddingBlockEnd");
  });

  it("sets no hover or invalid state that the field fragment sets", () => {
    expect.hasAssertions();

    for (const look of Object.values(fieldLooks)) {
      expect(look.value).not.toHaveProperty("_hover");
      expect(look.value).not.toHaveProperty("_invalid");
    }
  });
});

describe("wrappedFieldLooks", () => {
  it("reads the read-only state from the control inside the box", () => {
    expect(wrappedFieldLooks.outline.value).toStrictEqual({
      background: "bg.panel",
      borderColor: `var(${FIELD_EDGE})`,
      [WRAPPED_READ_ONLY]: { background: "bg.subtle", borderStyle: "dashed" },
    });
  });

  it("dashes the edges of a box around a read-only control", () => {
    expect(wrappedFieldLooks.subtle.value).toMatchObject({
      [WRAPPED_READ_ONLY]: { borderStyle: "dashed" },
    });
  });

  it("reports focus on the edge of a flushed box when its control has focus", () => {
    expect(wrappedFieldLooks.flushed.value).toMatchObject({ [WRAPPED_FOCUS]: FOCUSED });
  });

  it("pulls in the block-end margin of a focused subtle box by the pixel its edge gains", () => {
    expect(wrappedFieldLooks.subtle.value).toMatchObject({
      [WRAPPED_FOCUS]: { marginBlockEnd: `calc(${GAINED} * -1)` },
    });
  });

  it("sets no block-end padding on a box", () => {
    expect(wrappedFieldLooks.subtle.value).not.toHaveProperty("paddingBlockEnd");
  });

  it("keeps the fragment's ring on an outline box", () => {
    expect(wrappedFieldLooks.outline.value).not.toHaveProperty(WRAPPED_FOCUS);
  });
});
