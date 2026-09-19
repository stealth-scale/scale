import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, treeOver } from "#catalogue/mounted.fixtures.ts";

const LISTED = [entry("actions/button", "Actions", "Button"), entry("data/badge", "Data", "Badge")];

describe("Catalogue", () => {
  it("draws the rail", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("navigation")).toBeDefined();
  });

  it("draws one rail link per page it was given", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getAllByRole("link")).toHaveLength(2);
  });

  it("addresses a page under the identifier it declares", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/docs/actions/button",
    );
  });

  it("marks the open page as the current one", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("aria-current")).toBe("page");
  });

  it("marks no other page as current", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Badge" }).getAttribute("aria-current")).toBeNull();
  });

  it("draws the page the address names", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs/data/badge");

    expect(result.getAllByText("Badge").length).toBeGreaterThan(0);
  });

  it("prefixes every page with the path the catalogue hangs beneath", async () => {
    const { result } = await mountRoute(
      treeOver(LISTED, [], "/reference"),
      "/reference/data/badge",
    );

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/reference/actions/button",
    );
  });
});
