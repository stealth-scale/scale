import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, treeOver, written } from "#catalogue/mounted.fixtures.tsx";
import { declarations, indexId, routeId } from "#catalogue/routes.tsx";

const LISTED = [entry("actions/button", "Actions", "Button"), entry("portal", "", "Portal")];

const PLACED = { id: "docs.components", layout: ["docs.frame"], path: "components" };

describe("declarations", () => {
  it("names a page under the prefix with its slashes as dots", () => {
    expect(routeId("actions/button")).toBe("specimen.actions.button");
  });

  it("names a page that holds no slash under the prefix alone", () => {
    expect(routeId("portal")).toBe("specimen.portal");
  });

  it("names the index after the route the catalogue hangs under", () => {
    expect(indexId("docs.components")).toBe("docs.components.index");
  });

  it("returns the route and its index and one page per entry", () => {
    expect(declarations(LISTED, PLACED).map((one) => one.id)).toStrictEqual([
      "docs.components",
      "docs.components.index",
      "specimen.actions.button",
      "specimen.portal",
    ]);
  });

  it("serves the catalogue at the path it was placed at inside its frame", () => {
    expect(declarations(LISTED, PLACED)[0]).toMatchObject({
      layout: ["docs.frame"],
      path: "components",
    });
  });

  it("draws the catalogue bare where it was placed in no frame", () => {
    expect(
      declarations(LISTED, { id: "docs.components", path: "components" })[0],
    ).not.toHaveProperty("layout");
  });

  it("serves the index at the catalogue's own path", () => {
    expect(declarations(LISTED, PLACED)[1]).toMatchObject({ parent: "docs.components", path: "/" });
  });

  it("nests a page under the catalogue at the identifier it declares", () => {
    expect(declarations(LISTED, PLACED)[2]).toMatchObject({
      parent: "docs.components",
      path: "actions/button",
    });
  });

  it("carries the words and the group and the opening and the namespace of a page", () => {
    expect(
      declarations([entry("actions/button", "Actions", "Button", "Presses.")], PLACED)[2]
        ?.navigation,
    ).toStrictEqual({
      about: "Presses.",
      group: "Actions",
      label: "Button",
      namespace: "",
    });
  });

  it("nests a page the application wrote under the catalogue where it names no parent", () => {
    const beside = [written("docs.theming", "Theming", "Overview")];

    expect(declarations([], { ...PLACED, beside })[2]?.parent).toBe("docs.components");
  });

  it("leaves a page the application wrote under the parent it names", () => {
    const beside = [{ ...written("docs.theming", "Theming", "Overview"), parent: "docs.home" }];

    expect(declarations([], { ...PLACED, beside })[2]?.parent).toBe("docs.home");
  });

  it("returns the route and its index for an index that found no page", () => {
    expect(declarations([], PLACED)).toHaveLength(2);
  });

  it("opens the index at the catalogue's path", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Components");
  });

  it("opens a page at its path under the catalogue's", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Button");
  });

  it("draws every page inside the frame the catalogue was placed in", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("navigation")).toBeDefined();
  });

  it("leads a page back to the index", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Components" }).getAttribute("href")).toBe("/docs");
  });

  it("does not call the trail the current page on a page under the index", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(
      result.getByRole("link", { name: "Components" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("opens a page the application wrote at its path under the catalogue's", async () => {
    const beside = [written("docs.theming", "Theming", "Overview")];
    const { result } = await mountRoute(treeOver(LISTED, beside), "/docs/docs/theming");

    expect(result.getByRole("link", { name: "Overview" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("declares the framed page beside the rest where the catalogue is placed with one", () => {
    const framed = { id: "docs.framed", path: "framed" };
    const declared = declarations(LISTED, { ...PLACED, framed });

    expect(declared.at(-1)).toMatchObject(framed);
    expect(declared.at(-1)).not.toHaveProperty("parent");
    expect(declared.at(-1)).not.toHaveProperty("layout");
  });

  it("declares no framed page where the catalogue is placed without one", () => {
    expect(declarations(LISTED, PLACED).map((one) => one.id)).not.toContain("docs.framed");
  });
});
