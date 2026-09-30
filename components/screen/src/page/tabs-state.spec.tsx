import { type ReactElement, useLayoutEffect } from "react";

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Listing, PanelContext, tabIdOf, useListed, usePanelled } from "#page/tabs-state.ts";

/**
 * Describes the props of the list probe.
 */
interface ListedProps {
  /**
   * Called after every commit of the probe.
   */
  readonly onCommit: () => void;

  /**
   * Receives the listing functions on every render.
   */
  readonly onListing: (listing: Listing) => void;
}

/**
 * Renders the listed tabs as `value:count` words and hands the listing functions to the case.
 */
function Listed({ onCommit, onListing }: ListedProps): ReactElement {
  const [tabs, listing] = useListed();

  onListing(listing);

  useLayoutEffect(() => {
    onCommit();
  });

  return <output>{tabs.map((tab) => `${tab.value}:${String(tab.count ?? "")}`).join(" ")}</output>;
}

/**
 * Renders the list probe and returns its listing functions and a count of its commits.
 */
function listed(): { readonly commits: () => number; readonly listing: Listing } {
  let held: Listing | undefined;
  let commits = 0;

  render(
    <Listed
      onCommit={() => {
        commits += 1;
      }}
      onListing={(listing) => {
        held = listing;
      }}
    />,
  );

  if (held === undefined) throw new Error("no listing rendered");

  return { commits: () => commits, listing: held };
}

/**
 * Describes the props of the panel probe.
 */
interface PanelledProps {
  /**
   * Value of the selected tab.
   */
  readonly selected?: string | undefined;
}

/**
 * Sets the panel of a list whose panel id is `lines`.
 */
function Panelled({ selected }: PanelledProps): null {
  usePanelled("lines", selected);

  return null;
}

describe("tabs-state", () => {
  it("lists tabs in the order they are put", () => {
    const { listing } = listed();

    act(() => {
      listing.put({ disabled: false, label: "All", value: "all" });
      listing.put({ disabled: false, label: "Overdue", value: "overdue" });
    });

    expect(screen.getByRole("status").textContent).toBe("all: overdue:");
  });

  it("replaces a tab in place when it is put again", () => {
    const { listing } = listed();

    act(() => {
      listing.put({ disabled: false, label: "All", value: "all" });
      listing.put({ disabled: false, label: "Overdue", value: "overdue" });
      listing.put({ count: 4, disabled: false, label: "All", value: "all" });
    });

    expect(screen.getByRole("status").textContent).toBe("all:4 overdue:");
  });

  it("removes the tab of a value", () => {
    const { listing } = listed();

    act(() => {
      listing.put({ disabled: false, label: "All", value: "all" });
      listing.put({ disabled: false, label: "Overdue", value: "overdue" });
      listing.remove("all");
    });

    expect(screen.getByRole("status").textContent).toBe("overdue:");
  });

  it("commits no update when a tab is put unchanged", () => {
    const { commits, listing } = listed();

    act(() => {
      listing.put({ disabled: false, label: "All", value: "all" });
    });

    const before = commits();

    act(() => {
      listing.put({ disabled: false, label: "All", value: "all" });
    });

    expect(commits()).toBe(before);
  });

  it("derives a tab's id from the panel id and the value", () => {
    expect(tabIdOf("lines", "all")).toBe("lines-all");
  });

  it("sets the panel named by the selected tab", () => {
    const setPanel = vi.fn<(panel: unknown) => void>();

    render(
      <PanelContext value={{ panel: undefined, setPanel }}>
        <Panelled selected="all" />
      </PanelContext>,
    );

    expect(setPanel).toHaveBeenLastCalledWith({ id: "lines", labelledBy: "lines-all" });
  });

  it("clears the panel while no tab is selected", () => {
    const setPanel = vi.fn<(panel: unknown) => void>();

    render(
      <PanelContext value={{ panel: undefined, setPanel }}>
        <Panelled />
      </PanelContext>,
    );

    expect(setPanel.mock.lastCall?.[0]).toBeUndefined();
  });

  it("sets no panel outside a page", () => {
    expect(() => render(<Panelled selected="all" />)).not.toThrow();
  });
});
