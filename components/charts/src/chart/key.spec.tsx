import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { only, violations } from "@stealthscale/testing-react";

import { charted } from "#chart/chart.fixtures.tsx";
import { Key } from "#chart/key.tsx";

describe("Key", () => {
  it("passes the component conformance checks as a ul", () => {
    expect(
      violations(Key, {
        as: true,
        children: true,
        element: "UL",
        subject: (container) => only(only(container)),
        wrapper: (children) => charted({ children }),
      }),
    ).toStrictEqual([]);
  });

  it("renders its entries as a list", () => {
    const { getByRole } = render(
      charted({
        children: (
          <Key>
            <li>Median</li>
            <li>Outliers</li>
          </Key>
        ),
      }),
    );

    expect(getByRole("list").children).toHaveLength(2);
  });
});
