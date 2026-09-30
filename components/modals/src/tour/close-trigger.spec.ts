import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { framed, started, stepped } from "#tour/tour.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button", async () => {
    await started();

    expect(screen.getByRole("button", { name: "End the tour" }).tagName).toBe("BUTTON");
  });

  it("takes its name from aria-label", async () => {
    await started();

    expect(screen.getByRole("button", { name: "End the tour" }).getAttribute("aria-label")).toBe(
      "End the tour",
    );
  });

  it("ends the tour on a press", async () => {
    await started();
    await stepped("End the tour");
    await framed();

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
