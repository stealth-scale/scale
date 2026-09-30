import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type RatingGroupOptions,
  splitRatingGroupProps,
  useRatingGroup,
  useRatingGroupMachine,
} from "#rating-group/machine.ts";

/**
 * Renders the value and the items through the hook a part reads.
 *
 * @returns The value and the item count as text.
 */
function Reading(): ReactElement {
  const api = useRatingGroup();

  return <span data-testid="read">{`${String(api.value)} of ${String(api.items.length)}`}</span>;
}

/**
 * Runs the machine with the options the case sets.
 *
 * @param props - The machine options.
 * @returns The label's ID and the reading.
 */
function Running(props: RatingGroupOptions): ReactElement {
  const { api, labelId } = useRatingGroupMachine(props);

  return (
    <ApiProvider value={api}>
      <span data-testid="label">{labelId}</span>
      <Reading />
    </ApiProvider>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitRatingGroupProps", () => {
    const [options] = splitRatingGroupProps({ className: "mine", count: 10 });

    expect(options).toStrictEqual({ count: 10 });
  });

  it("returns the element's props second from splitRatingGroupProps", () => {
    const [, rest] = splitRatingGroupProps({ className: "mine", count: 10 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves the translations out of both halves", () => {
    const split = splitRatingGroupProps({
      count: 10,
      translations: { ratingValueText: (index: number) => `${String(index)} hearts` },
    });

    expect(split).toStrictEqual([{ count: 10 }, {}]);
  });

  it("derives the label's ID from the id passed", async () => {
    await drawn(<Running id="stay" />);

    expect(screen.getByTestId("label").textContent).toBe("rating:stay:label");
  });

  it("keeps the label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "own-label" }} />);

    expect(screen.getByTestId("label").textContent).toBe("own-label");
  });

  it("starts unrated with one item per count", async () => {
    await drawn(<Running count={7} />);

    expect(screen.getByTestId("read").textContent).toBe("-1 of 7");
  });
});
