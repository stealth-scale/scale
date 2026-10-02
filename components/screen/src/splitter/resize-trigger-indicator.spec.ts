import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { measured, split } from "#splitter/splitter.fixtures.tsx";

describe("ResizeTriggerIndicator", () => {
  it("sets data-disabled on the pill of a disabled trigger", async () => {
    measured();
    const { container } = await drawn(split({ trigger: { disabled: true } }));

    expect(slotElement(container, "splitter", "resizeTriggerIndicator").dataset["disabled"]).toBe(
      "",
    );
  });

  it("sets no data-disabled on the pill of an enabled trigger", async () => {
    measured();
    const { container } = await drawn(split());

    expect(
      slotElement(container, "splitter", "resizeTriggerIndicator").dataset["disabled"],
    ).toBeUndefined();
  });

  it("sets data-orientation to the splitter's orientation", async () => {
    measured();
    const { container } = await drawn(split());

    expect(
      slotElement(container, "splitter", "resizeTriggerIndicator").dataset["orientation"],
    ).toBe("horizontal");
  });
});
