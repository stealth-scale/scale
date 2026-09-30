import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#editable/editable.fixtures.tsx";

describe("Control", () => {
  it("renders a div that contains the three triggers", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "editable", "control").querySelectorAll("button")).toHaveLength(
      3,
    );
  });
});
