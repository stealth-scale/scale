import { describe, expect, it } from "vitest";

import {
  type Compounds,
  publishedCompounds,
  scopedPreset,
  scopedPresets,
  type Switchable,
  type SwitchablePreset,
  unmatchedCompounds,
} from "#scope.ts";

const ABYSS = "[data-theme=abyss] &:not([data-theme=abyss] [data-theme] *)";

const PUBLISHED: Compounds = {
  recipes: {
    button: [
      { className: "button--hero", css: { fontWeight: "bold" }, size: "lg", variant: "solid" },
    ],
  },
  slotRecipes: {
    card: [
      { className: "card__root--hero", css: { root: { fontWeight: "bold" } }, size: "lg" },
      { className: "card__title--hero", css: { title: { letterSpacing: "wide" } }, size: "lg" },
    ],
  },
};

function theme(name: string, extend?: Record<string, unknown>): Switchable {
  return { name, ...(extend === undefined ? {} : { preset: { theme: { extend } } }) };
}

function derived(
  name: string,
  under: SwitchablePreset,
  extend: Record<string, unknown> = {},
): Switchable {
  return {
    name,
    preset: { name: `@stealthscale/theme-${name}`, presets: [under], theme: { extend } },
  };
}

const FATHOM: SwitchablePreset = {
  name: "@stealthscale/theme-fathom",
  theme: { extend: { recipes: { button: { base: { gap: "3" } } } } },
};

