import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { extensionFiles, recipeFiles } from "#files.ts";

const RECIPE = 'export const recipe = defineRecipe({ className: "button" });\n';

const SLOTTED = 'export const recipe = defineSlotRecipe({ className: "dialog", slots: [] });\n';

const EXTENSION = "export const extension = { base: {} };\n";

describe("files", () => {
  it("lists every recipe file with its key and whether it is slotted", () => {
    const found = withScratchWorkspace(
      {
        "src/button/button.recipe.ts": RECIPE,
        "src/dialog/dialog.recipe.ts": SLOTTED,
        "src/menu/menu-item.recipe.ts": RECIPE,
      },
      (workspace) => recipeFiles(workspace.path("src")),
    );

    expect(found).toStrictEqual([
      { file: "button/button.recipe.ts", key: "button", slotted: false },
      { file: "dialog/dialog.recipe.ts", key: "dialog", slotted: true },
      { file: "menu/menu-item.recipe.ts", key: "menuItem", slotted: false },
    ]);
  });

  it("lists a recipe file named for its directory under the directory's name", () => {
    const found = withScratchWorkspace(
      {
        "src/button/recipe.ts": RECIPE,
        "src/menu-item/recipe.ts": SLOTTED,
      },
      (workspace) => recipeFiles(workspace.path("src")),
    );

    expect(found).toStrictEqual([
      { file: "button/recipe.ts", key: "button", slotted: false },
      { file: "menu-item/recipe.ts", key: "menuItem", slotted: true },
    ]);
  });

  it("skips a specification and a recipe file that exports no recipe", () => {
    const found = withScratchWorkspace(
      {
        "src/button.recipe.spec.ts": RECIPE,
        "src/button.recipe.ts": RECIPE,
        "src/draft.recipe.ts": "export const draft = {};\n",
      },
      (workspace) => recipeFiles(workspace.path("src")),
    );

    expect(found.map((file) => file.file)).toStrictEqual(["button.recipe.ts"]);
  });

  it("lists a recipe whose export declares a type or sits on the next line", () => {
    const found = withScratchWorkspace(
      {
        "src/annotated.recipe.ts":
          'export const recipe: Recipe = defineRecipe({ className: "a" });\n',
        "src/wrapped.recipe.ts": 'export const recipe =\n  defineSlotRecipe({ className: "w" });\n',
      },
      (workspace) => recipeFiles(workspace.path("src")),
    );

    expect(found.map((file) => [file.file, file.slotted])).toStrictEqual([
      ["annotated.recipe.ts", false],
      ["wrapped.recipe.ts", true],
    ]);
  });

  it("returns an empty array when the directory is absent", () => {
    expect(recipeFiles("/nowhere/at/all")).toStrictEqual([]);
  });

  it("lists every extension file under recipes and slot-recipes", () => {
    const found = withScratchWorkspace(
      {
        "src/recipes/button.ts": EXTENSION,
        "src/recipes/notes.ts": "export const notes = 1;\n",
        "src/slot-recipes/dialog.ts": EXTENSION,
      },
      (workspace) => extensionFiles(workspace.path("src")),
    );

    expect(found).toStrictEqual([
      { file: "recipes/button.ts", key: "button" },
      { file: "slot-recipes/dialog.ts", key: "dialog" },
    ]);
  });
});
