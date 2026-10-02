import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { placeholderAt } from "#standalone.fixtures.ts";

describe("placeholderPageOf", () => {
  it("names the route in the page's heading", async () => {
    const { view } = await placeholderAt("/people");

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "identity/people",
    );
  });

  it("states that the route's plugin is installed from its contract alone", async () => {
    const { view } = await placeholderAt("/people");

    expect(
      within(view.container).getByText(
        "Identity is installed from its contract alone, so this page is a placeholder. Its slots render with their sample props.",
      ),
    ).toBeTruthy();
  });

  it("names each slot of the route's plugin in a heading", async () => {
    const { view } = await placeholderAt("/people");
    const headings = within(view.container).getAllByRole("heading", { level: 2 });

    expect(headings.map(({ textContent }) => textContent)).toStrictEqual([
      "identity/people-footer",
      "identity/person-card",
      "identity/person-tab",
    ]);
  });

  it("renders a slot's extensions with the slot's sample props", async () => {
    const { view } = await placeholderAt("/people");

    expect(within(view.container).getByText("card ada")).toBeTruthy();
  });

  it("renders the extensions of a slot without a sample with the slot's id alone", async () => {
    const { view } = await placeholderAt("/people");

    expect(within(view.container).getByText("footer in identity/people-footer")).toBeTruthy();
  });

  it("renders a keyed slot once per value its extensions match", async () => {
    const { view } = await placeholderAt("/people");
    const heading = within(view.container).getByRole("heading", { name: "identity/person-tab" });

    expect(heading.parentElement?.textContent).toBe("identity/person-tabtab historytab profile");
  });

  it("renders the page of a child route in the parent's outlet", async () => {
    const { view } = await placeholderAt("/people/ada");
    const headings = within(view.container).getAllByRole("heading", { level: 1 });

    expect(headings.map(({ textContent }) => textContent)).toStrictEqual([
      "identity/people",
      "identity/person",
    ]);
  });

  it("renders the slots in the page of the child route alone", async () => {
    const { view } = await placeholderAt("/people/ada");

    expect(within(view.container).getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });
});
