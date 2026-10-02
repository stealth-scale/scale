import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { paged } from "#page/page.fixtures.tsx";
import { TabPicker, type TabPickerProps } from "#page/tab-picker.tsx";
import { type ListedTab } from "#page/tabs-state.ts";

/**
 * Tabs the picker lists: one with a count and one without.
 */
const TABS: readonly ListedTab[] = [
  { count: 412, disabled: false, label: "All", value: "all" },
  { disabled: false, label: "Overdue", value: "overdue" },
];

/**
 * Renders the picker on a page with the tabs, `all` selected.
 */
function picker(props: Partial<TabPickerProps> = {}): ReactElement {
  return paged(
    <TabPicker
      emptyLabel="No tab matches"
      filterLabel="Filter tabs"
      label="Views"
      onPick={() => {}}
      tabs={TABS}
      value="all"
      {...props}
    />,
  );
}

describe("TabPicker", () => {
  it("names the button after the selected tab and its count", async () => {
    await drawn(picker());

    expect(screen.getByRole("button", { name: "All (412)" })).toBeTruthy();
  });

  it("names the button after the label while no tab is selected", async () => {
    await drawn(picker({ value: undefined }));

    expect(screen.getByRole("button", { name: "Views" })).toBeTruthy();
  });

  it("renders the mark at the end of the button", async () => {
    await drawn(picker({ icon: <svg aria-hidden="true" data-testid="mark" /> }));

    expect(screen.getByRole("button").lastElementChild).toBe(screen.getByTestId("mark"));
  });

  it("lists one row per tab when opened", async () => {
    await drawn(picker());
    await pressed(screen.getByRole("button", { name: "All (412)" }));

    expect(screen.getAllByRole("option").map((row) => row.textContent)).toStrictEqual([
      "All (412)",
      "Overdue",
    ]);
  });

  it("calls onPick with the value of the chosen row", async () => {
    const onPick = vi.fn<(value: string) => void>();

    await drawn(picker({ onPick }));
    await pressed(screen.getByRole("button", { name: "All (412)" }));
    await pressed(screen.getByRole("option", { name: "Overdue" }));

    expect(onPick).toHaveBeenCalledWith("overdue");
  });

  it("closes the list when a row is chosen", async () => {
    await drawn(picker());
    await pressed(screen.getByRole("button", { name: "All (412)" }));
    await pressed(screen.getByRole("option", { name: "Overdue" }));

    expect(screen.getByRole("button", { name: "All (412)" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("shows the empty words when the filter matches no tab", async () => {
    await drawn(picker());
    await pressed(screen.getByRole("button", { name: "All (412)" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Filter tabs" }), {
      target: { value: "archived" },
    });

    expect(screen.getByText("No tab matches")).toBeTruthy();
  });

  it("returns no accessibility violation when opened", async () => {
    await drawn(picker());
    await pressed(screen.getByRole("button", { name: "All (412)" }));

    const results = await axe.run(document.body, { rules: { region: { enabled: false } } });

    expect(results.violations.map((each) => each.id)).toStrictEqual([]);
  });
});
