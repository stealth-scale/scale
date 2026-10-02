import { describe, expect, expectTypeOf, it } from "vitest";

import { type ConfigOf, type ConfigWritten, defineConfigSchema } from "#config.ts";

const SCHEMA = defineConfigSchema(
  {
    approvers: { default: 1, description: "config.approvers", type: "number" },
    audit: { default: false, description: "config.audit", type: "boolean" },
    region: { description: "config.region", type: "string" },
    theme: { description: "config.theme", type: "string" },
  },
  { required: ["approvers", "region"] },
);

describe("config", () => {
  it("defines a schema that admits the declared properties alone", () => {
    expect(
      defineConfigSchema({
        audit: { default: false, description: "config.audit", type: "boolean" },
      }),
    ).toStrictEqual({
      additionalProperties: false,
      properties: { audit: { default: false, description: "config.audit", type: "boolean" } },
      required: [],
      type: "object",
    });
  });

  it("lists the properties a product has to state", () => {
    expect(SCHEMA.required).toStrictEqual(["approvers", "region"]);
  });

  it("refuses a required name the schema does not declare", () => {
    const schema = defineConfigSchema(
      { region: { description: "config.region", type: "string" } },
      // @ts-expect-error -- the schema declares no property named `country`.
      { required: ["country"] },
    );

    expect(schema.required).toStrictEqual(["country"]);
  });

  it("types a property with a default as present when read", () => {
    expect(SCHEMA.properties.audit.default).toBe(false);

    expectTypeOf<ConfigOf<typeof SCHEMA>>().toHaveProperty("audit").toEqualTypeOf<boolean>();
  });

  it("types a required property as present when read", () => {
    expect(SCHEMA.properties.region.type).toBe("string");

    expectTypeOf<ConfigOf<typeof SCHEMA>>().toHaveProperty("region").toEqualTypeOf<string>();
  });

  it("types an optional property without a default as possibly undefined", () => {
    expect(SCHEMA.properties.theme.type).toBe("string");

    expectTypeOf<ConfigOf<typeof SCHEMA>>()
      .toHaveProperty("theme")
      .toEqualTypeOf<string | undefined>();
  });

  it("requires a product to write a required property without a default", () => {
    // @ts-expect-error -- `region` is required and has no default.
    const written: ConfigWritten<typeof SCHEMA> = { audit: true };

    expect(written.audit).toBe(true);
  });

  it("lets a product leave out a required property with a default", () => {
    const written: ConfigWritten<typeof SCHEMA> = { region: "eu" };

    expect(written.region).toBe("eu");
  });

  it("types a written property by its kind", () => {
    const written: ConfigWritten<typeof SCHEMA> = { approvers: 2, region: "eu" };

    expect(written.approvers).toBe(2);

    expectTypeOf(written).toHaveProperty("approvers").toEqualTypeOf<number | undefined>();
  });
});
