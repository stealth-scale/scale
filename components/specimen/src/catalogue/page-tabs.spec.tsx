import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Tabs } from "@stealthscale/component-disclosure";
import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";

import { BANDS } from "#catalogue/bands.ts";
import { PageTabs } from "#catalogue/page-tabs.tsx";

/**
 * Draws the strip in the page and the tabs it needs above it.
 */
function stripped(scenes = 5): ReactElement {
  return (
    <Page.Root>
      <Tabs.Root value={BANDS.examples}>
        <PageTabs scenes={scenes} />
      </Tabs.Root>
    </Page.Root>
  );
}

describe("PageTabs", () => {
  it("names the navigation it sits in", async () => {
    const { getByRole } = await drawn(stripped());

    expect(getByRole("navigation", { name: "Bands of this page" })).toBeDefined();
  });

  it("offers a tab for each band of the page", async () => {
    const { getAllByRole } = await drawn(stripped());

    expect(getAllByRole("tab")).toHaveLength(2);
  });

  it("counts the scenes on the examples tab", async () => {
    const { getByRole } = await drawn(stripped(12));

    expect(getByRole("tab", { name: "Examples 12" })).toBeDefined();
  });

  it("counts nothing on the props tab", async () => {
    const { getByRole } = await drawn(stripped());

    expect(getByRole("tab", { name: "Props" })).toBeDefined();
  });

  it("opens on the examples", async () => {
    const { getByRole } = await drawn(stripped());

    expect(getByRole("tab", { name: "Examples 5" }).getAttribute("aria-selected")).toBe("true");
  });
});
