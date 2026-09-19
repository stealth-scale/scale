import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Contents } from "#catalogue/page-contents.tsx";

const HEADINGS = [
  { id: "looks", title: "Looks" },
  { id: "sizes", title: "Sizes" },
];

function listed(): ReactElement {
  return (
    <Page.Root>
      <Page.Body />
      <Contents of={HEADINGS} />
    </Page.Root>
  );
}

describe("Contents", () => {
  it("draws the rail in an aside named for what it holds", async () => {
    const { getByRole } = await drawn(listed());

    expect(getByRole("complementary", { name: "On this page" })).toBeDefined();
  });

  it("leaves a narrow page and sticks beside a wide one", async () => {
    const { container } = await drawn(listed());
    const aside = slotElement(container, "page", "aside");

    expect(aside.dataset["folds"]).toBe("hide");
    expect(aside.dataset["sticky"]).toBe("");
  });

  it("lists one link per section pointing at its anchor", async () => {
    const { getAllByRole } = await drawn(listed());

    expect(getAllByRole("link").map((link) => link.getAttribute("href"))).toStrictEqual([
      "#looks",
      "#sizes",
    ]);
  });

  it("names the rail as a navigation landmark", async () => {
    const { getByRole } = await drawn(listed());

    expect(getByRole("navigation", { name: "On this page" })).toBeDefined();
  });
});
