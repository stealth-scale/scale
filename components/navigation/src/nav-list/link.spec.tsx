import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Link } from "#nav-list/link.tsx";
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

  it("renders no tooltip on a list that is not iconic", () => {
    render(
      listed(
        <Link href="/invoices" tooltip="Invoices">
          Invoices
        </Link>,
      ),
    );

    expect(screen.getByRole("link").dataset["scope"]).toBeUndefined();
  });

  it("renders no tooltip on an iconic list without tooltip", () => {
    render(listed(<Link href="/invoices">Invoices</Link>, { iconic: true }));

    expect(screen.getByRole("link").dataset["scope"]).toBeUndefined();
  });

  it("renders the link as its tooltip's trigger on an iconic list", async () => {
    await drawn(
      listed(
        <Link href="/invoices" tooltip="Invoices">
          Invoices
        </Link>,
        { iconic: true },
      ),
    );

    expect(screen.getByRole("link").dataset["scope"]).toBe("tooltip");
  });

  it("keeps the link's class and target as the tooltip's trigger", async () => {
    const { container } = await drawn(
      listed(
        <Link href="/invoices" tooltip="Invoices">
          Invoices
        </Link>,
        { iconic: true },
      ),
    );

    expect(slotElement(container, "nav-list", "link").getAttribute("href")).toBe("/invoices");
  });

  it("shows the tooltip's words when the link takes focus", async () => {
    await drawn(
      listed(
        <Link href="/invoices" tooltip="Open the invoices">
          Invoices
        </Link>,
        { iconic: true },
      ),
    );

    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.focus(screen.getByRole("link"));
    await settled();

    expect(screen.getByRole("tooltip").textContent).toBe("Open the invoices");
  });
});
