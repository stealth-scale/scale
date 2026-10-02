import { defineConfigSchema } from "#config.ts";
import { defineContract } from "#define.ts";
import { checkSchema, checkValues } from "#resolve/config.ts";
import { report } from "#resolve/problem.ts";
import { linesOf, manifestOf } from "#resolve/resolve.fixtures.ts";

export const mistyped = manifestOf(
  defineContract("mistyped", {
    config: defineConfigSchema({
      count: { default: "1", description: "config.count", type: "number" },
    }),
  }),
);

export const SCHEMA = {
  additionalProperties: false,
  properties: {
    approvers: { default: 1, description: "config.approvers", type: "number" },
    region: { description: "config.region", type: "string" },
    zone: { default: "eu-1", description: "config.zone", type: "string" },
  },
  required: ["region", "zone"],
  type: "object",
} as const;

export function schemaFaults(schema: unknown): readonly string[] {
  const faults = report();

  checkSchema("time-off.config", schema, faults);

  return linesOf(faults).problems;
}

export function valueFaults(
  schema: unknown,
  config: Readonly<Record<string, unknown>>,
): readonly string[] {
  const faults = report();

  checkValues("product.plugins.time-off.config", schema, config, faults);

  return linesOf(faults).problems;
}
