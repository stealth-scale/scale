import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#page/body.tsx";
import { Nav } from "#page/nav.tsx";
import { paged } from "#page/page.fixtures.tsx";
import { TabList } from "#page/tab-list.tsx";
import { Tab } from "#page/tab.tsx";

describe("Body", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Body>The lines</Body>));

    expect(slotElement(container, "page", "body").tagName).toBe("DIV");
  });

  it("sets no role without a tab list", () => {
    const { container } = render(paged(<Body>The lines</Body>));

    expect(slotElement(container, "page", "body").hasAttribute("role")).toBe(false);
  });

  it("renders as the panel of the selected tab", async () => {
    await drawn(
      paged(
        <>
          <Nav aria-label="Invoices">
            <TabList aria-label="Views">
              <Tab value="all">All</Tab>
              <Tab value="overdue">Overdue</Tab>
            </TabList>
          </Nav>
          <Body>The lines</Body>
        </>,
      ),
    );

    expect(screen.getByRole("tabpanel", { name: "All" }).textContent).toBe("The lines");
  });
});
