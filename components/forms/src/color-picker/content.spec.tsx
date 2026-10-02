import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  framed,
  keyed,
  opened,
  picker,
  slider,
  trigger,
} from "#color-picker/color-picker.fixtures.tsx";

/**
 * Makes every element measure 20px wide, so the machine counts the panel's controls as tabbable.
 */
function measured(): void {
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(20);
}

describe("Content", () => {
  it("renders a div with role dialog", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("dialog").tagName).toBe("DIV");
  });

  it("names itself by the label", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("dialog", { name: "Brand color" })).toBeDefined();
  });

  it("names itself by the trigger's aria-label without a label", async () => {
    await drawn(picker({}, { labelled: false, named: "Accent" }));
    await opened();

    expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("Accent");
  });

  it("renders no dialog role when the picker is inline", async () => {
    const { container } = await drawn(picker({ inline: true }));

    expect(slotElement(container, "color-picker", "content").hasAttribute("role")).toBe(false);
  });

  it("sets data-inline when the picker is inline", async () => {
    const { container } = await drawn(picker({ inline: true }));

    expect(slotElement(container, "color-picker", "content").dataset["inline"]).toBe("");
  });

  it("leaves an inline panel unnamed", async () => {
    const { container } = await drawn(picker({ inline: true }));

    expect(slotElement(container, "color-picker", "content").hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("moves focus to its first control as it opens", async () => {
    measured();
    await drawn(picker());
    await opened();
    await framed();

    expect(document.activeElement).toBe(slider("Saturation and brightness"));
  });

  it("moves focus to the trigger on Shift+Tab from its first control", async () => {
    measured();
    await drawn(picker());
    await opened();
    await framed();
    await keyed(slider("Saturation and brightness"), "Tab", true);

    expect(document.activeElement).toBe(trigger());
  });

  it("moves focus to the control after the trigger on Tab from its last control", async () => {
    measured();
    await drawn(
      <>
        {picker()}
        <button type="button">Next</button>
      </>,
    );
    await opened();
    await framed();

    const last = screen.getByRole("button", { name: "Red" });

    act(() => {
      last.focus();
    });
    await keyed(last, "Tab");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next" }));
  });

  it("leaves the document once Escape closes it", async () => {
    await drawn(picker());
    await opened();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });
});
