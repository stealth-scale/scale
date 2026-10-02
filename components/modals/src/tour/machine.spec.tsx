import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { ApiProvider, type TourOptions, useTour, useTourContext } from "#tour/machine.ts";
import { elapsed, steps } from "#tour/tour.fixtures.tsx";

/**
 * Renders the step the context reports.
 *
 * @returns A `span` with the step's id, or `shut` while the tour is closed.
 */
function Reader(): ReactElement {
  const api = useTourContext();

  return <span data-testid="state">{api.open ? api.step?.id : "shut"}</span>;
}

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns A start button, the backdrop, and the state inside the positioner and content props.
 */
function Running(props: TourOptions): ReactElement {
  const tour = useTour({ steps: steps(), ...props });

  return (
    <ApiProvider value={tour}>
      <button
        onClick={() => {
          tour.start();
        }}
        type="button"
      >
        Start
      </button>
      <div data-testid="backdrop" {...tour.getBackdropProps()} />
      <div {...tour.getPositionerProps()}>
        <div {...tour.getContentProps()}>
          <Reader />
        </div>
      </div>
    </ApiProvider>
  );
}

/**
 * Renders the machine and starts the tour.
 *
 * @param props - The machine's options.
 */
async function begun(props: TourOptions = {}): Promise<void> {
  await drawn(<Running {...props} />);
  await pressed(screen.getByRole("button", { name: "Start" }));
  await elapsed();
}

describe("useTour", () => {
  it("starts closed", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("provides a running machine to a part", async () => {
    await begun();

    expect(screen.getByTestId("state").textContent).toBe("welcome");
  });

  it("derives the ids of the parts from id", async () => {
    await begun({ id: "intro" });

    expect(screen.getByRole("alertdialog", { hidden: true }).id).toBe("tour-content-intro");
  });

  it("writes the height of the document on the backdrop's props", async () => {
    await begun();

    expect(screen.getByTestId("backdrop").style.getPropertyValue("--tour-boundary")).toMatch(
      /^\d+px$/u,
    );
  });

  it("calls onStatusChange with the status the machine reports", async () => {
    const told = vi.fn<NonNullable<TourOptions["onStatusChange"]>>();

    await begun({ onStatusChange: told });

    expect(told).toHaveBeenLastCalledWith({ status: "started", stepId: "welcome", stepIndex: 0 });
  });

  it("keeps the machine's default for an undefined option", async () => {
    await begun({ closeOnEscape: undefined });
    fireEvent.keyDown(document, { key: "Escape" });
    await elapsed();

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });
});
