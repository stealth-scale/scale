import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Items } from "#rating-group/items.tsx";
import { Root } from "#rating-group/root.tsx";

describe("Items", () => {
  it("calls the render function once per value up to count", async () => {
    await drawn(
      <Root count={3}>
        <Items>{(index) => <span>{`value ${String(index)}`}</span>}</Items>
      </Root>,
    );

    expect(screen.getAllByText(/^value /u).map((each) => each.textContent)).toStrictEqual([
      "value 1",
      "value 2",
      "value 3",
    ]);
  });
});
