import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

describe("ViewControl", () => {
  it("renders a div in each view", async () => {
    const { container } = await drawn(inlined());

    expect(
      container.querySelectorAll("div.date-picker__view > div.date-picker__view-control"),
    ).toHaveLength(3);
  });

  it("sets data-view to the view it is in", async () => {
    const { container } = await drawn(inlined());

    expect(
      [...container.querySelectorAll<HTMLElement>(".date-picker__view-control")].map(
        (control) => control.dataset["view"],
      ),
    ).toStrictEqual(["day", "month", "year"]);
  });
});
