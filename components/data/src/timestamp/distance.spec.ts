import { describe, expect, it } from "vitest";

import { distanceOf } from "#timestamp/distance.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

describe("distanceOf", () => {
  it.each([
    { apart: 30_000, want: "30 seconds ago" },
    { apart: 300_000, want: "5 minutes ago" },
    { apart: 8_100_000, want: "2 hours ago" },
    { apart: 86_400_000, want: "yesterday" },
    { apart: 1_814_400_000, want: "3 weeks ago" },
    { apart: 20_736_000_000, want: "8 months ago" },
    { apart: 63_072_000_000, want: "2 years ago" },
  ])("returns $want for an instant $apart milliseconds earlier", ({ apart, want }) => {
    expect(distanceOf(new Date(NOW.getTime() - apart), NOW, "en-US")).toBe(want);
  });

  it("truncates the count to whole units", () => {
    expect(distanceOf(new Date(NOW.getTime() - 10_740_000), NOW, "en-US")).toBe("2 hours ago");
  });

  it("returns the future tense for an instant ahead", () => {
    expect(distanceOf(new Date(NOW.getTime() + 10_800_000), NOW, "en-US")).toBe("in 3 hours");
  });

  it("returns now for a distance under a second", () => {
    expect(distanceOf(new Date(NOW.getTime() - 999), NOW, "en-US")).toBe("now");
  });

  it("words the distance in the locale", () => {
    expect(distanceOf(new Date(NOW.getTime() - 8_100_000), NOW, "nl-NL")).toBe("2 uur geleden");
  });
});
