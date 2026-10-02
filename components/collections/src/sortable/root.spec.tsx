import { type ReactNode } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as Sortable from "#sortable/index.ts";
import { type SortableItem } from "#sortable/moves.ts";
import { boarded, listed, STAGES } from "#sortable/sortable.fixtures.tsx";

function framed(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

describe("Root", () => {
  it("announces a pick-up in dnd-kit's live region when Space lifts a row", async () => {
    Object.defineProperty(document, "getAnimations", {
      configurable: true,
      value: (): Animation[] => [],
    });

    const { getByRole } = render(listed());
    const handle = getByRole("button", { name: "Move Review" });

    await framed();
    fireEvent.keyDown(handle, { code: "Space", key: " " });
    await framed();
    await framed();
    await framed();

    const announced = document.querySelector('[id^="dnd-kit-announcement"]')?.textContent;

    fireEvent.keyDown(handle, { code: "Escape", key: "Escape" });
    await framed();

    expect(announced).toBe("Picked up Review at position 2 of 3.");
  });

  it("returns no accessibility violation for one list", async () => {
    await expect(accessibilityViolations(() => listed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a board", async () => {
    await expect(accessibilityViolations(() => boarded())).resolves.toStrictEqual([]);
  });

  it("renders a div with the recipe's root class", () => {
    const { container } = render(listed());

    expect(slotElement(container, "sortable", "root").tagName).toBe("DIV");
  });

  it("renders the English instructions in a hidden element", () => {
    const { container } = render(listed());

    expect(container.querySelector("span[hidden]")?.textContent).toBe(
      "Press Space or Enter to pick the item up, the arrow keys to move it, Space or Enter to drop it and Escape to put it back.",
    );
  });

  it("renders the caller's instructions in the hidden element", () => {
    const { container } = render(listed({ instructions: "Drag a stage." }));

    expect(container.querySelector("span[hidden]")?.textContent).toBe("Drag a stage.");
  });

  it("renders what a render function among its children returns", () => {
    const { getByText } = render(
      <Sortable.Root items={STAGES}>{() => <p>Stages</p>}</Sortable.Root>,
    );

    expect(getByText("Stages").tagName).toBe("P");
  });

  it("passes the root's move to a render function", () => {
    const onItemsChange = vi.fn<(items: SortableItem[]) => void>();
    const children = vi.fn<(api: Sortable.SortableApi) => ReactNode>(() => null);

    render(
      <Sortable.Root items={STAGES} onItemsChange={onItemsChange}>
        {children}
      </Sortable.Root>,
    );
    children.mock.lastCall?.[0].move("draft", { index: 2 });

    expect(onItemsChange.mock.lastCall).toStrictEqual([
      [{ id: "review" }, { id: "publish" }, { id: "draft" }],
    ]);
  });

  it("passes the props of a div to the root", () => {
    const { container } = render(listed({ title: "Stages" }));

    expect(slotElement(container, "sortable", "root").title).toBe("Stages");
  });
});
