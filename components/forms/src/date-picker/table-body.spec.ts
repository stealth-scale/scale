import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

describe("TableBody", () => {
  it("renders a tbody inside each table", async () => {
    const { container } = await drawn(inlined());

    expect(container.querySelectorAll("table > tbody.date-picker__table-body")).toHaveLength(3);
  });

  it("sets data-view to the view of its table", async () => {
    const { container } = await drawn(inlined());

    expect(
      [...container.querySelectorAll<HTMLElement>(".date-picker__table-body")].map(
        (body) => body.dataset["view"],
      ),
    ).toStrictEqual(["day", "month", "year"]);
  });
});
