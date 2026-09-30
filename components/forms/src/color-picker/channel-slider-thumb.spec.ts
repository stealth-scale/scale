import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { keyed, opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("ChannelSliderThumb", () => {
  it("renders a slider named after its channel", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Hue").tagName).toBe("DIV");
  });

  it("fills itself with the channel's color through --color-picker-thumb", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Hue").style.getPropertyValue("--color-picker-thumb")).toMatch(
      /^hsla\(221\.21\d*, 100%, 50%, 1\)$/u,
    );
  });

  it("reads the channel's value in its value text", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Hue").getAttribute("aria-valuetext")).toBe("221°");
  });

  it.each([
    { key: "ArrowRight", shiftKey: false, want: "222" },
    { key: "ArrowUp", shiftKey: false, want: "222" },
    { key: "ArrowLeft", shiftKey: false, want: "220" },
    { key: "ArrowDown", shiftKey: false, want: "220" },
    { key: "ArrowRight", shiftKey: true, want: "231" },
    { key: "PageUp", shiftKey: false, want: "231" },
    { key: "PageDown", shiftKey: false, want: "211" },
    { key: "Home", shiftKey: false, want: "0" },
    { key: "End", shiftKey: false, want: "360" },
  ])("sets the hue to $want on $key with Shift $shiftKey", async ({ key, shiftKey, want }) => {
    await drawn(picker());
    await opened();
    await keyed(slider("Hue"), key, shiftKey);

    expect(slider("Hue").getAttribute("aria-valuenow")).toBe(want);
  });

  it("steps the hue down on ArrowRight in a right-to-left picker", async () => {
    await drawn(picker({ dir: "rtl" }));
    await opened();
    await keyed(slider("Hue"), "ArrowRight");

    expect(slider("Hue").getAttribute("aria-valuenow")).toBe("220");
  });

  it("keeps the hue it steps a grey to", async () => {
    await drawn(picker({ defaultValue: "#808080" }));
    await opened();
    await keyed(slider("Hue"), "ArrowRight");

    expect(slider("Hue").getAttribute("aria-valuenow")).toBe("1");
  });

  it("steps the alpha by a hundredth", async () => {
    await drawn(picker());
    await opened();
    await keyed(slider("Alpha"), "ArrowLeft");

    expect(slider("Alpha").getAttribute("aria-valuetext")).toBe("99%");
  });

  it("leaves a key it does not handle to the browser", async () => {
    await drawn(picker());
    await opened();

    expect(fireEvent.keyDown(slider("Hue"), { key: "a" })).toBe(true);
  });

  it("keeps the channel of a read-only picker", async () => {
    await drawn(picker({ defaultOpen: true, readOnly: true }));
    await keyed(slider("Hue"), "ArrowRight");

    expect(slider("Hue").getAttribute("aria-valuenow")).toBe("221.21");
  });
});
