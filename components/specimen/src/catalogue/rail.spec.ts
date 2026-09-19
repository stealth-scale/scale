import { act, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, treeOver, written } from "#catalogue/mounted.fixtures.tsx";

const GROUPED = [
  entry("actions/button", "Actions", "Button"),
  entry("data/badge", "Data", "Badge"),
];

const LOOSE = [entry("portal", "", "Portal")];

const THEMING = [written("docs.theming.overview", "Theming", "Overview")];

describe("Rail", () => {
  it("draws one navigation landmark for the whole catalogue", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getAllByRole("navigation")).toHaveLength(1);
  });

  it("names the landmark out of the catalogue rather than the key", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("navigation", { name: "Components" })).toBeDefined();
  });

  it("draws every group the declarations carry as a branch", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getAllByRole("button").map((one) => one.textContent)).toStrictEqual([
      "Actions",
      "Data",
    ]);
  });

  it("opens the branch holding the page being read", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Actions" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("leaves every other branch closed", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Data" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("opens no branch on the index", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    expect(
      result.getAllByRole("button").map((one) => one.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "false"]);
  });

  it("titles a link with the words the entry carried", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" })).toBeDefined();
  });

  it("addresses a page under the identifier it declares", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/docs/actions/button",
    );
  });

  it("marks the open page as the current one", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("aria-current")).toBe("page");
  });

  it("keeps a closed branch's pages out of reach", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.queryByRole("link", { name: "Badge" })).toBeNull();
  });

  it("opens the branch a navigation lands in", async () => {
    const { result, router } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    await act(async () => {
      await router.navigate({ to: "/docs/data/badge" });
    });

    expect(result.getByRole("link", { name: "Badge" })).toBeDefined();
  });

  it("words a group the declarations left unnamed", async () => {
    const { result } = await mountRoute(treeOver(LOOSE), "/docs/portal");

    expect(result.getByRole("button", { name: "Other" })).toBeDefined();
  });

  it("lists a page an application wrote beside the pages the plugin found", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/docs/theming/overview");

    expect(result.getByRole("link", { name: "Overview" })).toBeDefined();
  });

  it("heads a page an application wrote under the group it named", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Theming" })).toBeDefined();
  });

  it("prefixes every page with the path the catalogue hangs beneath", async () => {
    const { result } = await mountRoute(
      treeOver(GROUPED, [], "/reference"),
      "/reference/actions/button",
    );

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/reference/actions/button",
    );
  });

  it("lists every page when the query is blank", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, [], "/docs", "  "), "/docs");

    expect(result.getAllByRole("button").map((one) => one.textContent)).toStrictEqual([
      "Actions",
      "Data",
    ]);
  });

  it("keeps the pages whose words contain the query whatever the case", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, [], "/docs", "BAD"), "/docs");
    const rail = within(result.getByRole("navigation"));

    expect(rail.getByRole("link", { name: "Badge" })).toBeDefined();
    expect(rail.queryByRole("button", { name: "Actions" })).toBeNull();
  });

  it("opens every branch the query leaves standing", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, [], "/docs", "b"), "/docs");

    expect(
      result.getAllByRole("button").map((one) => one.getAttribute("aria-expanded")),
    ).toStrictEqual(["true", "true"]);
  });

  it("says no pages match where the query names none", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, [], "/docs", "zzz"), "/docs");

    expect(result.queryAllByRole("button")).toHaveLength(0);
    expect(result.getByText("No pages match")).toBeDefined();
  });
});
