import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { overflowing, scrolled } from "#scroll-area/scroll-area.fixtures.tsx";

describe("Viewport", () => {
  it("renders a div", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "viewport").tagName).toBe("DIV");
  });

  it("takes the region role while only the vertical axis overflows", async () => {
    const report = overflowing({ y: true });

    await drawn(scrolled());
    report();
    await settled();

    expect(screen.getByRole("region", { name: "Notes" }).tabIndex).toBe(0);
  });

  it("takes the region role while only the horizontal axis overflows", async () => {
    const report = overflowing({ x: true });

    await drawn(scrolled());
    report();
    await settled();

    expect(screen.getByRole("region", { name: "Notes" }).tabIndex).toBe(0);
  });

  it("takes the region role while both axes overflow", async () => {
    const report = overflowing({ x: true, y: true });

    await drawn(scrolled());
    report();
    await settled();

    expect(screen.getByRole("region", { name: "Notes" }).tabIndex).toBe(0);
  });

  it("takes no tab stop before the machine measures the viewport", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("tabindex")).toBeNull();
  });

  it("takes the region role as the machine starts while its content overflows", async () => {
    overflowing({ y: true });

    await drawn(scrolled());

    expect(screen.getByRole("region", { name: "Notes" }).tabIndex).toBe(0);
  });

  it("takes no role before the machine measures the viewport", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("role")).toBeNull();
  });

  it("takes no role while the content fits", async () => {
    const report = overflowing({});
    const { container } = await drawn(scrolled());

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("role")).toBeNull();
  });

  it("takes no tab stop while the content fits", async () => {
    const report = overflowing({});
    const { container } = await drawn(scrolled());

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("tabindex")).toBeNull();
  });

  it("takes no role while the caller passes focusable false", async () => {
    const report = overflowing({ x: true, y: true });
    const { container } = await drawn(scrolled({}, { focusable: false }));

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("role")).toBeNull();
  });

  it("leaves the tab order while the caller passes focusable false", async () => {
    const report = overflowing({ x: true, y: true });
    const { container } = await drawn(scrolled({}, { focusable: false }));

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").tabIndex).toBe(-1);
  });

  it("takes no role while the caller passes focusable none", async () => {
    const report = overflowing({ x: true, y: true });
    const { container } = await drawn(scrolled({}, { focusable: "none" }));

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("role")).toBeNull();
  });

  it("sets no tabindex while the caller passes focusable none", async () => {
    const report = overflowing({ x: true, y: true });
    const { container } = await drawn(scrolled({}, { focusable: "none" }));

    report();
    await settled();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("tabindex")).toBeNull();
  });

  it("leaves its overflow to the recipe", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "viewport").style.overflow).toBe("");
  });
});
