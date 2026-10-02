import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { elapsed, framed, started, stepped, toured } from "#tour/tour.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "content").tagName).toBe("DIV");
  });

  it("sets role dialog", async () => {
    await started();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("takes its name from the title", async () => {
    await started();

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Welcome" }).id,
    );
  });

  it("sets aria-describedby to the description's id", async () => {
    const { container } = await started();

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "tour", "description").id,
    );
  });

  it("sets aria-modal on a dialog step", async () => {
    await started();

    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  });

  it("drops aria-modal on a tooltip step", async () => {
    await started();
    await stepped("Start");

    expect(screen.getByRole("dialog").hasAttribute("aria-modal")).toBe(false);
  });

  it("sets aria-live to polite", async () => {
    await started();

    expect(screen.getByRole("dialog").getAttribute("aria-live")).toBe("polite");
  });

  it("moves to the next step on ArrowRight", async () => {
    await started();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
    await elapsed();

    expect(screen.getByRole("dialog", { name: "Search" })).toBeDefined();
  });

  it("moves to the previous step on ArrowLeft", async () => {
    await started();
    await stepped("Start");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
    await elapsed();

    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeDefined();
  });

  it("keeps the step on ArrowRight with keyboardNavigation false", async () => {
    await started({ options: { keyboardNavigation: false } });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
    await elapsed();

    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeDefined();
  });

  it("renders nothing before the tour first opens", async () => {
    await drawn(toured());

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("renders nothing once the tour ends", async () => {
    await started();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await elapsed();
    await framed();

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("keeps the hidden card once the tour ends with unmountOnExit false", async () => {
    await started({ root: { unmountOnExit: false } });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await elapsed();
    await framed();

    expect(screen.getByRole("dialog", { hidden: true }).hidden).toBe(true);
  });
});
