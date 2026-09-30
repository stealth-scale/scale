import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Item } from "#timer/item.tsx";
import { Root } from "#timer/root.tsx";
import { composed } from "#timer/timer.fixtures.tsx";

/**
 * Returns the text of every part of the count.
 */
function figures(container: HTMLElement): ReadonlyArray<null | string> {
  return [...container.querySelectorAll("[data-part=item]")].map((item) => item.textContent);
}

describe("Item", () => {
  it("renders each part padded to two digits", async () => {
    const { container } = await drawn(composed({ countdown: true, startMs: 125_000 }));

    expect(figures(container)).toStrictEqual(["02", "05"]);
  });

  it("renders the milliseconds padded to three digits", async () => {
    const { container } = await drawn(
      <Root startMs={1005}>
        <Item type="milliseconds" />
      </Root>,
    );

    expect(figures(container)).toStrictEqual(["005"]);
  });

  it("sets data-type to the unit", async () => {
    const { container } = await drawn(composed());

    expect(
      [...container.querySelectorAll<HTMLElement>("[data-part=item]")].map(
        (item) => item.dataset["type"],
      ),
    ).toStrictEqual(["minutes", "seconds"]);
  });

  it("wraps the minutes at 60", async () => {
    const { container } = await drawn(composed({ countdown: true, startMs: 3_725_000 }));

    expect(figures(container)).toStrictEqual(["02", "05"]);
  });
});
