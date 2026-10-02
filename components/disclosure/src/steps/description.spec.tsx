import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#steps/description.ts";
import { itemed } from "#steps/steps.fixtures.tsx";

describe("Description", () => {
  it("renders a span with the description class", async () => {
    const { container } = await drawn(itemed(<Description>Name and logo</Description>));

    expect(slotElement(container, "steps", "description").tagName).toBe("SPAN");
  });
});
