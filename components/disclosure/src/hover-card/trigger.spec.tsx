import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, hovered, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, elapsed, rooted, shared } from "#hover-card/hover-card.fixtures.tsx";
import { Trigger } from "#hover-card/trigger.tsx";

/**
 * Describes the details `onTriggerValueChange` receives.
 */
interface Switched {
  /**
   * The value of the trigger that opened the card.
   */
  readonly value: null | string;
}

describe("Trigger", () => {
  it("renders an a", async () => {
    const { container } = await drawn(rooted(<Trigger href="#ada">Ada Lovelace</Trigger>));

    expect(slotElement(container, "hover-card", "trigger").tagName).toBe("A");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(rooted(<Trigger href="#ada">Ada Lovelace</Trigger>));

    expect(slotElement(container, "hover-card", "trigger").className).toContain(
      "hover-card__trigger",
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rooted(<Trigger as="button">Ada Lovelace</Trigger>));

    expect(slotElement(container, "hover-card", "trigger").tagName).toBe("BUTTON");
  });

  it("sets data-state to open while the card is open", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("link", { name: "Ada Lovelace" }).dataset["state"]).toBe("open");
  });

  it("leaves aria-expanded unset", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("link", { name: "Ada Lovelace" }).getAttribute("aria-expanded")).toBe(
      null,
    );
  });

  it("calls a caller's onFocus beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      rooted(
        <Trigger href="#ada" onFocus={heard}>
          Ada Lovelace
        </Trigger>,
      ),
    );
    fireEvent.focus(screen.getByRole("link", { name: "Ada Lovelace" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });

  it("reports the value of the trigger that opened the card", async () => {
    const switched = vi.fn<(details: Switched) => void>();

    await drawn(shared({ onTriggerValueChange: switched, openDelay: 0 }));
    await hovered(screen.getByRole("link", { name: "Grace Hopper" }));
    await elapsed();

    expect(switched).toHaveBeenLastCalledWith(expect.objectContaining({ value: "grace" }));
  });

  it("moves the open card to another trigger without waiting for openDelay", async () => {
    const switched = vi.fn<(details: Switched) => void>();

    await drawn(shared({ onTriggerValueChange: switched, openDelay: 50 }));
    await hovered(screen.getByRole("link", { name: "Ada Lovelace" }));
    await elapsed(100);
    await hovered(screen.getByRole("link", { name: "Grace Hopper" }));

    expect(switched).toHaveBeenLastCalledWith(expect.objectContaining({ value: "grace" }));
  });

  it("ignores the focus a touch press gives the link", async () => {
    await drawn(composed({ openDelay: 0 }));

    const link = screen.getByRole("link", { name: "Ada Lovelace" });

    fireEvent.pointerDown(link, { pointerType: "touch" });
    fireEvent.focus(link);
    await elapsed();

    expect(link.dataset["state"]).toBe("closed");
  });

  it("opens on the focus a mouse press gives the link", async () => {
    await drawn(composed({ openDelay: 0 }));

    const link = screen.getByRole("link", { name: "Ada Lovelace" });

    fireEvent.pointerDown(link, { pointerType: "mouse" });
    fireEvent.focus(link);
    await elapsed();

    expect(link.dataset["state"]).toBe("open");
  });

  it("opens on the focus a mouse press gives the link after a touch press", async () => {
    await drawn(composed({ openDelay: 0 }));

    const link = screen.getByRole("link", { name: "Ada Lovelace" });

    fireEvent.pointerDown(link, { pointerType: "touch" });
    fireEvent.pointerDown(link, { pointerType: "mouse" });
    fireEvent.focus(link);
    await elapsed();

    expect(link.dataset["state"]).toBe("open");
  });

  it("opens on focus once the link lost the focus a touch press gave it", async () => {
    await drawn(composed({ openDelay: 0 }));

    const link = screen.getByRole("link", { name: "Ada Lovelace" });

    fireEvent.pointerDown(link, { pointerType: "touch" });
    fireEvent.focus(link);
    fireEvent.blur(link);
    fireEvent.focus(link);
    await elapsed();

    expect(link.dataset["state"]).toBe("open");
  });

  it("sets data-current on the trigger that opened the card", async () => {
    await drawn(shared({ openDelay: 0 }));
    await hovered(screen.getByRole("link", { name: "Grace Hopper" }));
    await elapsed();

    expect(screen.getByRole("link", { name: "Grace Hopper" }).dataset["current"]).toBe("");
  });
});
