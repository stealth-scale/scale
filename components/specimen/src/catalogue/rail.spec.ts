import { act, fireEvent, type RenderResult, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, FILTER, treeOver, written } from "#catalogue/mounted.fixtures.tsx";

const GROUPED = [
  entry("actions/button", "Actions", "Button"),
  entry("data/badge", "Data", "Badge"),
];

const SECTIONED = [
  entry("components/actions/button", "", "Button"),
  entry("foundations/router/link", "", "Route link"),
];

const LOOSE = [entry("portal", "", "Portal")];

const THEMING = [written("docs.theming.overview", "Theming", "Overview")];

/**
 * Types a query into the search in the frame's sidebar, and settles the branches it opens.
 */
async function typed(result: RenderResult, query: string): Promise<void> {
  await act(() => {
    fireEvent.change(result.getByRole("searchbox", { name: FILTER }), {
      target: { value: query },
    });

    return Promise.resolve();
  });
}

/**
 * Returns the block of pages without a section.
 */
function catalogue(result: RenderResult): HTMLElement {
  return result.getByRole("navigation", { name: "Catalogue" });
}

describe("Rail", () => {
  it("names the block of pages without a section Catalogue", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getAllByRole("navigation", { name: "Catalogue" })).toHaveLength(1);
  });

  it("renders a block named by each section's title", async () => {
    const { result } = await mountRoute(treeOver(SECTIONED), "/docs/components/actions/button");

    expect(
      ["Components", "Foundations"].map(
        (name) => result.queryByRole("navigation", { name }) !== null,
      ),
    ).toStrictEqual([true, true]);
  });

  it("renders a branch for every group", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(
      within(catalogue(result))
        .getAllByRole("button")
        .map((one) => one.textContent),
    ).toStrictEqual(["Actions", "Data"]);
  });

  it("opens the branch that contains the current page", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Actions" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("closes every other branch", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Data" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("opens no branch on the index", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    expect(
      within(catalogue(result))
        .getAllByRole("button")
        .map((one) => one.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "false"]);
  });

  it("names a link by the page's title", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" })).toBeDefined();
  });

  it("links a page at the path of its identifier", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/docs/actions/button",
    );
  });

  it("sets aria-current on the link of the current page", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs/actions/button");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("aria-current")).toBe("page");
  });

  it("hides the links of a closed branch", async () => {
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

  it("names a group without a name Other", async () => {
    const { result } = await mountRoute(treeOver(LOOSE), "/docs/portal");

    expect(result.getByRole("button", { name: "Other" })).toBeDefined();
  });

  it("lists a page an application declared beside the specimen pages", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/docs/theming/overview");

    expect(result.getByRole("link", { name: "Overview" })).toBeDefined();
  });

  it("lists a page an application declared under the group it names", async () => {
    const { result } = await mountRoute(treeOver(GROUPED, THEMING), "/docs/actions/button");

    expect(result.getByRole("button", { name: "Theming" })).toBeDefined();
  });

  it("prefixes every link with the path the catalogue is mounted under", async () => {
    const { result } = await mountRoute(
      treeOver(GROUPED, [], "/reference"),
      "/reference/actions/button",
    );

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/reference/actions/button",
    );
  });

  it("lists every group when the query is blank", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "  ");

    expect(
      within(catalogue(result))
        .getAllByRole("button")
        .map((one) => one.textContent),
    ).toStrictEqual(["Actions", "Data"]);
  });

  it("shows a page whose title contains the query in another case", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "BAD");

    expect(within(catalogue(result)).getByRole("link", { name: "Badge" })).toBeDefined();
  });

  it("hides a group whose pages do not contain the query", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "BAD");

    expect(within(catalogue(result)).queryByRole("button", { name: "Actions" })).toBeNull();
  });

  it("opens every branch the query matches", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "b");

    expect(
      within(catalogue(result))
        .getAllByRole("button")
        .map((one) => one.getAttribute("aria-expanded")),
    ).toStrictEqual(["true", "true"]);
  });

  it("renders the empty message when the query matches no page", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "zzz");

    expect(result.getByText("No pages match", { selector: "p" })).toBeDefined();
  });

  it("renders no empty message while a page matches", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    await typed(result, "b");

    expect(result.queryByText("No pages match", { selector: "p" })).toBeNull();
  });

  it("moves focus from the search to the first branch on the down arrow", async () => {
    const { result } = await mountRoute(treeOver(GROUPED), "/docs");

    fireEvent.keyDown(result.getByRole("searchbox", { name: FILTER }), { key: "ArrowDown" });

    expect(document.activeElement).toBe(result.getByRole("button", { name: "Actions" }));
  });
});
