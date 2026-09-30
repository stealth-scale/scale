import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Area } from "#timer/area.tsx";
import { composed } from "#timer/timer.fixtures.tsx";

describe("Area", () => {
  it("renders a div with the timer role", async () => {
    await drawn(composed());

    expect(screen.getByRole("timer").tagName).toBe("DIV");
  });

  it("takes its name from the time in English words by default", async () => {
    await drawn(composed({ countdown: true, startMs: 125_000 }));

    expect(screen.getByRole("timer", { name: "2 minutes, 5 seconds" })).toBeTruthy();
  });

  it("takes its name from label", async () => {
    await drawn(
      composed(
        { countdown: true, startMs: 125_000 },
        { label: ({ minutes, seconds }) => `${String(minutes)} min ${String(seconds)} s` },
      ),
    );

    expect(screen.getByRole("timer", { name: "2 min 5 s" })).toBeTruthy();
  });

  it("leaves aria-live unset", async () => {
    await drawn(composed());

    expect(screen.getByRole("timer").getAttribute("aria-live")).toBeNull();
  });

  it("sets aria-atomic to true", async () => {
    await drawn(composed());

    expect(screen.getByRole("timer").getAttribute("aria-atomic")).toBe("true");
  });

  it("throws outside Timer.Root", () => {
    expect(() => render(<Area />)).toThrow(
      "A part of Timer was drawn outside the root that holds it together.",
    );
  });
});
