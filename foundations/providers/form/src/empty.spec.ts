import { describe, expect, it } from "vitest";

import { emptied } from "#empty.ts";
import { type Schema } from "#schema.ts";

const schema: Schema = {
  properties: {
    billing: { properties: { country: { enum: ["BE", "NL"], type: "string" } }, type: "object" },
    consent: { const: true, type: "boolean" },
    count: { enum: [1, 2], type: "integer" },
    lines: { items: { properties: { unit: { enum: ["h", "d"], type: "string" } } }, type: "array" },
    plan: { default: "free", enum: ["free", "pro"], type: "string" },
    rating: { enum: [1, 2, 3], type: "number" },
    topic: { enum: ["sales", "support"], type: "string" },
    version: { const: { major: 2 }, type: "object" },
  },
  type: "object",
};

/**
 * Builds the values the engine's library would, with every choice made for the person.
 */
function filled(): Record<string, unknown> {
  return {
    billing: { country: "BE" },
    consent: true,
    count: 1,
    lines: [{ unit: "h" }],
    plan: "free",
    rating: 1,
    topic: "sales",
    version: { major: 2 },
  };
}

describe("emptied", () => {
  it("empties a choice nobody defaulted to the empty value of its type", () => {
    expect(emptied(schema, filled())).toStrictEqual({
      billing: { country: "" },
      consent: false,
      count: 0,
      lines: [{ unit: "h" }],
      plan: "free",
      rating: 0,
      topic: "",
      version: { major: 2 },
    });
  });

  it("empties an array of choices nobody defaulted", () => {
    const channels: Schema = {
      properties: {
        channels: {
          items: { enum: ["email", "chat"], type: "string" },
          minItems: 1,
          type: "array",
        },
        tags: { default: ["new"], items: { enum: ["new", "old"], type: "string" }, type: "array" },
      },
      type: "object",
    };

    expect(emptied(channels, { channels: ["email"], tags: ["new"] })).toStrictEqual({
      channels: [],
      tags: ["new"],
    });
  });

  it("keeps a value the caller gave", () => {
    const given = { billing: { country: "NL" }, topic: "support" };
    const built = emptied(schema, { ...filled(), ...given }, given);

    expect(built).toMatchObject({ billing: { country: "NL" }, consent: false, topic: "support" });
  });

  it("empties a root that is itself a choice unless the caller gave a value", () => {
    expect(emptied({ enum: ["a", "b"], type: "string" }, "a")).toBe("");
    expect(emptied({ enum: ["a", "b"], type: "string" }, "b", "b")).toBe("b");
    expect(emptied({ const: 2, type: "object" }, 2)).toBe(2);
  });

  it("leaves a path alone where the values built have no object on the way", () => {
    expect(emptied(schema, { billing: "no", consent: true })).toStrictEqual({
      billing: "no",
      consent: false,
      count: 0,
      rating: 0,
      topic: "",
    });
    expect(emptied(schema, "not an object")).toBe("not an object");
  });
});
