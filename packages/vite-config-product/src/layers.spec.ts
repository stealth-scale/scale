import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

/**
 * Returns the lint override of the definition's layer.
 */
function excuse(definition?: string): unknown {
  const [, layer] = layers(definition === undefined ? {} : { definition });

  return layer !== undefined && "item" in layer ? layer.item : undefined;
}

describe("layers", () => {
  it("names each layer for the call that built it", () => {
    expect(layers().map((one) => one.name)).toStrictEqual([
      "product.composed",
      "product.definition",
    ]);
  });

  it("excuses the definition module from the default export rule", () => {
    expect(excuse()).toStrictEqual({
      files: ["**/src/product.ts"],
      rules: { "no-default-export": "off" },
    });
  });

  it("excuses the definition module the options name", () => {
    expect(excuse("src/app/product.ts")).toMatchObject({ files: ["**/src/app/product.ts"] });
  });
});
