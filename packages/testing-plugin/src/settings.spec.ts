import { describe, expect, it } from "vitest";

import { defineContract, settingsPage, settingsSection } from "@stealthscale/sdk-core";

import { caseNamed } from "#checks.fixtures.ts";
import { settingsCases } from "#settings.ts";
import { SHOP } from "#shop-manifest.fixtures.ts";

const CASES = settingsCases(SHOP);

const strictContract = defineContract("strict", (self) => ({
  settings: {
    pages: { strict: settingsPage({ label: "settings.title" }) },
    sections: {
      code: settingsSection({
        label: "settings.code",
        schema: {
          additionalProperties: false,
          properties: { prefix: { default: "a", minLength: 3, type: "string" } },
          type: "object",
        },
        target: self.settingsPage("strict"),
      }),
    },
  },
  version: "1.0.0",
}));

describe("settingsCases", () => {
  it("names the cases of every settings section", () => {
    expect(CASES.map(({ name }) => name)).toStrictEqual([
      "settings section shop/display renders with its defaults",
      "settings section shop/display's defaults pass its schema",
      "settings section shop/notice renders with its defaults",
    ]);
  });

  it("passes a section the form renders on its page", async () => {
    const found = caseNamed(CASES, "settings section shop/display renders with its defaults");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes a section whose component renders on its page", async () => {
    const found = caseNamed(CASES, "settings section shop/notice renders with its defaults");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes defaults the schema admits", async () => {
    const found = caseNamed(CASES, "settings section shop/display's defaults pass its schema");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails defaults the schema refuses", async () => {
    const subject = { ...SHOP, contract: strictContract };
    const found = caseNamed(
      settingsCases(subject),
      "settings section strict/code's defaults pass its schema",
    );

    await expect(found.run()).rejects.toThrow("strict/code.prefix");
  });
});
