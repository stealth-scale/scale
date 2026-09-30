import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bare, LABEL, labelled } from "#progress/progress.fixtures.tsx";

describe("Track", () => {
  it("renders a DIV for the track slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "track").tagName).toBe("DIV");
  });

  it("renders the progress bar role", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("62");
  });

  it("states the formatted value as aria-valuetext", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("62%");
  });

  it("states no aria-valuetext while the value is unknown", async () => {
    await drawn(labelled({ value: null }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBeNull();
  });

  it("states no aria-valuenow while the value is unknown", async () => {
    await drawn(labelled({ value: null }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBeNull();
  });

  it("takes its name from aria-label without a label", async () => {
    await drawn(bare());

    expect(screen.getByRole("progressbar", { name: LABEL })).toBeDefined();
  });

  it("writes no aria-labelledby without a label", async () => {
    const { container } = await drawn(bare());

    expect(slotElement(container, "progress", "track").getAttribute("aria-labelledby")).toBeNull();
  });

  it("returns no accessibility violation for a bar named by aria-label", async () => {
    await expect(accessibilityViolations(() => bare({ value: 30 }))).resolves.toStrictEqual([]);
  });
});