describe("scope", () => {
  it("returns no preset for a theme that extends nothing", () => {
    expect(scopedPreset(theme("abyss"))).toStrictEqual([]);
  });

  it("returns no preset for a preset that states no additions", () => {
    expect(
      scopedPreset({ name: "abyss", preset: { name: "@stealthscale/theme-abyss" } }),
    ).toStrictEqual([]);
  });

  it("returns no preset for a level that states only what is not scoped", () => {
    expect(
      scopedPreset(theme("abyss", { globalCss: { html: { bg: "red" } }, tokens: {} })),
    ).toStrictEqual([]);
  });

  it("names the preset after the theme it scopes", () => {
    const scoped = scopedPreset(theme("abyss", { recipes: { button: {} } }));

    expect(scoped).toMatchObject([{ name: "theme:abyss:switched" }]);
  });

  it("nests a variant's styles under the attribute that switches to the theme", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: { button: { variants: { variant: { solid: { letterSpacing: "0.06em" } } } } },
      }),
    );

    expect(scoped).toStrictEqual([
      {
        name: "theme:abyss:switched",
        theme: {
          extend: {
            recipes: {
              button: {
                variants: { variant: { solid: { [ABYSS]: { letterSpacing: "0.06em" } } } },
              },
            },
          },
        },
      },
    ]);
  });

  it("nests what an extension states for every instance", () => {
    const scoped = scopedPreset(theme("abyss", { recipes: { button: { base: { gap: "3" } } } }));

    expect(scoped).toMatchObject([
      { theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "3" } } } } } } },
    ]);
  });

  it("nests inside each slot of a slot recipe rather than around the slot map", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: { dialog: { base: { backdrop: { backdropFilter: "blur(6px)" } } } },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            slotRecipes: {
              dialog: { base: { backdrop: { [ABYSS]: { backdropFilter: "blur(6px)" } } } },
            },
          },
        },
      },
    ]);
  });

  it("leaves a slot value that is not a style object as it is", () => {
    const scoped = scopedPreset(
      theme("abyss", { slotRecipes: { dialog: { base: { backdrop: "unexpected" } } } }),
    );

    expect(scoped).toMatchObject([
      { theme: { extend: { slotRecipes: { dialog: { base: { backdrop: "unexpected" } } } } } },
    ]);
  });

  it("nests each slot of a slot recipe's variant", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: { dialog: { variants: { size: { lg: { content: { padding: "8" } } } } } },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            slotRecipes: {
              dialog: { variants: { size: { lg: { content: { [ABYSS]: { padding: "8" } } } } } },
            },
          },
        },
      },
    ]);
  });

  it("keeps the axes a compound variant matches on while nesting the styles it applies", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: {
          button: {
            compoundVariants: [{ css: { fontWeight: "bold" }, size: "lg", variant: "solid" }],
          },
        },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            recipes: {
              button: {
                compoundVariants: [
                  { css: { [ABYSS]: { fontWeight: "bold" } }, size: "lg", variant: "solid" },
                ],
              },
            },
          },
        },
      },
    ]);
  });

  it("leaves a compound variant that states no styles as it is", () => {
    const scoped = scopedPreset(
      theme("abyss", { recipes: { button: { compoundVariants: [{ size: "lg" }] } } }),
    );

    expect(scoped).toMatchObject([
      { theme: { extend: { recipes: { button: { compoundVariants: [{ size: "lg" }] } } } } },
    ]);
  });

  it("gives a compound the class the published recipe emits the same selection under", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: {
          button: {
            compoundVariants: [{ css: { letterSpacing: "wide" }, size: "lg", variant: "solid" }],
          },
        },
      }),
      PUBLISHED,
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            recipes: {
              button: {
                compoundVariants: [
                  {
                    className: "button--hero",
                    css: { [ABYSS]: { letterSpacing: "wide" } },
                    size: "lg",
                    variant: "solid",
                  },
                ],
              },
            },
          },
        },
      },
    ]);
  });

  it("leaves a compound no published compound matches without a class", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: { button: { compoundVariants: [{ css: { letterSpacing: "wide" }, size: "sm" }] } },
      }),
      PUBLISHED,
    );

    expect(scoped[0]?.theme.extend.recipes?.["button"]?.compoundVariants?.[0]).toStrictEqual({
      css: { [ABYSS]: { letterSpacing: "wide" } },
      size: "sm",
    });
  });

  it("splits a slot compound per slot it styles under each slot's published class", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: {
          card: {
            compoundVariants: [
              { css: { root: { gap: "4" }, title: { color: "fg" } }, size: "lg" },
              { size: "md" },
            ],
          },
        },
      }),
      PUBLISHED,
    );

    expect(scoped[0]?.theme.extend.slotRecipes?.["card"]?.compoundVariants).toStrictEqual([
      { className: "card__root--hero", css: { root: { [ABYSS]: { gap: "4" } } }, size: "lg" },
      { className: "card__title--hero", css: { title: { [ABYSS]: { color: "fg" } } }, size: "lg" },
      { size: "md" },
    ]);
  });

  it("splits a slot the published recipe styles no compound for without a class", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        slotRecipes: {
          card: {
            compoundVariants: [{ css: { footer: { gap: "2" }, root: { gap: "4" } }, size: "lg" }],
          },
        },
      }),
      PUBLISHED,
    );

    expect(scoped[0]?.theme.extend.slotRecipes?.["card"]?.compoundVariants).toStrictEqual([
      { css: { footer: { [ABYSS]: { gap: "2" } } }, size: "lg" },
      { className: "card__root--hero", css: { root: { [ABYSS]: { gap: "4" } } }, size: "lg" },
    ]);
  });

  it("reads the compounds every published preset declares by key", () => {
    const published = publishedCompounds([
      {
        theme: {
          extend: {
            recipes: { button: { compoundVariants: [{ className: "button--hero", size: "lg" }] } },
          },
        },
      },
      {
        theme: {
          extend: {
            recipes: { button: { compoundVariants: [{ className: "button--quiet", size: "sm" }] } },
            slotRecipes: {
              card: { compoundVariants: [{ className: "card__root--hero", size: "lg" }] },
            },
          },
        },
      },
      "@pandacss/preset-base",
      { theme: { extend: { recipes: { badge: {} } } } },
    ]);

    expect(published).toStrictEqual({
      recipes: {
        badge: [],
        button: [
          { className: "button--hero", size: "lg" },
          { className: "button--quiet", size: "sm" },
        ],
      },
      slotRecipes: { card: [{ className: "card__root--hero", size: "lg" }] },
    });
  });

  it("reads the compounds a preset nested under a published preset declares first", () => {
    const published = publishedCompounds([
      {
        presets: [
          {
            theme: {
              extend: {
                recipes: {
                  button: { compoundVariants: [{ className: "button--base", size: "sm" }] },
                },
              },
            },
          },
        ],
        theme: {
          extend: {
            recipes: { button: { compoundVariants: [{ className: "button--hero", size: "lg" }] } },
          },
        },
      },
    ]);

    expect(published.recipes["button"]).toStrictEqual([
      { className: "button--base", size: "sm" },
      { className: "button--hero", size: "lg" },
    ]);
  });

  it("matches a selection listing several values whatever their order", () => {
    const published: Compounds = {
      recipes: { button: [{ className: "button--wide", size: ["sm", "lg"] }] },
      slotRecipes: {},
    };
    const scoped = scopedPreset(
      theme("abyss", {
        recipes: { button: { compoundVariants: [{ css: { gap: "2" }, size: ["lg", "sm"] }] } },
      }),
      published,
    );

    expect(scoped[0]?.theme.extend.recipes?.["button"]?.compoundVariants?.[0]).toMatchObject({
      className: "button--wide",
    });
  });

  it("lists every theme compound no published compound matches", () => {
    const stated = [
      theme("abyss", {
        recipes: {
          badge: { compoundVariants: [{ css: { gap: "1" }, size: "sm" }] },
          button: {
            compoundVariants: [
              { css: { gap: "2" }, size: "lg", variant: "solid" },
              { css: { gap: "3" }, size: "sm" },
              { className: "button--own", css: { gap: "4" }, size: "xs" },
            ],
          },
        },
        slotRecipes: {
          card: {
            compoundVariants: [
              { css: { footer: { gap: "1" }, root: { gap: "2" } }, size: "lg" },
              { size: "md" },
              { className: "card__root--own", css: { root: { gap: "3" } }, size: "xs" },
            ],
          },
        },
      }),
      theme("forge"),
    ];

    expect(unmatchedCompounds(stated, PUBLISHED)).toStrictEqual([
      'abyss: badge [["size","sm"]]',
      'abyss: button [["size","sm"]]',
      'abyss: card.footer [["size","lg"]]',
    ]);
  });

  it("nests the value of a text style under the attribute", () => {
    const scoped = scopedPreset(
      theme("abyss", { textStyles: { brand: { value: { fontSize: "14px" } } } }),
    );

    expect(scoped).toStrictEqual([
      {
        name: "theme:abyss:switched",
        theme: { extend: { textStyles: { brand: { value: { [ABYSS]: { fontSize: "14px" } } } } } },
      },
    ]);
  });

  it("nests every leaf of a nested composition inside the tree it found them in", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        layerStyles: {
          fill: {
            DEFAULT: { description: "the fill", value: { bg: "red" } },
            solid: { value: { bg: "blue" } },
          },
        },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            layerStyles: {
              fill: {
                DEFAULT: { description: "the fill", value: { [ABYSS]: { bg: "red" } } },
                solid: { value: { [ABYSS]: { bg: "blue" } } },
              },
            },
          },
        },
      },
    ]);
  });

  it("nests an animation style but not a value that is no style object", () => {
    const scoped = scopedPreset(
      theme("abyss", {
        animationStyles: { fade: { value: { animationName: "fade-in" } }, odd: { value: "x" } },
      }),
    );

    expect(scoped).toMatchObject([
      {
        theme: {
          extend: {
            animationStyles: {
              fade: { value: { [ABYSS]: { animationName: "fade-in" } } },
              odd: { value: "x" },
            },
          },
        },
      },
    ]);
  });

  it("states nothing an extension did not state", () => {
    const [scoped] = scopedPreset(theme("abyss", { recipes: { button: { base: { gap: "3" } } } }));

    expect(Object.keys(scoped ?? {})).toStrictEqual(["name", "theme"]);
    expect(Object.keys(scoped?.theme.extend ?? {})).toStrictEqual(["recipes"]);
  });

  it("scopes the parent's extensions under the child's attribute ahead of the child's own", () => {
    const scoped = scopedPreset(
      derived("abyss", FATHOM, { recipes: { button: { base: { gap: "4" } } } }),
    );

    expect(scoped).toStrictEqual([
      {
        name: "theme:abyss:switched from @stealthscale/theme-fathom",
        theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "3" } } } } } },
      },
      {
        name: "theme:abyss:switched",
        theme: { extend: { recipes: { button: { base: { [ABYSS]: { gap: "4" } } } } } },
      },
    ]);
  });

  it("scopes the parent's extensions when the child states none of its own", () => {
    expect(scopedPreset(derived("abyss", FATHOM))).toMatchObject([
      { name: "theme:abyss:switched from @stealthscale/theme-fathom" },
    ]);
  });

  it("reaches every ancestor with the oldest first", () => {
    const parent: SwitchablePreset = {
      name: "@stealthscale/theme-deep",
      presets: [FATHOM],
      theme: { extend: { recipes: { button: { base: { gap: "5" } } } } },
    };

    expect(scopedPreset(derived("abyss", parent)).map((each) => each.name)).toStrictEqual([
      "theme:abyss:switched from @stealthscale/theme-fathom",
      "theme:abyss:switched from @stealthscale/theme-deep",
    ]);
  });

  it("passes over an ancestor that extends nothing", () => {
    const quiet: SwitchablePreset = { name: "@stealthscale/theme-quiet", theme: { extend: {} } };
    const scoped = scopedPreset(derived("abyss", quiet, { recipes: { button: {} } }));

    expect(scoped.map((each) => each.name)).toStrictEqual(["theme:abyss:switched"]);
  });

  it("names an ancestor that has no name", () => {
    const unnamed: SwitchablePreset = { theme: { extend: { recipes: { button: {} } } } };

    expect(scopedPreset(derived("abyss", unnamed))[0]?.name).toBe(
      "theme:abyss:switched from an unnamed preset",
    );
  });

  it("passes over a preset nested by name", () => {
    const stated: Switchable = {
      name: "abyss",
      preset: {
        presets: ["@pandacss/preset-base"],
        theme: { extend: { recipes: { button: {} } } },
      },
    };

    expect(scopedPreset(stated)).toHaveLength(1);
  });

  it("returns no preset when there is no theme", () => {
    expect(scopedPresets([])).toStrictEqual([]);
  });

  it("scopes every theme that extends anything with the first theme included", () => {
    const stated = [
      theme("fathom", { recipes: { button: {} } }),
      theme("abyss", { recipes: { button: { base: { gap: "3" } } } }),
      theme("forge"),
    ];

    expect(scopedPresets(stated).map((each) => each.name)).toStrictEqual([
      "theme:fathom:switched",
      "theme:abyss:switched",
    ]);
  });

  it("scopes what a derived theme inherits beside its own under the one attribute", () => {
    const stated = [derived("abyss", FATHOM, { recipes: { button: { base: { gap: "4" } } } })];

    expect(scopedPresets(stated).map((each) => each.name)).toStrictEqual([
      "theme:abyss:switched from @stealthscale/theme-fathom",
      "theme:abyss:switched",
    ]);
  });
});
