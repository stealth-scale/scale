import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#navigation-menu/content.tsx";
import { Link } from "#navigation-menu/link.tsx";
import { composed, itemed } from "#navigation-menu/navigation-menu.fixtures.tsx";

/**
 * Returns the `aria-expanded` value of the trigger Products.
 *
 * @returns The attribute's value.
 */
function expanded(): null | string {
  return screen.getByRole("button", { name: "Products" }).getAttribute("aria-expanded");
}

describe("Link", () => {
  it("renders an a", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "link").tagName).toBe("A");
  });

  it("sets aria-current to page on the link to the page on screen", async () => {
    await drawn(composed());

    expect(screen.getByRole("link", { name: "Pricing" }).getAttribute("aria-current")).toBe("page");
  });

  it("leaves aria-current unset on a link to another page", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector('a[href="#ledger"]')?.getAttribute("aria-current")).toBe(null);
  });

  it("closes the menu on a press", async () => {
    await drawn(composed({ defaultValue: "products" }));
    fireEvent.click(screen.getByRole("link", { name: "Ledger" }));
    await settled();

    expect(expanded()).toBe("false");
  });

  it("keeps the menu open on a press with closeOnClick false", async () => {
    await drawn(
      itemed(
        <Content>
          <Link closeOnClick={false} href="#ledger">
            Ledger
          </Link>
        </Content>,
        { defaultValue: "products" },
      ),
    );
    fireEvent.click(screen.getByRole("link", { name: "Ledger" }));
    await settled();

    expect(expanded()).toBe("true");
  });

  it("calls onSelect on a press", async () => {
    const selected = vi.fn<(event: CustomEvent) => void>();

    await drawn(
      itemed(
        <Content>
          <Link href="#ledger" onSelect={selected}>
            Ledger
          </Link>
        </Content>,
        { defaultValue: "products" },
      ),
    );
    fireEvent.click(screen.getByRole("link", { name: "Ledger" }));
    await settled();

    expect(selected).toHaveBeenCalledOnce();
  });

  it("keeps the menu open when onSelect prevents the default", async () => {
    await drawn(
      itemed(
        <Content>
          <Link
            href="#ledger"
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            Ledger
          </Link>
        </Content>,
        { defaultValue: "products" },
      ),
    );
    fireEvent.click(screen.getByRole("link", { name: "Ledger" }));
    await settled();

    expect(expanded()).toBe("true");
  });

  it("keeps the menu open on a press with the meta key", async () => {
    await drawn(composed({ defaultValue: "products" }));
    fireEvent.click(screen.getByRole("link", { name: "Ledger" }), { metaKey: true });
    await settled();

    expect(expanded()).toBe("true");
  });

  it("moves focus to the next link of its panel on ArrowDown", async () => {
    await drawn(composed({ defaultValue: "products" }));
    screen.getByRole("link", { name: "Ledger" }).focus();
    fireEvent.keyDown(screen.getByRole("link", { name: "Ledger" }), { key: "ArrowDown" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Payments" }));
  });

  it("moves focus to the trigger before a link in the bar on ArrowLeft", async () => {
    await drawn(composed());
    screen.getByRole("link", { name: "Pricing" }).focus();
    fireEvent.keyDown(screen.getByRole("link", { name: "Pricing" }), { key: "ArrowLeft" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Company" }));
  });
});
