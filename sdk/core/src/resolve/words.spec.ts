import { describe, expect, it } from "vitest";

import { plain, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";
import { prefs } from "#resolve/settings.fixtures.ts";
import { CATALOGUES, FORM, RAW, raw } from "#resolve/words.fixtures.ts";
import { checkWords } from "#resolve/words.ts";

describe("checkWords", () => {
  it("checks nothing where the build passes no catalogues", () => {
    expect(faultsOf(checkWords, contextFor(productOf([installed(timeOff)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it("passes a plugin whose catalogue has every key its contract names", () => {
    const context = contextFor(productOf([installed(timeOff)], { name: "product.name" }), {
      catalogues: CATALOGUES,
    });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([]);
  });

  it("refuses a plugin without a catalogue in the fallback language", () => {
    const context = contextFor(productOf([installed(timeOff), installed(plain)]), {
      catalogues: CATALOGUES,
    });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "plain: has no catalogue in the fallback language",
    ]);
  });

  it("refuses a key the plugin's fallback catalogue lacks", () => {
    const catalogues = { ...CATALOGUES, "time-off": { ...CATALOGUES["time-off"], roles: {} } };
    const context = contextFor(productOf([installed(timeOff)]), { catalogues });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "time-off.roles.approver.description: names the key roles.approver, which the fallback catalogue of time-off lacks",
    ]);
  });

  it("refuses the keys a schema section's form reads that the catalogue lacks", () => {
    const context = contextFor(productOf([installed(prefs)]), {
      catalogues: { ...CATALOGUES, ...FORM },
    });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "prefs.settings.sections.form.schema.properties.channel.enum: names the key settings.form.fields.channel.options.email, which the fallback catalogue of prefs lacks",
      "prefs.settings.sections.form.schema.properties.ratio: names the key settings.form.fields.ratio.label, which the fallback catalogue of prefs lacks",
    ]);
  });

  it("reads the keys a schema states where the schema is the plugin's own data", () => {
    const context = contextFor(productOf([installed(raw)]), {
      catalogues: { ...CATALOGUES, ...RAW },
    });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "raw.settings.sections.s.schema.properties.p: names the key settings.s.fields.p.label, which the fallback catalogue of raw lacks",
    ]);
  });

  it("refuses a product name its own catalogue lacks", () => {
    const context = contextFor(productOf([], { name: "product.title" }), {
      catalogues: CATALOGUES,
    });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "product.name: names the key product.title, which the fallback catalogue of people lacks",
    ]);
  });

  it("refuses a product name where the product has no catalogue", () => {
    const context = contextFor(productOf([], { productId: "staff" }), { catalogues: CATALOGUES });

    expect(faultsOf(checkWords, context).problems).toStrictEqual([
      "product.name: names the key product.name, which the fallback catalogue of staff lacks",
    ]);
  });
});
