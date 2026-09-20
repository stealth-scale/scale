import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { type CrossingOptions, useCrossing } from "#transfer/crossing.ts";
import { type Place, PLACES } from "#transfer/transfer.fixtures.tsx";

/**
 * Describes what the reader is told to pick before it moves anything.
 */
interface ReaderProps extends Partial<CrossingOptions<Place>> {
  /**
   * The rows to count as picked on the near side before taking them across.
   */
  readonly picking?: readonly string[] | undefined;

  /**
   * The rows to count as picked on the far side before sending them back.
   */
  readonly returning?: readonly string[] | undefined;
}

/**
 * Splits the rows, reports both sides off the screen, and offers the two moves.
 *
 * @param props - Whatever the case drives the split with, and what it picks first.
 * @returns The two sides as text, beside the two controls.
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
 * Presses one of the reader's controls.
 */
async function press(name: string): Promise<void> {
  await pressed(screen.getByRole("button", { name }));
}

describe("useCrossing", () => {
  it("offers every row until one crosses over", () => {
    render(<Reader />);

    expect(screen.getByTestId("offered").textContent).toBe("invoices,reports,settings");
  });

  it("holds back the rows a caller says have already crossed", () => {
    render(<Reader defaultValue={["reports"]} />);

    expect(screen.getByTestId("taken").textContent).toBe("reports");
  });

  it("takes the offered rows a reader has picked across", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("taken").textContent).toBe("invoices");
  });

  it("drops the rows it took off the side they came from", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("offered").textContent).toBe("reports,settings");
  });

  it("clears what was picked on the side a row left", async () => {
    render(<Reader picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(screen.getByTestId("picked").textContent).toBe("");
  });

  it("sends the taken rows a reader has picked back", async () => {
    render(<Reader defaultValue={["reports"]} returning={["reports"]} />);
    await press("pick back");
    await press("give back");

    expect(screen.getByTestId("taken").textContent).toBe("");
  });

  it("reports the set that has crossed over", async () => {
    const heard = vi.fn<(taken: readonly string[]) => void>();

    render(<Reader onValueChange={heard} picking={["invoices"]} />);
    await press("pick");
    await press("take");

    expect(heard).toHaveBeenCalledWith(["invoices"]);
  });

  it("holds none of the set itself where a caller drives it", async () => {
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
