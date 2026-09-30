import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Link } from "#toolbar/link.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

/**
 * Renders an empty `svg` in place of an icon.
 */
const ICON = <svg aria-hidden="true" />;

describe("Link", () => {
  it("renders an a with its target", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link", { name: "Drafts" }).getAttribute("href")).toBe("#drafts");
  });

  it("applies the recipe's action class", () => {
    const { container } = render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(slotElement(container, "toolbar", "action").tagName).toBe("A");
  });

  it("renders the ghost button's look", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link").classList).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("sets no type attribute", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link").hasAttribute("type")).toBe(false);
  });

  it("takes the row's roving tab stop", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link").getAttribute("tabindex")).toBe("0");
  });

  it("sets aria-current to page on the current page", () => {
    render(
      ranged(
        <Link current href="#drafts">
          Drafts
        </Link>,
      ),
    );

    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");
  });

  it("sets no aria-current on another page", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link").hasAttribute("aria-current")).toBe(false);
  });

  it("sets data-priority to tertiary for a link without an icon", () => {
    render(ranged(<Link href="#drafts">Drafts</Link>));

    expect(screen.getByRole("link").dataset["priority"]).toBe("tertiary");
  });

  it("sets data-priority to secondary for a link with an icon", () => {
    render(
      ranged(
        <Link href="#drafts" icon={ICON}>
          Drafts
        </Link>,
      ),
    );

    expect(screen.getByRole("link").dataset["priority"]).toBe("secondary");
  });

  it("writes data-narrow on a narrow row", () => {
    render(
      narrowed(
        ranged(
          <Link href="#drafts" icon={ICON}>
            Drafts
          </Link>,
        ),
      ),
    );

    expect(screen.getByRole("link").dataset["narrow"]).toBe("");
  });

  it("omits data-narrow on a wide row", () => {
    render(
      ranged(
        <Link href="#drafts" icon={ICON}>
          Drafts
        </Link>,
      ),
    );

    expect(screen.getByRole("link").dataset["narrow"]).toBeUndefined();
  });

  it("renders nothing for a tertiary link on a narrow row", () => {
    render(narrowed(ranged(<Link href="#drafts">Drafts</Link>)));

    expect(screen.queryByRole("link", { name: "Drafts" })).toBeNull();
  });

  it("renders a folded link as a link in the row's menu", async () => {
    await drawn(
      narrowed(
        ranged(
          <Link current href="#drafts">
            Drafts
          </Link>,
        ),
      ),
    );
    await pressed(screen.getByRole("button", { name: "More actions" }));

    expect(screen.getByRole("menuitem", { name: "Drafts" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });
});
