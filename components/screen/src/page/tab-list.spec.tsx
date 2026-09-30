import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Nav } from "#page/nav.tsx";
import { paged } from "#page/page.fixtures.tsx";
import { TabList, type TabListProps } from "#page/tab-list.tsx";
import { Tab } from "#page/tab.tsx";

/**
 * Renders a page whose navigation contains a tab list with two tabs, the first with a count.
 */
function tabbed(props: TabListProps = {}): ReactElement {
  return paged(
    <Nav aria-label="Invoices">
      <TabList aria-label="Views" {...props}>
        <Tab count={412} value="all">
          All
        </Tab>
        <Tab value="overdue">Overdue</Tab>
      </TabList>
    </Nav>,
  );
}

describe("TabList", () => {
  it("renders a tablist named by aria-label", async () => {
    await drawn(tabbed());

    expect(screen.getByRole("tablist", { name: "Views" })).toBeTruthy();
  });

  it("names the tablist Sections by default", async () => {
    await drawn(
      paged(
        <TabList>
          <Tab value="all">All</Tab>
        </TabList>,
      ),
    );

    expect(screen.getByRole("tablist", { name: "Sections" })).toBeTruthy();
  });

  it("selects the first tab by default", async () => {
    await drawn(tabbed());

    expect(screen.getByRole("tab", { name: "All 412" }).getAttribute("aria-selected")).toBe("true");
  });

  it("selects the tab defaultValue names", async () => {
    await drawn(tabbed({ defaultValue: "overdue" }));

    expect(screen.getByRole("tab", { name: "Overdue" }).getAttribute("aria-selected")).toBe("true");
  });

  it("calls onValueChange with the value of a pressed tab", async () => {
    const onValueChange = vi.fn<(value: string) => void>();

    await drawn(tabbed({ onValueChange }));
    await pressed(screen.getByRole("tab", { name: "Overdue" }));

    expect(onValueChange).toHaveBeenCalledWith("overdue");
  });

  it("keeps the value the caller controls", async () => {
    await drawn(tabbed({ value: "overdue" }));
    await pressed(screen.getByRole("tab", { name: "All 412" }));

    expect(screen.getByRole("tab", { name: "Overdue" }).getAttribute("aria-selected")).toBe("true");
  });

  it("renders the root of the tabs the navigation band shrinks to its tabs", async () => {
    const { container } = await drawn(tabbed());

    expect(container.querySelector(".tabs__root")).not.toBeNull();
  });

  it("renders no tablist on a narrow page", async () => {
    await drawn(narrowed(tabbed()));

    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("renders a picker named after the selected tab on a narrow page", async () => {
    await drawn(narrowed(tabbed()));

    expect(screen.getByRole("button", { name: "All (412)" })).toBeTruthy();
  });

  it("selects the tab a reader chooses in the picker", async () => {
    await drawn(narrowed(tabbed()));
    await pressed(screen.getByRole("button", { name: "All (412)" }));
    await pressed(screen.getByRole("option", { name: "Overdue" }));

    expect(screen.getByRole("button", { name: "Overdue" })).toBeTruthy();
  });
});
