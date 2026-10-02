import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#message/message.specimen.tsx";
import { recipe } from "#message/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Message.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to message", () => {
    expect(recipe.className).toBe("message");
  });

  it("declares the eight slots of a turn", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "avatar",
      "content",
      "header",
      "bubble",
      "footer",
      "status",
      "actions",
    ]);
  });

  it("declares align look palette reveal and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "look", "palette", "reveal", "size"]);
  });

  it("defaults to a neutral subtle turn at the start at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "start",
      look: "subtle",
      palette: "neutral",
      reveal: "hover",
      size: "md",
    });
  });

  it("declares sm to lg on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("lists start before end on the align axis", () => {
    expect(Object.keys(recipe.variants?.["align"] ?? {})).toStrictEqual(["start", "end"]);
  });

  it("reverses the row and aligns the column to the end under align end", () => {
    expect(recipe.variants?.["align"]?.["end"]).toStrictEqual({
      content: { alignItems: "flex-end" },
      root: { flexDirection: "row-reverse" },
    });
  });

  it("caps a bubble at 80% of the column", () => {
    expect(recipe.base?.["bubble"]).toMatchObject({ maxInlineSize: "80%", minInlineSize: "0" });
  });

  it("paints a bubble with data-failed in the error palette", () => {
    expect(recipe.base?.["bubble"]).toMatchObject({ "&[data-failed]": { colorPalette: "error" } });
  });

  it("outlines a bubble in CanvasText under forced colors", () => {
    expect(recipe.base?.["bubble"]).toMatchObject({
      _highContrast: {
        outlineColor: "CanvasText",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
    });
  });

  it("gives the plain look's bubble the whole column without padding or outline", () => {
    const [document] = recipe.compoundVariants ?? [];

    expect([document?.className, document?.css]).toStrictEqual([
      "message__bubble--document",
      {
        bubble: {
          _highContrast: { outlineStyle: "none" },
          maxInlineSize: "full",
          paddingBlock: "0",
          paddingInline: "0",
        },
      },
    ]);
  });

  it("inks a read status in the primary palette", () => {
    expect(recipe.base?.["status"]).toMatchObject({
      "&[data-status=read]": { color: "colorPalette.fg", colorPalette: "primary" },
    });
  });

  it("inks a failed status in the error ink", () => {
    expect(recipe.base?.["status"]).toMatchObject({
      "&[data-status=failed]": { color: "fg.error" },
    });
  });

  it("makes the actions transparent under reveal hover", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["actions"]).toMatchObject({ opacity: "0" });
  });

  it("shows the actions under a coarse pointer under reveal hover", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["actions"]).toMatchObject({
      _touch: { opacity: "1" },
    });
  });

  it("shows the actions while a pointer is over the turn or focus is inside it", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["root"]).toStrictEqual({
      "&:focus-within .message__actions, &:hover .message__actions": { opacity: "1" },
    });
  });

  it("shows the actions at rest under reveal always", () => {
    expect(recipe.variants?.["reveal"]?.["always"]).toStrictEqual({ actions: { opacity: "1" } });
  });

  it("pads a bubble at the middle size from the gap and inset scales", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["bubble"]).toStrictEqual({
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "body.md",
    });
  });

  it("matches the Message parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Message\.\w+$/u]);
  });
});
