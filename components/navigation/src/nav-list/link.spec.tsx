import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Link } from "#nav-list/link.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Link", () => {
  it("renders an A element inside a list", () => {
    const { container } = render(listed(<Link href="/">Overview</Link>));

    expect(slotElement(container, "nav-list", "link").tagName).toBe("A");
  });

  it("sets href to the value the caller passes", () => {
    render(listed(<Link href="/invoices">Invoices</Link>));

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });

  it("passes aria-current through to the anchor", () => {
    render(
      listed(
        <Link aria-current="page" href="/">
          Overview
        </Link>,
      ),
    );

    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");
  });

  it("renders a BUTTON element when as is set to button", () => {
    const { container } = render(listed(<Link as="button">Sign out</Link>));

    expect(slotElement(container, "nav-list", "link").tagName).toBe("BUTTON");
  });
});
