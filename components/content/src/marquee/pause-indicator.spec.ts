import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#marquee/marquee.fixtures.tsx";

describe("PauseIndicator", () => {
  it("renders the pause glyph while the marquee moves", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Pause" }).textContent).toBe("pause glyph");
  });

  it("renders the play glyph while the reader has paused it", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Pause" }));

    expect(screen.getByRole("button", { name: "Play" }).textContent).toBe("play glyph");
  });
});
