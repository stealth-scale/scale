import { describe, expect, it } from "vitest";

import { mountRoute } from "@stealthscale/testing-router";

import { entry, treeOver, written } from "#catalogue/mounted.fixtures.tsx";

const LISTED = [
  entry("actions/button", "Actions", "Button", "Presses once."),
  entry("data/badge", "Data", "Badge"),
  entry("portal", "", "Portal"),
];

const THEMING = [written("docs.theming.overview", "Theming", "Overview")];

const FILED = [
  entry("components/actions/button", "", "Button", "Presses once."),
  entry("components/widgets/gauge", "", "Gauge"),
];

describe("Index", () => {
  it("heads the page out of the catalogue rather than the key", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Catalogue");
  });

  it("heads one section per group with the group's name", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(
      result.getAllByRole("heading", { level: 2 }).map((one) => one.textContent),
    ).toStrictEqual(["Actions", "Data", "Other"]);
  });

  it("titles one card per page with the page's words", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(
      result.getAllByRole("heading", { level: 3 }).map((one) => one.textContent),
    ).toStrictEqual(["Button", "Badge", "Portal"]);
  });

  it("leads a card to the page it names", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(result.getByRole("link", { name: "Button" }).getAttribute("href")).toBe(
      "/docs/actions/button",
    );
  });

  it("opens a card with the sentence the page declares", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");

    expect(result.getByText("Presses once.")).toBeDefined();
  });

  it("writes no opening on a card whose page declares none", async () => {
    const { result } = await mountRoute(treeOver(LISTED), "/docs");
    const cards = result.container.querySelectorAll(".card__root p");

    expect(cards).toHaveLength(1);
  });

  it("lists every page of a section on the section's index", async () => {
    const { result } = await mountRoute(treeOver(FILED), "/docs/components");

    expect(
      result.getAllByRole("heading", { level: 3 }).map((one) => one.textContent),
    ).toStrictEqual(["Button", "Gauge"]);
  });

  it("opens a group's own index with the sentence written for the group", async () => {
    const { result } = await mountRoute(treeOver(FILED), "/docs/components/actions");

    expect(result.getByText("What a reader presses, and what answers when they do.")).toBeDefined();
  });

  it("writes no opening on the index of a group nobody wrote a sentence for", async () => {
    const { result } = await mountRoute(treeOver(FILED), "/docs/components/widgets");

    expect(result.container.querySelector(".page__description")).toBeNull();
  });

  it("lists a page an application wrote beside the pages the plugin found", async () => {
    const { result } = await mountRoute(treeOver(LISTED, THEMING), "/docs");

    expect(result.getByRole("link", { name: "Overview" })).toBeDefined();
  });
});
