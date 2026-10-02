import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { keyed, measured, split } from "#splitter/splitter.fixtures.tsx";

describe("ResizeTrigger", () => {
  it("renders a separator named Resize by default", async () => {
    measured();
    await drawn(split());

    expect(screen.getByRole("separator", { name: "Resize" })).toBeDefined();
  });

  it("takes its name from label", async () => {
    measured();
    await drawn(split({ trigger: { label: "Resize the files" } }));

    expect(screen.getByRole("separator", { name: "Resize the files" })).toBeDefined();
  });

  it("reports a vertical line between panels in a row", async () => {
    measured();
    await drawn(split());

    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("reports a horizontal line between panels in a column", async () => {
    measured();
    await drawn(split({ options: { orientation: "vertical" } }));

    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("points aria-controls at the panel before it alone", async () => {
    measured();
    await drawn(split());

    expect(screen.getByRole("separator").getAttribute("aria-controls")).toBe(
      screen.getByText("Files").id,
    );
  });

  it("reports the share of the panel before it as its value", async () => {
    measured();
    await drawn(split());

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("30");
  });

  it("takes a tab stop", async () => {
    measured();
    await drawn(split());

    expect(screen.getByRole("separator").tabIndex).toBe(0);
  });

  it("leaves the tab order when disabled", async () => {
    measured();
    await drawn(split({ trigger: { disabled: true } }));

    expect(screen.getByRole("separator").getAttribute("tabindex")).toBeNull();
  });

  it("renders the line and the pill without children", async () => {
    measured();
    const { container } = await drawn(split());
    const trigger = screen.getByRole("separator");

    expect(trigger.contains(slotElement(container, "splitter", "resizeTriggerSeparator"))).toBe(
      true,
    );
    expect(trigger.contains(slotElement(container, "splitter", "resizeTriggerIndicator"))).toBe(
      true,
    );
  });

  it("renders its children in place of the line and the pill", async () => {
    measured();
    const { container } = await drawn(split({ children: "Grip" }));

    expect(screen.getByRole("separator").textContent).toBe("Grip");
    expect(container.querySelector(".splitter__resize-trigger-indicator")).toBeNull();
  });

  it("grows the panel before it by one percent on ArrowRight", async () => {
    measured();
    await drawn(split());
    await keyed(screen.getByRole("separator"), "ArrowRight");

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("31");
  });

  it("grows the panel before it by ten percent on Shift+ArrowRight", async () => {
    measured();
    await drawn(split());
    await keyed(screen.getByRole("separator"), "ArrowRight", true);

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("40");
  });
});
