import { type ReactElement, type ReactNode } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { paged } from "#page/page.fixtures.tsx";
import { TabList } from "#page/tab-list.tsx";
import { Tab } from "#page/tab.tsx";

/**
 * Renders tabs in a tab list on a page.
 */
function listed(tabs: ReactNode): ReactElement {
  return paged(<TabList aria-label="Views">{tabs}</TabList>);
}

describe("Tab", () => {
  it("renders a tab named by its words and its count", async () => {
    await drawn(
      listed(
        <Tab count={412} value="all">
          All
        </Tab>,
      ),
    );

    expect(screen.getByRole("tab", { name: "All 412" })).toBeTruthy();
  });

  it("renders its count in a badge", async () => {
    await drawn(
      listed(
        <Tab count={412} value="all">
          All
        </Tab>,
      ),
    );

    expect(screen.getByText("412").classList).toContain("badge");
  });

  it("renders no badge without a count", async () => {
    await drawn(listed(<Tab value="all">All</Tab>));

    expect(screen.getByRole("tab").querySelector(".badge")).toBeNull();
  });

  it("disables the tab when disabled", async () => {
    await drawn(
      listed(
        <>
          <Tab value="all">All</Tab>
          <Tab disabled value="void">
            Void
          </Tab>
        </>,
      ),
    );

    expect(screen.getByRole("tab", { name: "Void" }).hasAttribute("disabled")).toBe(true);
  });

  it("renders nothing on a narrow page", async () => {
    await drawn(narrowed(listed(<Tab value="all">All</Tab>)));

    expect(screen.queryByRole("tab")).toBeNull();
  });
});
