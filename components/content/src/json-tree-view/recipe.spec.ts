import { describe, expect, it } from "vitest";

import collections from "@stealthscale/component-collections/theme";
import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#json-tree-view/json-tree-view.specimen.tsx";
import { recipe, TREE_VIEW } from "#json-tree-view/recipe.ts";

const treeView = collections.theme?.extend?.slotRecipes?.["treeView"];

const BRACE = "& .tree-view__branchContent::after";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["JsonTreeView.Root", "JsonTreeView.Tree"],
        parts: ["root", "tree"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to json-tree-view", () => {
    expect(recipe.className).toBe("json-tree-view");
  });

  it("declares the size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("declares the two sizes of the code text style", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm"]);
  });

  it("defaults size to sm", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "sm" });
  });

  it("selects the tree view by its recipe's class name", () => {
    expect(TREE_VIEW).toBe(treeView?.className);
  });

  it.each([{ size: "sm" }, { size: "md" }] as const)(
    "sets the code text style of the tree at $size",
    ({ size }) => {
      expect(recipe.variants?.["size"]?.[size]?.["tree"]).toStrictEqual({
        textStyle: `code.${size}`,
      });
    },
  );

  it.each([{ size: "sm" }, { size: "md" }] as const)(
    "sizes the brace's row as the tree view sizes a row at $size",
    ({ size }) => {
      expect(recipe.variants?.["size"]?.[size]?.["root"]?.[BRACE]).toStrictEqual({
        minBlockSize: treeView?.variants?.["size"]?.[size]?.["branchControl"]?.["minBlockSize"],
      });
    },
  );

  it("insets the brace by the custom properties the tree view's root sets", () => {
    expect(Object.keys(treeView?.variants?.["size"]?.["md"]?.["root"] ?? {})).toStrictEqual(
      expect.arrayContaining(["--tree-view-gap", "--tree-view-inset", "--tree-view-mark"]),
    );
  });

  it("renders the closing brace at the start of the branch's text", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      '& .tree-view__branchControl[data-close="}"] + .tree-view__branchContent::after': {
        content: '"}" / ""',
        paddingInlineStart:
          "calc(var(--tree-view-inset) + var(--depth) * (var(--tree-view-mark) + var(--tree-view-gap)))",
      },
    });
  });

  it("renders the closing bracket of an array", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      '& .tree-view__branchControl[data-close="]"] + .tree-view__branchContent::after': {
        content: '"]" / ""',
      },
    });
  });

  it("hides an open branch's preview", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& .tree-view__branchControl[data-state=open] [data-kind=preview-text]": { display: "none" },
    });
  });

  it("hides an open branch's closing brace in its row", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& .tree-view__branchControl[data-state=open] > .tree-view__branchText > [data-kind=preview] > [data-kind=brace]:last-child":
        { display: "none" },
    });
  });

  it.each([
    { ink: "code.attr", kind: "a key", selector: "& [data-kind=key]" },
    { ink: "code.string", kind: "a string", selector: "& [data-type=regex], & [data-type=string]" },
    {
      ink: "code.number",
      kind: "a number",
      selector: "& [data-type=bigint], & [data-type=date], & [data-type=number]",
    },
    {
      ink: "code.keyword",
      kind: "a boolean",
      selector:
        "& [data-type=boolean], & [data-type=null], & [data-type=symbol], & [data-type=undefined]",
    },
    { ink: "code.function", kind: "a function", selector: "& [data-type=function]" },
    { ink: "code.type", kind: "a constructor", selector: "& [data-kind=constructor]" },
    { ink: "fg.error", kind: "an error", selector: "& [data-type=error]" },
  ])("inks $kind in $ink", ({ ink, selector }) => {
    expect(recipe.base?.["root"]).toMatchObject({ [selector]: { color: ink } });
  });

  it("inks a non-enumerable key in the comment ink", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& [data-kind=key][data-non-enumerable]": { color: "code.comment" },
    });
  });

  it("renders each line of a stack as a block in the comment ink", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& [data-type][data-kind=error-stack]": { color: "code.comment", display: "block" },
    });
  });

  it("wraps a leaf's value at any character", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& .tree-view__itemText": { overflowWrap: "anywhere", whiteSpace: "pre-wrap" },
    });
  });

  it("underlines the value of a link row in the link ink", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& a.tree-view__item [data-kind=preview]": { color: "fg.link", textDecoration: "underline" },
    });
  });

  it("sets HighlightText on a selected row's spans under forced colors", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& [role=treeitem][aria-selected=true] [data-kind], & [role=treeitem][aria-selected=true] [data-type]":
        { _highContrast: { color: "HighlightText" } },
    });
  });

  it("matches every JsonTreeView tag", () => {
    expect(recipe.jsx).toStrictEqual([/^JsonTreeView(\.\w+)?$/u]);
  });
});
