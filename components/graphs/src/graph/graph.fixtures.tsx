import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, render } from "@testing-library/react";
import { type Edge, type Node } from "@xyflow/react";
import { vi } from "vitest";

import { LocaleContext } from "@stealthscale/provider-locale";

import * as Graph from "#graph/index.ts";

/**
 * Lists a source feeding a transform, which feeds a report.
 */
export const NODES: Node[] = [
  { data: { label: "Orders" }, id: "orders", position: { x: 0, y: 0 }, type: "input" },
  { data: { label: "Clean orders" }, id: "clean", position: { x: 0, y: 120 } },
  { data: { label: "Revenue" }, id: "revenue", position: { x: 0, y: 240 }, type: "output" },
];

/**
 * Lists the fixture's nodes with the transform selected.
 */
export const SELECTED: Node[] = [
  { data: { label: "Orders" }, id: "orders", position: { x: 0, y: 0 }, type: "input" },
  { data: { label: "Clean orders" }, id: "clean", position: { x: 0, y: 120 }, selected: true },
  { data: { label: "Revenue" }, id: "revenue", position: { x: 0, y: 240 }, type: "output" },
];

/**
 * Lists the two edges between the fixture's nodes.
 */
export const EDGES: Edge[] = [
  { id: "orders-clean", source: "orders", target: "clean" },
  { id: "clean-revenue", source: "clean", target: "revenue" },
];

/**
 * Selects the elements the canvas's size is read from: React Flow's wrapper and the renderer that
 * fills it.
 */
const CANVAS = ".react-flow, .react-flow__renderer";

/**
 * Stubs what React Flow measures and happy-dom does not lay out: a canvas 640 by 360 pixels and
 * every other element 256 by 52, with observers that report every element observed in one task in
 * one callback, as a browser reports them in one frame.
 */
export function laidOut(): void {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      readonly #pending = new Set<HTMLElement>();

      readonly #report: ResizeObserverCallback;

      constructor(report: ResizeObserverCallback) {
        this.#report = report;
      }

      disconnect(): void {
        this.#pending.clear();
      }

      observe(target: HTMLElement): void {
        if (this.#pending.size === 0) {
          queueMicrotask(() => {
            this.#flush();
          });
        }

        this.#pending.add(target);
      }

      unobserve(target: HTMLElement): void {
        this.#pending.delete(target);
      }

      #flush(): void {
        const entries = [...this.#pending].map(
          (target) =>
            ({
              contentRect: { height: target.offsetHeight, width: target.offsetWidth },
              target,
            }) as unknown as ResizeObserverEntry,
        );

        this.#pending.clear();
        this.#report(entries, this);
      }
    },
  );
  vi.stubGlobal("DOMMatrixReadOnly", function matrix(transform?: string): { m22: number } {
    return { m22: Number(/scale\(([\d.]+)\)/u.exec(transform ?? "")?.[1] ?? 1) };
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function width(
    this: HTMLElement,
  ) {
    return this.matches(CANVAS) ? 640 : 256;
  });
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function height(
    this: HTMLElement,
  ) {
    return this.matches(CANVAS) ? 360 : 52;
  });
}

/**
 * Waits 20ms, long enough for React Flow to act on an interaction.
 */
export async function elapsed(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 20);
  });
}

/**
 * Waits 20ms inside `act`, for React Flow to act on an interaction.
 */
export async function settled(): Promise<void> {
  await act(elapsed);
}

/**
 * Renders a graph around a canvas over the fixture's nodes and edges with the props a case
 * changes, and the children beside the canvas, then waits for React Flow to measure it.
 *
 * @remarks
 *   The render and the wait share one `act` scope, so the observers' reports and the fit they start
 *   commit inside it. A case that renders elements over the canvas passes them as `children` in
 *   the canvas's props.
 */
export function drawn(
  props: Partial<Graph.CanvasProps> = {},
  children?: ReactNode,
  root: Graph.RootProps = {},
): Promise<ReturnType<typeof render>> {
  laidOut();

  return act(async () => {
    const rendered = render(
      <Graph.Root {...root}>
        <Graph.Canvas edges={EDGES} label="Nightly pipeline" nodes={NODES} {...props} />
        {children}
      </Graph.Root>,
    );

    await elapsed();

    return rendered;
  });
}

/**
 * Returns the wrapper React Flow renders for the node of a name, which is its accessible name's
 * start.
 */
export function nodeOf(container: HTMLElement, name: string): HTMLElement {
  const nodes = [...container.querySelectorAll<HTMLElement>(".react-flow__node")];
  const found = nodes.find((node) => node.getAttribute("aria-label")?.split(", ")[0] === name);

  if (found === undefined) throw new Error(`No node is named ${name}.`);

  return found;
}

/**
 * Returns the accessible names of the nodes the canvas renders, in the order React Flow renders
 * them.
 */
export function namesOf(container: HTMLElement): Array<null | string> {
  return [...container.querySelectorAll(".react-flow__node")].map((node) =>
    node.getAttribute("aria-label"),
  );
}

/**
 * Presses an element as a pointer does and waits for React Flow to act on it.
 */
export async function pressed(element: HTMLElement): Promise<void> {
  await act(async () => {
    fireEvent.click(element);
    await elapsed();
  });
}

/**
 * Presses a key on an element and waits for React Flow to act on it.
 */
export async function keyed(element: HTMLElement, key: string): Promise<void> {
  await act(async () => {
    fireEvent.keyDown(element, { key });
    await elapsed();
  });
}

/**
 * Renders an element inside a graph's providers, for a part that reads them.
 */
export function inside(element: ReactElement): ReactElement {
  return <Graph.Root>{element}</Graph.Root>;
}

/**
 * Renders the children with a locale in scope, as a `LocaleProvider` does.
 */
export function scoped(locale: string, children: ReactNode): ReactElement {
  return (
    <LocaleContext
      value={{ direction: "ltr", isPending: false, locale, locales: [locale], setLocale: () => {} }}
    >
      {children}
    </LocaleContext>
  );
}
