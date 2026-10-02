import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Breadcrumbs, type Crumb } from "#page/breadcrumbs.tsx";
import { paged } from "#page/page.fixtures.tsx";

/**
 * Pages above the page under test, the nearest last.
 */
const ITEMS: readonly Crumb[] = [
  { href: "#ledger", label: "Ledger" },
  { href: "#collections", label: "Collections" },
];

describe("Breadcrumbs", () => {
  it("renders a navigation named by label on a wide page", () => {
    render(paged(<Breadcrumbs items={ITEMS} label="Trail" />));

    expect(screen.getByRole("navigation", { name: "Trail" })).toBeTruthy();
  });

  it("names the navigation Breadcrumb by default", () => {
    render(paged(<Breadcrumbs items={ITEMS} />));

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
  });

  it("renders one link per item on a wide page", () => {
    render(paged(<Breadcrumbs items={ITEMS} />));

    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toStrictEqual([
      "#ledger",
      "#collections",
    ]);
  });

  it("renders the separator between two items", () => {
    render(paged(<Breadcrumbs items={ITEMS} separator="›" />));

    expect(screen.getAllByText("›")).toHaveLength(1);
  });

  it("renders one link back to the nearest item on a narrow page", () => {
    render(narrowed(paged(<Breadcrumbs items={ITEMS} />)));

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toStrictEqual([
      "Collections",
    ]);
  });

  it("renders no navigation on a narrow page", () => {
    render(narrowed(paged(<Breadcrumbs items={ITEMS} />)));

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("renders the back mark before the words of the link back", () => {
    render(
      narrowed(
        paged(
          <Breadcrumbs backIcon={<svg aria-hidden="true" data-testid="back" />} items={ITEMS} />,
        ),
      ),
    );

    expect(screen.getByRole("link").firstElementChild).toBe(screen.getByTestId("back"));
  });

  it("calls the item's onClick when its link is pressed", () => {
    const onClick = vi.fn<() => void>();

    render(paged(<Breadcrumbs items={[{ href: "#ledger", label: "Ledger", onClick }]} />));
    screen.getByRole("link", { name: "Ledger" }).click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders nothing without an item", () => {
    render(paged(<Breadcrumbs items={[]} />));

    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
