import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";
import { odd, prefs } from "#resolve/settings.fixtures.ts";
import { accepts, resolveSettings } from "#resolve/settings.ts";

describe("settings", () => {
  it("passes the settings of an installed plugin", () => {
    expect(faultsOf(resolveSettings, contextFor(productOf([installed(timeOff)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it("refuses a section without a schema whose manifest maps no component", () => {
    expect(faultsOf(resolveSettings, contextFor(productOf([installed(prefs)]))).problems).toContain(
      "prefs.code.settings.bare.component: is required on a section without a schema",
    );
  });

  it("refuses a migration that reads the section's own version", () => {
    expect(faultsOf(resolveSettings, contextFor(productOf([installed(prefs)]))).problems).toContain(
      "prefs.code.settings.form.migrations.3: reads version 3, and the section's own is 3",
    );
  });

  it("warns of a section whose page's plugin is not installed", () => {
    expect(
      faultsOf(resolveSettings, contextFor(productOf([installed(prefs)]))).warnings,
    ).toStrictEqual([
      "prefs.settings.sections.away.target: names the settings page billing/page, whose plugin is not installed",
    ]);
  });

  it("refuses a schema outside the keywords a settings property takes", () => {
    expect(
      faultsOf(resolveSettings, contextFor(productOf([installed(odd)]))).problems,
    ).toStrictEqual([
      "odd.settings.sections.broken.schema.additionalProperties: must be false",
      'odd.settings.sections.broken.schema.properties.a.type: must be "boolean", "integer", "number" or "string"',
      'odd.settings.sections.broken.schema.properties.b.type: must be "boolean", "integer", "number" or "string"',
      "odd.settings.sections.broken.schema.properties.c.minimum: is not a member the type states",
      "odd.settings.sections.broken.schema.properties.d.pattern: is not a regular expression",
      "odd.settings.sections.broken.schema.properties.e.default: is required",
      "odd.settings.sections.broken.schema.properties.f.default: is refused by the property's own schema",
    ]);
  });

  it.each([
    { label: "a string for a boolean", property: { default: true, type: "boolean" }, value: "yes" },
    { label: "a fraction for an integer", property: { default: 1, type: "integer" }, value: 1.5 },
    { label: "text for a number", property: { default: 1, type: "number" }, value: "1" },
    {
      label: "a number below the minimum",
      property: { default: 1, minimum: 0, type: "number" },
      value: -1,
    },
    {
      label: "a number above the maximum",
      property: { default: 1, maximum: 14, type: "integer" },
      value: 20,
    },
    { label: "a number for a string", property: { default: "a", type: "string" }, value: 1 },
    {
      label: "a string outside the choices",
      property: { default: "a", enum: ["a"], type: "string" },
      value: "b",
    },
    {
      label: "a string too short",
      property: { default: "ab", minLength: 2, type: "string" },
      value: "a",
    },
    {
      label: "a string too long",
      property: { default: "ab", maxLength: 2, type: "string" },
      value: "abc",
    },
    {
      label: "a string off the pattern",
      property: { default: "a", pattern: "^[a-z]+$", type: "string" },
      value: "A",
    },
  ] as const)("refuses $label", ({ property, value }) => {
    expect(accepts(property, value)).toBe(false);
  });

  it.each([
    { label: "a boolean", property: { default: true, type: "boolean" }, value: false },
    {
      label: "a fraction for a number",
      property: { default: 1, maximum: 2, minimum: 0, type: "number" },
      value: 1.5,
    },
    { label: "a whole integer", property: { default: 1, type: "integer" }, value: 3 },
    { label: "a choice", property: { default: "a", enum: ["a", "b"], type: "string" }, value: "b" },
    {
      label: "a string on the pattern",
      property: { default: "a", maxLength: 3, minLength: 1, pattern: "^[a-z]+$", type: "string" },
      value: "ab",
    },
  ] as const)("takes $label", ({ property, value }) => {
    expect(accepts(property, value)).toBe(true);
  });

  it("resolves the host's settings pages before a plugin's", () => {
    const { pages } = resolveSettings(contextFor(productOf([installed(prefs)])), report());

    expect(pages.map(({ id, order, plugin }) => [id, order, plugin])).toStrictEqual([
      ["host/account", undefined, "host"],
      ["host/plugins", undefined, "host"],
      ["prefs/main", 2, "prefs"],
    ]);
  });

  it("resolves a section with what its manifest's code states", () => {
    const { sections } = resolveSettings(contextFor(productOf([installed(prefs)])), report());

    expect(
      sections.map(({ component, id, migrations, schemaVersion, target }) => [
        id,
        component,
        migrations,
        schemaVersion,
        target,
      ]),
    ).toStrictEqual([
      ["prefs/away", true, [], 1, "billing/page"],
      ["prefs/bare", false, [], 1, "host/account"],
      ["prefs/form", false, [1, 2, 3], 3, "host/account"],
    ]);
  });
});
