import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#floating-panel/floating-panel.fixtures.tsx";
import { ResizeTrigger } from "#floating-panel/index.ts";

describe("ResizeTrigger", () => {
  it("renders a div with the resize trigger class", async () => {
    const { container } = await drawn(opened(<ResizeTrigger axis="se" />));

    expect(slotElement(container, "floating-panel", "resizeTrigger").tagName).toBe("DIV");
  });

  it("writes its axis as data-axis", async () => {
    const { container } = await drawn(opened(<ResizeTrigger axis="se" />));

    expect(slotElement(container, "floating-panel", "resizeTrigger").dataset["axis"]).toBe("se");
  });

  it("keeps the machine's placement inside the panel's edge", async () => {
    const { container } = await drawn(opened(<ResizeTrigger axis="se" />));
    const { style } = slotElement(container, "floating-panel", "resizeTrigger");

    expect([style.position, style.right, style.bottom]).toStrictEqual(["absolute", "0px", "0px"]);
  });

  it("sets data-disabled when resizable is false", async () => {
    const { container } = await drawn(opened(<ResizeTrigger axis="se" />, { resizable: false }));

    expect(slotElement(container, "floating-panel", "resizeTrigger").dataset["disabled"]).toBe("");
  });
});
