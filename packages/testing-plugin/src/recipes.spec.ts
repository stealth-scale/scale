import { describe, expect, it } from "vitest";

import { recipeCase } from "#recipes.ts";

describe("recipeCase", () => {
  it("passes recipes whose class names start with the plugin id", async () => {
    const preset = {
      theme: {
        extend: {
          recipes: { balance: { className: "ledger-balance" } },
          slotRecipes: { card: { className: "ledger-card" } },
        },
      },
    };

    await expect(recipeCase("ledger", preset).run()).resolves.toBeUndefined();
  });

  it("fails a recipe whose class name lacks the plugin id", async () => {
    const preset = { theme: { recipes: { balance: { className: "balance" } } } };

    await expect(recipeCase("ledger", preset).run()).rejects.toThrow(
      "The recipe balance does not start with ledger-.",
    );
  });

  it("reads a recipe's name where it states no class name", async () => {
    const preset = { theme: { extend: { slotRecipes: { card: {} } } } };

    await expect(recipeCase("ledger", preset).run()).rejects.toThrow(
      "The recipe card does not start with ledger-.",
    );
  });

  it("passes a preset that registers no recipe", async () => {
    await expect(recipeCase("ledger", {}).run()).resolves.toBeUndefined();
  });
});
