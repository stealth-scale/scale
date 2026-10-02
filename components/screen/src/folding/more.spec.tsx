import { act, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { type Entry } from "#folding/fold.ts";
import { More } from "#folding/more.tsx";
import { Trigger } from "#folding/trigger.tsx";

/**
 * Turns off axe's page rule for content outside a landmark, because the audit reads one menu and
 * its trigger rather than a page.
 */
const RULES = { region: { enabled: false } };

/**
 * Renders the menu with a trigger named `More actions` over the given entries.
 */
function menu(entries: readonly Entry[]): React.ReactElement {
  return (
    <More
      entries={entries}
      trigger={<Trigger label="More actions" size="md" variant="outline" />}
    />
  );
}

/**
 * Renders the menu over the entries and opens it with a press on its trigger.
 */
async function opened(entries: readonly Entry[]): Promise<() => void> {
  const { unmount } = await drawn(menu(entries));

  await pressed(screen.getByRole("button", { name: "More actions" }));

  return () => {
    act(() => {
      unmount();
    });
  };
}

describe("More", () => {
  it("renders the trigger", async () => {
    await drawn(menu([{ action: { label: "Archive" }, id: "archive" }]));

    expect(screen.getByRole("button", { name: "More actions" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("renders one menu row per entry in order", async () => {
    await opened([
      { action: { label: "Archive" }, id: "archive" },
      { action: { label: "Duplicate" }, id: "duplicate" },
    ]);

    expect(screen.getAllByRole("menuitem").map((row) => row.textContent)).toStrictEqual([
      "Archive",
      "Duplicate",
    ]);
  });

  it("renders the panel into the document body", async () => {
    const { container } = await drawn(menu([{ action: { label: "Archive" }, id: "archive" }]));

    await pressed(screen.getByRole("button", { name: "More actions" }));

    expect(container.contains(screen.getByRole("menu"))).toBe(false);
  });

  it("calls the action's onClick when its row is chosen", async () => {
    const onClick = vi.fn<() => void>();

    await opened([{ action: { label: "Archive", onClick }, id: "archive" }]);
    await pressed(screen.getByRole("menuitem", { name: "Archive" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a folded link's row as an a with its target", async () => {
    await opened([{ action: { href: "/reports", label: "Reports" }, id: "reports" }]);

    expect(screen.getByRole("menuitem", { name: "Reports" }).getAttribute("href")).toBe("/reports");
  });

  it("marks the current page's row with aria-current", async () => {
    await opened([
      { action: { current: true, href: "/reports", label: "Reports" }, id: "reports" },
    ]);

    expect(screen.getByRole("menuitem", { name: "Reports" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("drops the target of a disabled link's row", async () => {
    await opened([
      { action: { disabled: true, href: "/reports", label: "Reports" }, id: "reports" },
    ]);

    expect(screen.getByRole("menuitem", { name: "Reports" }).hasAttribute("href")).toBe(false);
  });

  it("renders a row that is not a link as a div", async () => {
    await opened([{ action: { label: "Archive" }, id: "archive" }]);

    expect(screen.getByRole("menuitem", { name: "Archive" }).tagName).toBe("DIV");
  });

  it("returns no accessibility violation in the document while open", async () => {
    const unmount = await opened([
      { action: { label: "Archive" }, id: "archive" },
      { action: { href: "/reports", label: "Reports" }, id: "reports" },
    ]);
    const { violations } = await axe.run(document.body, {
      resultTypes: ["violations"],
      rules: RULES,
    });

    unmount();

    expect(violations.map((each) => `${each.id}: ${each.help}`)).toStrictEqual([]);
  });
});
