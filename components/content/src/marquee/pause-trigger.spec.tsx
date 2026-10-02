import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { PauseTrigger, Root, Viewport } from "#marquee/index.ts";
import { composed, region } from "#marquee/marquee.fixtures.tsx";

describe("PauseTrigger", () => {
  it("renders the library's button with the pause trigger class", async () => {
    const { container } = await drawn(composed());

    expect([...slotElement(container, "marquee", "pauseTrigger").classList]).toContain("button");
  });

  it("names itself Pause while the marquee moves", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });

  it("pauses the marquee on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Pause" }));

    expect(region().dataset["paused"]).toBe("");
  });

  it("names itself Play after a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Pause" }));

    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
  });

  it("takes its names from pauseLabel and playLabel", async () => {
    await drawn(
      <Root aria-label="Headlines">
        <Viewport />
        <PauseTrigger pauseLabel="Anhalten" playLabel="Abspielen">
          x
        </PauseTrigger>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Anhalten" }));

    expect(screen.getByRole("button", { name: "Abspielen" })).toBeDefined();
  });

  it("calls onPauseChange with the reader's choice", async () => {
    const told = vi.fn<(details: { readonly paused: boolean }) => void>();

    await drawn(composed({ onPauseChange: told }));
    await pressed(screen.getByRole("button", { name: "Pause" }));

    expect(told).toHaveBeenLastCalledWith({ paused: true });
  });

  it("leaves the marquee moving when the caller's handler cancels the press", async () => {
    await drawn(
      <Root aria-label="Headlines">
        <Viewport />
        <PauseTrigger
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          x
        </PauseTrigger>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Pause" }));

    expect(screen.getByRole("region", { name: "Headlines" }).dataset["paused"]).toBeUndefined();
  });

  it("keeps its name while the pointer pauses the marquee", async () => {
    await drawn(composed({ pauseOnInteraction: true }));
    fireEvent.pointerEnter(region());
    await settled();

    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });
});
