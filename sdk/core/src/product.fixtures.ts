import { defineConfigSchema } from "#config.ts";
import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { DECLARATION } from "#manifest.fixtures.ts";
import { definePlugin } from "#manifest.ts";

export const timeOff = definePlugin(timeOffContract, DECLARATION);

export const regionContract = defineContract("region", {
  config: defineConfigSchema(
    {
      region: { description: "config.region", type: "string" },
      zone: { default: "eu-1", description: "config.zone", type: "string" },
    },
    { required: ["region"] },
  ),
});

export const region = definePlugin(regionContract, {});

export const plainContract = defineContract("plain", {});

export const plain = definePlugin(plainContract, {});
