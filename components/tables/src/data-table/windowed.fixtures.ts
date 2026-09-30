import { act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { type Entry } from "#data-table/data-table.fixtures.tsx";
import { type DataTableApi } from "#data-table/use-data-table.ts";
import { regionLinesOf } from "#data-table/windowed.ts";

export function entriesOf(count: number): readonly Entry[] {
  return Array.from({ length: count }, (_, at) => ({
    account: `Entry ${String(at + 1).padStart(3, "0")}`,
    amount: at * 10,
    region: at % 2 === 0 ? "North" : "South",
  }));
}

export function untyped(table: unknown): DataTableApi {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the kit's readers read records as RowData
  return table as DataTableApi;
}

export function centerOf(table: unknown): ReturnType<typeof regionLinesOf>["center"] {
  return regionLinesOf(untyped(table)).center;
}

export function laidOut(row = 40, viewport = 400): void {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function measured(
    this: HTMLElement,
  ) {
    return this.classList.contains("table__viewport") ? viewport : row;
  });
}

export function viewportOf(container: HTMLElement): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every table renders its scroller's viewport
  return container.querySelector(".table__viewport") as HTMLElement;
}

export async function scrolledTo(viewport: HTMLElement, top: number): Promise<void> {
  await act(async () => {
    viewport.scrollTop = top;
    fireEvent.scroll(viewport);
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  });
}

export function linesIn(container: HTMLElement): HTMLTableRowElement[] {
  return [...container.querySelectorAll<HTMLTableRowElement>("tbody tr[data-index]")];
}

export function centerBodyOf(container: HTMLElement): HTMLTableSectionElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a windowed table renders its windowed rows' group
  return container.querySelector("tbody:not([data-pinned])") as HTMLTableSectionElement;
}

export function observer(): () => void {
  const observing = new Set<(entries: unknown[]) => void>();

  class Stub {
    readonly callback: (entries: unknown[]) => void;

    constructor(callback: (entries: unknown[]) => void) {
      this.callback = callback;
    }

    disconnect(): void {
      observing.delete(this.callback);
    }

    observe(): void {
      observing.add(this.callback);
    }

    unobserve(): void {
      observing.delete(this.callback);
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return () => {
    act(() => {
      for (const callback of observing) callback([]);
    });
  };
}

export function boxed(heights: Readonly<Record<string, DOMRect>>): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function boxOf(
    this: HTMLElement,
  ) {
    const found = Object.entries(heights).find(([selector]) => this.matches(selector));

    return found === undefined ? new DOMRect() : found[1];
  });
}
