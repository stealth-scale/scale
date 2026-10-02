import { type ReactElement } from "react";

import { fireEvent, render, renderHook } from "@testing-library/react";
import { ReactFlowProvider, type XYPosition } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { ITEM, useDrop } from "#graph/drop.ts";

type OnDropItem = (item: string, position: XYPosition) => void;

function Target({ onDropItem }: { readonly onDropItem: OnDropItem }): ReactElement {
  return <div data-testid="target" {...useDrop(onDropItem)} />;
}

function target(onDropItem: OnDropItem = vi.fn<OnDropItem>()): HTMLElement {
  const { getByTestId } = render(
    <ReactFlowProvider>
      <Target onDropItem={onDropItem} />
    </ReactFlowProvider>,
  );

  return getByTestId("target");
}

function transferOf(
  types: string[],
  item = "",
): { getData: (type: string) => string; types: string[] } {
  return { getData: (type) => (type === ITEM ? item : ""), types };
}

function droppedAt(clientX: number, clientY: number, dataTransfer: object): MouseEvent {
  const event = new MouseEvent("drop", { bubbles: true, cancelable: true, clientX, clientY });

  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });

  return event;
}

describe("drop", () => {
  it("returns no handler without onDropItem", () => {
    const { result } = renderHook(() => useDrop(), { wrapper: ReactFlowProvider });

    expect(result.current).toStrictEqual({});
  });

  it("takes a drag over whose data contains a palette item", () => {
    expect(fireEvent.dragOver(target(), { dataTransfer: transferOf([ITEM]) })).toBe(false);
  });

  it("leaves a drag over without a palette item to the browser", () => {
    expect(fireEvent.dragOver(target(), { dataTransfer: transferOf(["Files"]) })).toBe(true);
  });

  it("reports a dropped palette item with the point it was dropped at", () => {
    const onDropItem = vi.fn<OnDropItem>();

    fireEvent(target(onDropItem), droppedAt(120, 80, transferOf([ITEM], "judge")));

    expect(onDropItem.mock.lastCall).toStrictEqual(["judge", { x: 120, y: 80 }]);
  });

  it("leaves a drop without a palette item to the browser", () => {
    const onDropItem = vi.fn<OnDropItem>();
    const kept = fireEvent.drop(target(onDropItem), { dataTransfer: transferOf(["Files"]) });

    expect([kept, onDropItem.mock.calls.length]).toStrictEqual([true, 0]);
  });
});
