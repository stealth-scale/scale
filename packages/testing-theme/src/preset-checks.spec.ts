import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";
import { definePreset, type Preset } from "@stealthscale/theme/authoring";

import { presetViolations } from "#preset-checks.ts";

const RECIPE = 'export const recipe = defineRecipe({ className: "button" });\n';

const SLOTTED = 'export const recipe = defineSlotRecipe({ className: "dialog", slots: [] });\n';

function checked(files: Readonly<Record<string, string>>, preset: Preset): readonly string[] {
  return withScratchWorkspace(files, (workspace) =>
    presetViolations(preset, { at: workspace.path("src") }),
  );
}

describe("presetViolations", () => {
  it("reports nothing for a preset that registers every recipe file under its class name", () => {
    const preset = definePreset({
      name: "@acme/actions",
      theme: {
        extend: {
          recipes: { button: { className: "button" } },
          slotRecipes: { dialog: { className: "dialog", slots: ["content"] } },
        },
      },
    });

    expect(
      checked({ "src/button.recipe.ts": RECIPE, "src/dialog.recipe.ts": SLOTTED }, preset),
    ).toStrictEqual([]);
  });

  it("reports a recipe file the preset does not register", () => {
    expect(
      checked({ "src/button.recipe.ts": RECIPE }, definePreset({ name: "@acme/actions" })),
    ).toStrictEqual(["preset.registered: @acme/actions registers no recipe for button.recipe.ts"]);
  });

  it("reports a key no recipe file defines", () => {
    const preset = definePreset({
      name: "@acme/actions",
      theme: { extend: { recipes: { button: { className: "button" } } } },
    });

    expect(checked({ "src/notes.ts": "export const notes = 1;\n" }, preset)).toStrictEqual([
      "preset.registered: @acme/actions registers button, which no recipe file defines",
    ]);
  });

  it("reports a recipe registered under a key that is not its class name", () => {
    const preset = definePreset({
      name: "@acme/actions",
      theme: { extend: { recipes: { btn: { className: "button" } } } },
    });

    expect(checked({ "src/button.recipe.ts": RECIPE }, preset)).toStrictEqual([
      "preset.registered: @acme/actions registers no recipe for button.recipe.ts",
      "preset.registered: @acme/actions registers btn, which no recipe file defines",
      "preset.keys: @acme/actions registers button under btn",
    ]);
  });

  it("reports a slot recipe under recipes and a recipe without slots under slotRecipes", () => {
    const preset = {
      name: "@acme/actions",
      theme: {
        extend: {
          recipes: { dialog: { className: "dialog", slots: ["content"] } },
          slotRecipes: { button: { className: "button" } },
        },
      },
    } as unknown as Preset;

    expect(
      checked({ "src/button.recipe.ts": RECIPE, "src/dialog.recipe.ts": SLOTTED }, preset),
    ).toStrictEqual([
      "preset.slots: @acme/actions registers dialog under recipes, and it has slots",
      "preset.slots: @acme/actions registers button under slotRecipes, and it has no slots",
    ]);
  });

  it("reports a source directory that is absent", () => {
    expect(
      presetViolations(definePreset({ name: "@acme/actions" }), { at: "/nowhere" }),
    ).toStrictEqual(["@acme/actions has no source directory at /nowhere"]);
  });

  it("reports a skip without a reason and no violation from a skipped check", () => {
    const preset = definePreset({
      name: "@acme/actions",
      theme: { extend: { recipes: { btn: { className: "button" } } } },
    });

    expect(
      withScratchWorkspace({ "src/button.recipe.ts": RECIPE }, (workspace) =>
        presetViolations(preset, {
          at: workspace.path("src"),
          skip: { "preset.keys": "", "preset.registered": "the key is legacy" },
        }),
      ),
    ).toStrictEqual(["skip of preset.keys gives no reason"]);
  });
});
