import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { type CrossingOptions, useCrossing } from "#transfer/crossing.ts";
import { type Place, PLACES } from "#transfer/transfer.fixtures.tsx";

/**
 * Describes the props of the probe: the options and the values to check on each side.
 */
interface ReaderProps extends Partial<CrossingOptions<Place>> {
  /**
   * Values to check on the first side.
   */
  readonly picking?: readonly string[] | undefined;

  /**
   * Values to check on the second side.
   */
  readonly returning?: readonly string[] | undefined;
}

/**
 * Renders both sides as text and a button per action of the hook.
 *
 * @param props - The options and the values to check.
 * @returns The two sides as text and the four buttons.
 */
function Reader({ picking, returning, ...options }: ReaderProps): ReactElement {
  const crossing = useCrossing<Place>({
    itemToString: (place) => place.label,
    itemToValue: (place) => place.value,
    rows: PLACES,
    ...options,
  });

  return (
    <>
      <span data-testid="offered">
        {crossing.offered.items.map((place) => place.value).join(",")}
      </span>
      <span data-testid="taken">{crossing.taken.items.map((place) => place.value).join(",")}</span>
      <button
        onClick={() => {
          crossing.pickOffered(picking ?? []);
        }}
        type="button"
      >
        pick
      </button>
      <button
        onClick={() => {
          crossing.pickTaken(returning ?? []);
        }}
        type="button"
      >
        pick back
      </button>
      <button onClick={crossing.take} type="button">
        take
      </button>
      <button onClick={crossing.giveBack} type="button">
        give back
      </button>
      <span data-testid="picked">{crossing.pickedOffered.join(",")}</span>
    </>
  );
}

/**
 * Presses one of the probe's buttons.
 */
async function press(name: string): Promise<void> {
  await pressed(screen.getByRole("button", { name }));
}

describe("useCrossing", () => {
  it("puts every row on the first side", () => {
    render(<Reader />);

    expect(screen.getByTestId("offered").textContent).toBe("invoices,reports,settings");
  });

  it("puts the rows of defaultValue on the second side", () => {
    render(<Reader defaultValue={["reports"]} />);

    expect(screen.getByTestId("taken").textContent).toBe("reports");
  });

  it("moves the checked rows to the second side on take", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("taken").textContent).toBe("invoices");
  });

  it("removes the moved rows from the first side", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("offered").textContent).toBe("reports,settings");
  });

  it("clears the checked rows of the side a move leaves", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("picked").textContent).toBe("");
  });

  it("moves the checked rows back on give back", async () => {
    render(<Reader defaultValue={["reports"]} returning={["reports"]} />);
    await press("pick back");
    await press("give back");

    expect(screen.getByTestId("taken").textContent).toBe("");
  });

  it("calls onValueChange with the moved values", async () => {
    const heard = vi.fn<(taken: readonly string[]) => void>();

    render(<Reader onValueChange={heard} picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(heard).toHaveBeenCalledWith(["invoices"]);
  });

  it("keeps value when the caller controls it", async () => {
    render(
      <Reader
        onValueChange={vi.fn<(taken: readonly string[]) => void>()}
        picking={["invoices"]}
        value={["settings"]}
      />,
    );
    await press("pick");
    await press("take");

    expect(screen.getByTestId("taken").textContent).toBe("settings");
  });
});
