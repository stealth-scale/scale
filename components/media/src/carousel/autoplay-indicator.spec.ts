import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed } from "#carousel/carousel.fixtures.tsx";

describe("AutoplayIndicator", () => {
  it("renders pause while the carousel rotates", async () => {
    await drawn(composed({ autoplay: true }));

    expect(screen.getByRole("button", { name: "Stop slide rotation" }).textContent).toBe("Pause");
  });

  it("renders play while the carousel does not rotate", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Start slide rotation" }).textContent).toBe("Play");
  });
});
