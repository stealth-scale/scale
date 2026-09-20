import { describe, expect, it } from "vitest";

import { lightDarked } from "#theme/light-dark.ts";

describe("lightDarked", () => {
  it("renders a color stated in both modes as one light-dark value", () => {
    expect(
      lightDarked({ colors: { bg: { value: { _dark: "#111", base: "#fff" } } } }),
    ).toStrictEqual({ colors: { bg: { value: "light-dark(#fff, #111)" } } });
  });

  it("renders a reference stated in both modes with the references inside", () => {
    expect(
      lightDarked({
        colors: { fg: { value: { _dark: "{colors.gray.50}", base: "{colors.gray.950}" } } },
      }),
    ).toStrictEqual({
      colors: { fg: { value: "light-dark({colors.gray.950}, {colors.gray.50})" } },
    });
  });

  it("renders an equal pair as the one value", () => {
    expect(
      lightDarked({ colors: { link: { value: { _dark: "{colors.a}", base: "{colors.a}" } } } }),
    ).toStrictEqual({ colors: { link: { value: "{colors.a}" } } });
  });

  it("keeps a color stated once", () => {
    expect(lightDarked({ colors: { brand: { value: "#123" } } })).toStrictEqual({
      colors: { brand: { value: "#123" } },
    });
  });

  it("keeps a color naming a condition beside the two sides", () => {
    const value = { _dark: "#111", _highContrast: "#000", base: "#fff" };

    expect(lightDarked({ colors: { bg: { value } } })).toStrictEqual({ colors: { bg: { value } } });
  });

  it("keeps a color naming one side alone", () => {
    const value = { _dark: "#111" };

    expect(lightDarked({ colors: { bg: { value } } })).toStrictEqual({ colors: { bg: { value } } });
  });

  it("keeps a token outside a colors group", () => {
    const shadows = { sm: { value: { _dark: "0 1px 2px #000", base: "0 1px 2px #ccc" } } };

    expect(lightDarked({ shadows })).toStrictEqual({ shadows });
  });

  it("renders a color nested under a group inside colors", () => {
    expect(
      lightDarked({
        semanticTokens: {
          colors: { gray: { fg: { DEFAULT: { value: { _dark: "#eee", base: "#111" } } } } },
        },
      }),
    ).toStrictEqual({
      semanticTokens: {
        colors: { gray: { fg: { DEFAULT: { value: "light-dark(#111, #eee)" } } } },
      },
    });
  });

  it("renders the colors of every preset in an array", () => {
    expect(
      lightDarked([{ theme: { extend: { colors: { a: { value: { _dark: "b", base: "a" } } } } } }]),
    ).toStrictEqual([{ theme: { extend: { colors: { a: { value: "light-dark(a, b)" } } } } }]);
  });

  it("keeps a leaf that is not an object", () => {
    expect(
      lightDarked({ colors: { a: { value: { _dark: 1, base: "a" } } }, name: "x" }),
    ).toStrictEqual({ colors: { a: { value: { _dark: 1, base: "a" } } }, name: "x" });
  });

  it("keeps a regular expression a recipe names as written", () => {
    const jsx = [/Button$/u];

    expect(lightDarked({ recipes: { button: { jsx } } })).toStrictEqual({
      recipes: { button: { jsx } },
    });
  });

  it("keeps the description a token carries beside its value", () => {
    expect(
      lightDarked({ colors: { a: { description: "the page", value: { _dark: "b", base: "a" } } } }),
    ).toStrictEqual({ colors: { a: { description: "the page", value: "light-dark(a, b)" } } });
  });
});
