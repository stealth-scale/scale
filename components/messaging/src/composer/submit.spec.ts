import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { composed, pressed, typed } from "#composer/composer.fixtures.tsx";

describe("Submit", () => {
  it("renders a submit button named Send", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Send" }).getAttribute("type")).toBe("submit");
  });

  it("names the button by label", () => {
    render(composed({ submit: { label: "Reply" } }));

    expect(screen.getByRole("button", { name: "Reply" })).toBeDefined();
  });

  it("writes aria-disabled while there is nothing to send", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Send" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves aria-disabled off while there is text to send", () => {
    render(composed());
    typed("Approved.");

    expect(screen.getByRole("button", { name: "Send" }).hasAttribute("aria-disabled")).toBe(false);
  });

  it("stops the response while busy with onStop", () => {
    const onStop = vi.fn<() => void>();

    render(composed({ root: { busy: true, onStop } }));
    pressed("Stop");

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("renders the stop glyph and a plain button while it stops", () => {
    render(composed({ root: { busy: true, onStop: vi.fn<() => void>() } }));

    const stop = screen.getByRole("button", { name: "Stop" });

    expect([stop.textContent, stop.getAttribute("type")]).toStrictEqual(["■", "button"]);
  });

  it("names the stop control by stopLabel", () => {
    render(
      composed({
        root: { busy: true, onStop: vi.fn<() => void>() },
        submit: { stopLabel: "Halt" },
      }),
    );

    expect(screen.getByRole("button", { name: "Halt" })).toBeDefined();
  });

  it("stays a disabled send control while busy without onStop", () => {
    render(composed({ root: { busy: true, defaultValue: "Approved." } }));

    expect(screen.getByRole("button", { name: "Send" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("calls the caller's onClick", () => {
    const onClick = vi.fn<() => void>();

    render(composed({ submit: { onClick } }));
    pressed("Send");

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
