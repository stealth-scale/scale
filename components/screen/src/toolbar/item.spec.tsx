import { type ComponentProps, type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Item } from "#toolbar/item.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

function Owned(props: ComponentProps<"button">): ReactElement {
  return <button {...props} id="owned" />;
}

describe("Item", () => {
  it("renders a button without href", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button", { name: "Filter" })).toBeTruthy();
  });

  it("sets type button", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("renders an a with href", () => {
    render(ranged(<Item href="/invoices">Invoices</Item>));

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });

  it("takes the row's roving tab stop", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("renders the as component with the tab stop", () => {
    render(ranged(<Item as={Owned}>Filter</Item>));

    expect(screen.getByRole("button", { name: "Filter" }).getAttribute("id")).toBe("owned");
    expect(screen.getByRole("button", { name: "Filter" }).tabIndex).toBe(0);
    expect(screen.getByRole("button", { name: "Filter" }).getAttribute("type")).toBeNull();
  });

  it("leaves one tab stop in a row of several controls", () => {
    render(
      ranged(
        <>
          <Item>Filter</Item>
          <Item>Download</Item>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").filter((each) => each.tabIndex === 0)).toHaveLength(1);
  });

  it("puts the tab stop on the first enabled control", () => {
    render(
      ranged(
        <>
          <Item disabled>Filter</Item>
          <Item>Download</Item>
        </>,
      ),
    );

    expect(screen.getByRole("button", { name: "Download" }).tabIndex).toBe(0);
  });
});
