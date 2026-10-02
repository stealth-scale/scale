import { describe, expect, it } from "vitest";

import actions from "@stealthscale/component-actions/theme";
import disclosure from "@stealthscale/component-disclosure/theme";
import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe as field } from "#field/recipe.ts";
import page from "#form/form.specimen.tsx";
import { BUTTON, COLUMNS, FIELD, recipe, SPAN, TABS, WIDTH } from "#form/recipe.ts";

const PARTS = ["root", "errors", "group", "section", "cell", "item", "heading", "actions"];

const CAPPED = "> :not(.field__label, .field__counter, .field__helperText, .field__errorText)";

const COLUMNED = ":not([data-columns], [data-direction=row]) > &";

const FOLLOWING = "&:not(:first-child, .form__errors:empty + *, .form__heading + *)";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["form.Form"], parts: PARTS })).toStrictEqual([]);
  });

  it("uses the class name form", () => {
    expect(recipe.className).toBe("form");
  });

  it("declares the eight slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares the size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to size md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("offers three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("names the class of the library's button recipe", () => {
    expect(BUTTON).toBe(actions.theme?.extend?.recipes?.["button"]?.className);
  });

  it("names the class of the library's tabs recipe", () => {
    expect(TABS).toBe(disclosure.theme?.extend?.slotRecipes?.["tabs"]?.className);
  });

  it("names the class of the library's field recipe", () => {
    expect(FIELD).toBe(field.className);
  });

  it("caps a short field's control at sizes.48", () => {
    expect(recipe.base?.["root"]?.[`& [${WIDTH}=short] ${CAPPED}`]).toStrictEqual({
      maxInlineSize: "48",
    });
  });

  it("caps a medium field's control at sizes.sm", () => {
    expect(recipe.base?.["root"]?.[`& [${WIDTH}=medium] ${CAPPED}`]).toStrictEqual({
      maxInlineSize: "sm",
    });
  });

  it("spaces the fields two steps of the gap scale above the size", () => {
    expect(scaleOf(recipe, "size", "root", ["sm", "md", "lg"])).toMatchObject([
      { gap: "calc({spacing.gap.lg} * var(--density, 1))" },
      { gap: "calc({spacing.gap.xl} * var(--density, 1))" },
      { gap: "calc({spacing.gap.2xl} * var(--density, 1))" },
    ]);
  });

  it("spaces a group's members as far apart as the form's fields", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["group"]).toStrictEqual({
      gap: "calc({spacing.gap.xl} * var(--density, 1))",
    });
  });

  it("opens a section that follows another member of a column with a hairline", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["section"]?.[COLUMNED]?.[FOLLOWING]).toMatchObject({
      borderBlockStartColor: "border",
      borderBlockStartStyle: "solid",
      borderBlockStartWidth: "hairline",
    });
  });

  it("puts the field gap again above the hairline of a following section", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["section"]?.[COLUMNED]?.[FOLLOWING]).toMatchObject({
      marginBlockStart: "calc({spacing.gap.xl} * var(--density, 1))",
    });
  });

  it("puts twice the field gap between a following section's hairline and its legend", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["section"]?.[COLUMNED]?.[FOLLOWING]).toMatchObject({
      paddingBlockStart: "calc({spacing.gap.3xl} * var(--density, 1))",
    });
  });

  it("puts the field gap again before the member after a section in a column", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["section"]?.[COLUMNED]?.["& + *"]).toStrictEqual({
      marginBlockStart: "calc({spacing.gap.xl} * var(--density, 1))",
    });
  });

  it("aligns a button in the form's column to its start", () => {
    expect(recipe.base?.["root"]?.[`& > .${BUTTON}`]).toStrictEqual({ alignSelf: "flex-start" });
  });

  it("clears the inline inset of a tab panel inside the form", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]?.[`& .${TABS}__content`]).toStrictEqual({
      paddingInline: "0",
    });
  });

  it("lays a group with columns out in a grid of the count it writes", () => {
    expect(recipe.base?.["group"]?.["&[data-columns]"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: `repeat(var(${COLUMNS}), minmax(0, 1fr))`,
    });
  });

  it("keeps every member of a grid at its own height", () => {
    expect(recipe.base?.["group"]?.["&[data-columns]"]).toMatchObject({ alignItems: "start" });
  });

  it("measures a grid's members at a column of at least sizes.48", () => {
    expect(recipe.base?.["group"]?.["&[data-columns][data-measuring]"]).toStrictEqual({
      gridTemplateColumns: `repeat(var(${COLUMNS}), minmax({sizes.48}, 1fr))`,
    });
  });

  it("lays a crowded grid out in one column", () => {
    expect(recipe.base?.["group"]?.["&[data-columns][data-crowded]"]).toStrictEqual({
      gridTemplateColumns: "minmax(0, 1fr)",
    });
  });

  it("wraps a group's row from a basis of sizes.48", () => {
    expect(recipe.base?.["group"]?.["&[data-direction=row]"]).toMatchObject({
      "& > *": { flexBasis: "48", flexGrow: "1" },
      flexFlow: "row wrap",
    });
  });

  it("keeps every member of a row at its own height", () => {
    expect(recipe.base?.["group"]?.["&[data-direction=row]"]).toMatchObject({
      alignItems: "flex-start",
    });
  });

  it("spans a cell over the columns it writes", () => {
    expect(recipe.base?.["cell"]).toMatchObject({ gridColumn: `span var(${SPAN})` });
  });

  it("lets a cell inside a crowded grid take one column", () => {
    expect(recipe.base?.["cell"]?.["[data-crowded] > &"]).toStrictEqual({ gridColumn: "auto" });
  });

  it("puts a hairline above every item after the first", () => {
    expect(recipe.base?.["item"]?.["& + &"]).toStrictEqual({
      borderBlockStartColor: "border",
      borderBlockStartStyle: "solid",
      borderBlockStartWidth: "hairline",
    });
  });

  it("takes the gap after an empty errors region back", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["errors"]).toStrictEqual({
      _empty: { marginBlockEnd: "calc(calc({spacing.gap.xl} * var(--density, 1)) * -1)" },
    });
  });

  it("sets a step's heading in the heading role one size smaller", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["heading"]).toStrictEqual({
      textStyle: "heading.md",
    });
  });

  it("spaces the actions by the gap at the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["actions"]).toStrictEqual({
      gap: "calc({spacing.gap.md} * var(--density, 1))",
    });
  });

  it("tracks JSX named form.Form", () => {
    expect(recipe.jsx).toStrictEqual([/^\w+\.Form$/u]);
  });

  it("emits every size through staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ size: ["sm", "md", "lg"] }]);
  });
});
