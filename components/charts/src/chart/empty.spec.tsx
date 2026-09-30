import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { only, violations } from "@stealthscale/testing-react";

import { charted } from "#chart/chart.fixtures.tsx";
import { Empty } from "#chart/empty.tsx";

describe("Empty", () => {
  it("passes the component conformance checks as a div", () => {
    expect(
      violations(Empty, {
        children: true,
        element: "DIV",
        subject: (container) => only(only(container)),
        wrapper: (children) => charted({ children, data: [] }),
      }),
    ).toStrictEqual([]);
  });

  it("renders its words while the chart has no rows", () => {
    const { getByText } = render(
      charted({ children: <Empty>No disputes this week.</Empty>, data: [] }),
    );

    expect(getByText("No disputes this week.").className).toContain("chart__empty");
  });

  it("renders nothing once the chart has a row", () => {
    const { queryByText } = render(charted({ children: <Empty>No disputes this week.</Empty> }));

    expect(queryByText("No disputes this week.")).toBeNull();
  });
});
