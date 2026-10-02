import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Link } from "#breadcrumb/link.ts";
import { recipe } from "#breadcrumb/recipe.ts";
import { Root } from "#breadcrumb/root.ts";

describe("Link", () => {
  it("conforms as an anchor inside the root", () => {
    expect(
      violations(Link, {
        as: true,
        children: true,
        element: "A",
        subject: (container) => slotElement(container, "breadcrumb", "link"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Link, {
        props: { children: "Invoices", href: "/invoices" },
        wrapper: trailed,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Link href="/invoices">Invoices</Link>
            </Root>,
          ).container,
        { slot: "link" },
      ),
    ).toStrictEqual([]);
  });

  it("forwards href to the anchor", () => {
    const { container } = render(trailed(<Link href="/invoices">Invoices</Link>));

    expect(slotElement(container, "breadcrumb", "link").getAttribute("href")).toBe("/invoices");
  });
});
