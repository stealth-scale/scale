import { describe, expect, it } from "vitest";

import { plain, region, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { mistyped, SCHEMA, schemaFaults, valueFaults } from "#resolve/config.fixtures.ts";
import { checkConfig, settledConfig } from "#resolve/config.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("config", () => {
  it("takes a schema defineConfigSchema writes", () => {
    expect(schemaFaults(SCHEMA)).toStrictEqual([]);
  });

  it("refuses a schema that is not an object", () => {
    expect(schemaFaults("object")).toStrictEqual(["time-off.config: must be an object"]);
  });

  it("refuses a schema that admits other properties", () => {
    expect(schemaFaults({ ...SCHEMA, additionalProperties: true })).toStrictEqual([
      "time-off.config.additionalProperties: must be false",
    ]);
  });

  it("refuses a property that is not an object", () => {
    expect(
      schemaFaults({ ...SCHEMA, properties: { region: "string" }, required: [] }),
    ).toStrictEqual(["time-off.config.properties.region: must be an object"]);
  });

  it("refuses a property of a kind no configuration takes", () => {
    const properties = { since: { description: "config.since", type: "date" } };

    expect(schemaFaults({ ...SCHEMA, properties, required: [] })).toStrictEqual([
      'time-off.config.properties.since.type: must be "boolean", "number" or "string"',
    ]);
  });

  it("refuses a default of a kind no property takes", () => {
    const properties = {
      approvers: { default: [], description: "config.approvers", type: "number" },
    };

    expect(schemaFaults({ ...SCHEMA, properties, required: [] })).toStrictEqual([
      "time-off.config.properties.approvers.default: must be a boolean, a number or a string",
    ]);
  });

  it("refuses a default of another kind than its property", () => {
    const properties = {
      approvers: { default: "1", description: "config.approvers", type: "number" },
    };

    expect(schemaFaults({ ...SCHEMA, properties, required: [] })).toStrictEqual([
      "time-off.config.properties.approvers.default: is not of the property's type",
    ]);
  });

  it("refuses a required name that is no property", () => {
    expect(schemaFaults({ ...SCHEMA, required: ["region", "country"] })).toStrictEqual([
      "time-off.config.required.1: names country, which is no property",
    ]);
  });

  it("refuses required names that are not a list", () => {
    expect(schemaFaults({ ...SCHEMA, required: "region" })).toStrictEqual([
      "time-off.config.required: must be a list",
    ]);
  });

  it("takes a configuration with every required property", () => {
    expect(valueFaults(SCHEMA, { region: "eu" })).toStrictEqual([]);
  });

  it("refuses a configuration without a required property that has no default", () => {
    expect(valueFaults(SCHEMA, {})).toStrictEqual([
      "product.plugins.time-off.config.region: is required",
    ]);
  });

  it("refuses a value of another kind than its property", () => {
    expect(valueFaults(SCHEMA, { approvers: "two", region: "eu" })).toStrictEqual([
      "product.plugins.time-off.config.approvers: is a string, and the property takes a number",
    ]);
  });

  it("refuses a property the schema does not declare", () => {
    expect(valueFaults(undefined, { region: "eu" })).toStrictEqual([
      "product.plugins.time-off.config.region: is not a property the plugin declares",
    ]);
  });

  it("refuses a value for a property that is not an object", () => {
    expect(valueFaults({ properties: { region: "string" } }, { region: "eu" })).toStrictEqual([
      "product.plugins.time-off.config.region: is a string, and the property takes a value",
    ]);
  });

  it("settles the schema's defaults under the product's values", () => {
    expect(settledConfig(SCHEMA, { approvers: 3, region: "eu" })).toStrictEqual({
      approvers: 3,
      region: "eu",
      zone: "eu-1",
    });
  });

  it("ignores a default of a kind no property takes", () => {
    const schema = { properties: { since: { default: [] }, zone: "eu" } };

    expect(settledConfig(schema, undefined)).toStrictEqual({});
  });

  it("checks the configuration the product states for each installed plugin", () => {
    const context = contextFor(
      productOf([
        installed(timeOff, { config: { approvers: 2 } }),
        installed(plain),
        installed(region, { config: { region: "eu" } }),
      ]),
    );

    expect(faultsOf(checkConfig, context).problems).toStrictEqual([]);
  });

  it("refuses a schema of an installed plugin under the plugin's id", () => {
    const context = contextFor(productOf([installed(mistyped)]));

    expect(faultsOf(checkConfig, context).problems).toStrictEqual([
      "mistyped.config.properties.count.default: is not of the property's type",
    ]);
  });
});
