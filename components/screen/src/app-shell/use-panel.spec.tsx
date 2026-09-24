import { type ReactElement, useRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { type PanelOptions, usePanel } from "#app-shell/use-panel.ts";

/**
 * Describes the props of the reader: the panel options and the side.
 */
interface ReaderProps extends PanelOptions {
  /**
   * Side of the page the panel is on.
   */
  readonly side?: "end" | "start" | undefined;
}

/**
 * Renders the state `usePanel` returns in a button whose press toggles the panel.
 *
 * @param props - The panel options and the side.
 * @returns A button with the state in its text and data attributes.
 */
function Reader({ side = "start", ...options }: ReaderProps): ReactElement {
  const inner = useRef<HTMLDivElement>(null);
  const { inert, panel } = usePanel(side, options, inner);

  return (
    <button
      data-inert={inert ? "" : undefined}
      data-overlaid={panel.overlaid ? "" : undefined}
      data-stacked={panel.stacked ? "" : undefined}
      onClick={() => {
        panel.setOpen(!panel.open);
      }}
      type="button"
    >
      {panel.open ? "open" : "closed"}
    </button>
  );
}

describe("usePanel", () => {
  it("defaults to open", () => {
    render(shell(<Reader />));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("keeps the panel beside the page while the shell is wide enough", () => {
    render(shell(<Reader />));

    expect(screen.getByRole("button").dataset["overlaid"]).toBeUndefined();
  });

  it("folds the panel over the page at a phone width", () => {
    render(narrowed(shell(<Reader />)));

    expect(screen.getByRole("button").dataset["overlaid"]).toBe("");
  });

  it("drops the panel under the page when folds is under", () => {
    render(narrowed(shell(<Reader folds="under" />)));

    expect(screen.getByRole("button").dataset["stacked"]).toBe("");
  });

  it("shows a panel under the page when defaultOpen is false", () => {
    render(narrowed(shell(<Reader defaultOpen={false} folds="under" />)));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("toggles a panel beside the page", async () => {
    render(shell(<Reader />));

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("closed");
  });

  it("toggles a panel over the page", async () => {
    render(narrowed(shell(<Reader />)));

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("calls onOpenChange with the new state", async () => {
    const told: boolean[] = [];

    render(
      shell(
        <Reader
          onOpenChange={(open) => {
            told.push(open);
          }}
        />,
      ),
    );

    await pressed(screen.getByRole("button"));

    expect(told).toStrictEqual([false]);
  });

  it("marks a panel closed to nothing inert", () => {
    render(shell(<Reader defaultOpen={false} />));

    expect(screen.getByRole("button").dataset["inert"]).toBe("");
  });

  it("keeps a panel closed to a rail interactive", () => {
    render(shell(<Reader collapse="icons" defaultOpen={false} />));

    expect(screen.getByRole("button").dataset["inert"]).toBeUndefined();
  });

  it("opens when no element has focus", async () => {
    render(narrowed(shell(<Reader />)));

    Object.defineProperty(document, "activeElement", { configurable: true, value: null });
    await pressed(screen.getByRole("button"));
    Reflect.deleteProperty(document, "activeElement");

    expect(screen.getByRole("button").textContent).toBe("open");
  });

  it("folds the end side over the page at a phone width", () => {
    render(narrowed(shell(<Reader side="end" />)));

    expect(screen.getByRole("button").dataset["overlaid"]).toBe("");
  });
});
