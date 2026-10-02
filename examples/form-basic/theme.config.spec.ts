import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { configured, hookContext, started, transformed } from "@stealthscale/testing";
import { LAYER_DECLARATION, theme } from "@stealthscale/vite-plugin-theme";

import statement from "./theme.config.ts";

const CONDITIONS = ["stealth-source", "node"];

async function compile(): Promise<string> {
  const plugin = theme.stylesheet();
  const context = hookContext();

  await configured(plugin, {
    root: import.meta.dirname,
    ssr: { resolve: { conditions: CONDITIONS } },
  });
  await started(plugin, context);

  return (
    (await transformed(
      plugin,
      context,
      LAYER_DECLARATION,
      join(import.meta.dirname, "styles.css"),
    )) ?? ""
  );
}

const css = await compile();

describe("theme.config", () => {
  it("lists ink alone", () => {
    expect(statement.themes.map((each) => each.name)).toStrictEqual(["ink"]);
  });

  it("compiles the field recipe the forms package publishes", () => {
    expect(css).toContain(".field__root");
  });

  it("compiles the form recipe the binding renders", () => {
    expect(css).toContain(".form__root");
  });
});
