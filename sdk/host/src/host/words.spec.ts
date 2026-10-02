import { renderHook } from "@testing-library/react";
import { getI18n } from "react-i18next";
import { describe, expect, it } from "vitest";

import { wordsInstance } from "#host/words.fixtures.ts";
import { pluginWordsOf, useProductName } from "#host/words.ts";

describe("words", () => {
  it("translates a key of a plugin's catalogue", () => {
    expect(pluginWordsOf(wordsInstance()).t("time-off", "plugin.name")).toBe("Time off");
  });

  it("interpolates the values given", () => {
    expect(pluginWordsOf(wordsInstance()).t("time-off", "commands.failed", { count: 2 })).toBe(
      "2 requests failed",
    );
  });

  it("returns true for a key the plugin's catalogue states", () => {
    expect(pluginWordsOf(wordsInstance()).exists("time-off", "plugin.name")).toBe(true);
  });

  it("returns false for a key the plugin's catalogue lacks", () => {
    expect(pluginWordsOf(wordsInstance()).exists("time-off", "keywords.commands.request")).toBe(
      false,
    );
  });

  it("returns the product's name in the product's own namespace", () => {
    getI18n().addResourceBundle("en", "people", { product: { name: "People" } }, true, true);

    const { result } = renderHook(() =>
      useProductName({ name: "product.name", productId: "people" }),
    );

    expect(result.current).toBe("People");
  });
});
