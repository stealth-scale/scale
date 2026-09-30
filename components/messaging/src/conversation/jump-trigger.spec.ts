import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { log, pressed, transcript } from "#conversation/conversation.fixtures.tsx";

describe("JumpTrigger", () => {
  it("renders nothing while the view is at the end", () => {
    render(transcript());

    expect(screen.queryByRole("button", { name: "Jump to the latest message" })).toBeNull();
  });

  it("renders a control named Jump to the latest message once the view leaves the end", () => {
    render(transcript());
    pressed("First");

    expect(screen.getByRole("button", { name: "Jump to the latest message" })).toBeDefined();
  });

  it("takes its name from label", () => {
    render(transcript({ jump: { label: "Latest" } }));
    pressed("First");

    expect(screen.getByRole("button", { name: "Latest" })).toBeDefined();
  });

  it("moves focus to the log when pressed", () => {
    render(transcript());
    pressed("First");
    act(() => {
      screen.getByRole("button", { name: "Jump to the latest message" }).click();
    });

    expect(document.activeElement).toBe(log());
  });

  it("returns the view to the end when pressed", () => {
    render(transcript());
    pressed("First");
    act(() => {
      screen.getByRole("button", { name: "Jump to the latest message" }).click();
    });

    expect(screen.getByRole("status").textContent).toBe("end");
  });

  it("calls the caller's onClick when pressed", () => {
    const onClick = vi.fn<() => void>();

    render(transcript({ jump: { onClick } }));
    pressed("First");
    act(() => {
      screen.getByRole("button", { name: "Jump to the latest message" }).click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
