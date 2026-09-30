import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { type PageChangeDetails } from "@zag-js/pagination";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Item } from "#pagination/item.tsx";
import { address } from "#pagination/pagination.fixtures.tsx";
import { Root, type RootProps } from "#pagination/root.tsx";

/**
 * Renders the pages 3 and 4 of nine, on page 3, with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The root with the two pages.
 */
function paged(props: RootProps = {}): ReactElement {
  return (
    <Root count={90} defaultPage={3} {...props}>
      <Item value={3} />
      <Item value={4}>four</Item>
    </Root>
  );
}

describe("Item", () => {
  it("renders a button with the page's number", async () => {
    await drawn(paged());

    expect(screen.getByRole("button", { name: "Page 3" }).textContent).toBe("3");
  });

  it("renders children in place of the number", async () => {
    await drawn(paged());

    expect(screen.getByRole("button", { name: "Page 4" }).textContent).toBe("four");
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root count={90}>
        <Item label="First results" value={1} />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "First results" })).toBeTruthy();
  });

  it("marks the current page with aria-current", async () => {
    await drawn(paged());

    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("leaves aria-current out on another page", async () => {
    await drawn(paged());

    expect(screen.getByRole("button", { name: "Page 4" }).hasAttribute("aria-current")).toBe(false);
  });

  it("moves to its page on a press", async () => {
    await drawn(paged());
    await pressed(screen.getByRole("button", { name: "Page 4" }));

    expect(screen.getByRole("button", { name: "Page 4" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("renders a link to the address getPageUrl returns when type is link", async () => {
    await drawn(paged({ getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Page 4" }).getAttribute("href")).toBe("#page-4");
  });

  it("leaves the page unchanged on a press of a link", async () => {
    const told = vi.fn<(details: PageChangeDetails) => void>();

    await drawn(paged({ getPageUrl: address, onPageChange: told, type: "link" }));
    await pressed(screen.getByRole("link", { name: "Page 4" }));

    expect(told).not.toHaveBeenCalled();
  });
});
