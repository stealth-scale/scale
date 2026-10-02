/**
 * Covers composing the scratch product: its evaluation, the packages found, the words and keys
 * checks the resolver receives, and the failures of a definition that does not load.
 */

import { relative } from "node:path";
import { describe, expect, it } from "vitest";

import { lineOf } from "@stealthscale/sdk-core";

import {
  APP,
  type Composed,
  composedWith,
  CONTRACT,
  contractOf,
  DEFINITION,
  WEB,
  WORDS,
} from "#compose.fixtures.ts";

/**
 * The composition of the scratch product with no file changed, started by the first case that
 * reads it.
 */
let plain: Promise<Composed> | undefined;

/**
 * Returns the composition of the scratch product with no file changed.
 */
function composedPlain(): Promise<Composed> {
  plain ??= composedWith();

  return plain;
}

/**
 * Returns every problem of a composition as the build prints it.
 */
function problemsOf({ composition }: Composed): readonly string[] {
  return composition.resolution.problems.map(lineOf);
}

describe("compose", () => {
  it("resolves a product whose plugins pass every check", async () => {
    const { composition } = await composedPlain();

    expect(composition.resolution.problems).toStrictEqual([]);
    expect(composition.resolution.product?.productId).toBe("people");
  });

  it("finds the web package of each installed plugin", async () => {
    const { composition, root } = await composedPlain();
    const found = composition.discovery.packages["time-off"];

    expect(found?.name).toBe("@acme/time-off");
    expect(relative(root, found?.directory ?? "")).toBe(WEB);
  });

  it("finds the contract package of each installed plugin", async () => {
    const { composition, root } = await composedPlain();
    const found = composition.discovery.contracts["time-off"];

    expect(found?.name).toBe("@acme/time-off-contract");
    expect(relative(root, found?.directory ?? "")).toBe(CONTRACT);
  });

  it("lists the files the definition's evaluation read with the definition first", async () => {
    const { composition, root } = await composedPlain();
    const files = composition.files.map((file) => relative(root, file));

    expect(files[0]).toBe(`${APP}/${DEFINITION}`);
    expect(files).toContain(`${CONTRACT}/src/index.ts`);
  });

  it("returns no hint when every contract package's catalogues are found", async () => {
    const { composition } = await composedPlain();

    expect(composition.hints).toStrictEqual([]);
  });

  it("finds the contract package of a contract the definition imports beside a re-export", async () => {
    const composed = await composedWith({
      [`${APP}/${DEFINITION}`]: [
        'import { defineProduct, installed } from "@stealthscale/sdk-core";',
        'import { contract } from "@acme/time-off-contract";',
        'import { manifest } from "@acme/time-off";',
        "",
        "export default defineProduct({",
        '  name: "product.name",',
        "  plugins: [installed(manifest)],",
        '  productId: "people",',
        "  signIn: contract.routes.overview,",
        '  version: "1.0.0",',
        "});",
        "",
      ].join("\n"),
      [`${WEB}/src/index.ts`]: [
        'export { contract } from "@acme/time-off-contract";',
        'export { manifest } from "./manifest.ts";',
        "",
      ].join("\n"),
    });

    expect(composed.composition.discovery.contracts["time-off"]?.name).toBe(
      "@acme/time-off-contract",
    );
    expect(problemsOf(composed)).toStrictEqual([]);
  });

  it("checks every key against the fallback catalogue the catalogue plugin found", async () => {
    const composed = await composedWith({
      [`${CONTRACT}/locales/en/time-off.json`]: JSON.stringify({ ...WORDS, navigation: {} }),
    });

    expect(problemsOf(composed)).toStrictEqual([
      "time-off.routes.overview.navigation.label: names the key navigation.overview, which the fallback catalogue of time-off lacks",
    ]);
  });

  it("checks each command's keys with the hotkey parser", async () => {
    const composed = await composedWith({
      [`${CONTRACT}/src/index.ts`]: contractOf(
        [
          'commands: { request: command({ keys: "Hyper+R", label: "commands.request" }) },',
          'routes: { overview: route({ navigation: { label: "navigation.overview" }, path: "time-off" }) },',
        ].join(" "),
      ),
    });

    expect(problemsOf(composed)).toStrictEqual([
      "time-off.commands.request.keys: cannot be read: Unknown modifier: 'Hyper'",
    ]);
  });

  it("refuses a plugin whose namespace a package other than its contract package publishes", async () => {
    const composed = await composedWith({
      [`${WEB}/locales/en/time-off.json`]: JSON.stringify({ title: "Time off" }),
    });

    expect(problemsOf(composed)).toStrictEqual([
      "time-off: is a catalogue namespace that @acme/time-off publishes",
    ]);
  });

  it("accepts the application's own catalogue in a plugin's namespace", async () => {
    const composed = await composedWith({
      [`${APP}/locales/en/time-off.json`]: JSON.stringify({ plugin: { name: "Leave" } }),
    });

    expect(problemsOf(composed)).toStrictEqual([]);
  });

  it("names the scope to add for a contract package the catalogue plugin does not follow", async () => {
    const composed = await composedWith({}, { scopes: ["@other"] });

    expect(composed.composition.hints).toStrictEqual([
      "@acme/time-off-contract has catalogues the i18n layer does not follow. Add @acme to the scopes of the i18n layer.",
    ]);
  });

  it("rejects with the definition's path when the definition fails to load", async () => {
    await expect(
      composedWith({ [`${APP}/${DEFINITION}`]: 'throw new Error("broken");\n' }),
    ).rejects.toThrow(`${DEFINITION} failed to load in Node: broken.`);
  });

  it("keeps the evaluation's error as the cause of the rejection", async () => {
    const rejected = await composedWith({
      [`${APP}/${DEFINITION}`]: 'throw new Error("broken");\n',
    }).catch((error: unknown) => error);

    expect(rejected).toBeInstanceOf(Error);
    expect((rejected as Error).cause).toStrictEqual(new Error("broken"));
  });

  it("writes a thrown value that is not an error as text", async () => {
    await expect(composedWith({ [`${APP}/${DEFINITION}`]: 'throw "broken";\n' })).rejects.toThrow(
      `${DEFINITION} failed to load in Node: broken.`,
    );
  });

  it.each([
    { label: "no default export", source: "export const product = {};\n" },
    { label: "a default export that is not an object", source: "export default 1;\n" },
    { label: "a default export of null", source: "export default null;\n" },
  ])("rejects a definition with $label", async ({ source }) => {
    await expect(composedWith({ [`${APP}/${DEFINITION}`]: source })).rejects.toThrow(
      `${DEFINITION} has no default export, and the build reads the product's definition from it.`,
    );
  });
});
