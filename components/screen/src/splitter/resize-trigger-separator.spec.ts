import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { measured, split } from "#splitter/splitter.fixtures.tsx";

describe("ResizeTriggerSeparator", () => {
  it("sets data-orientation to the splitter's orientation", async () => {
    measured();
    const { container } = await drawn(split({ options: { orientation: "vertical" } }));

    expect(
      slotElement(container, "splitter", "resizeTriggerSeparator").dataset["orientation"],
    ).toBe("vertical");
  });

  it("renders a div", async () => {
    measured();
    const { container } = await drawn(split());

    expect(slotElement(container, "splitter", "resizeTriggerSeparator").tagName).toBe("DIV");
  });
});
