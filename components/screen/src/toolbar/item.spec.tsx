import { type ComponentProps, type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Item } from "#toolbar/item.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

function Owned(props: ComponentProps<"button">): ReactElement {
  return <button {...props} id="owned" />;
}

describe("Item", () => {
  it("draws a button where nothing says it goes anywhere", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button", { name: "Filter" })).toBeTruthy();
  });

  it("says it submits nothing, so a control inside a form does not", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("draws a link where a caller says where it goes", () => {
    render(ranged(<Item href="/invoices">Invoices</Item>));

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });

  it("takes the row's tab stop rather than one of its own", () => {
    render(ranged(<Item>Filter</Item>));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("draws the component a caller names with the stop on what it renders", () => {
    render(ranged(<Item as={Owned}>Filter</Item>));

    expect(screen.getByRole("button", { name: "Filter" }).getAttribute("id")).toBe("owned");
    expect(screen.getByRole("button", { name: "Filter" }).tabIndex).toBe(0);
    expect(screen.getByRole("button", { name: "Filter" }).getAttribute("type")).toBeNull();
  });

  it("leaves one stop where a row holds several controls", () => {
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

  it("passes the arrows over a control that cannot be reached", () => {
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
