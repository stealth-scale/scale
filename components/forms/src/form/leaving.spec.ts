import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { leaving } from "#form/form.fixtures.tsx";

describe("isLeaving", () => {
  it("returns false for a move of focus inside the element", () => {
    render(leaving());
    act(() => {
      screen.getByRole("button", { name: "First" }).focus();
    });
    fireEvent.blur(screen.getByRole("button", { name: "First" }), {
      relatedTarget: screen.getByRole("button", { name: "Second" }),
    });

    expect(screen.getByRole("status").textContent).toBe("false");
  });

  it("returns true for a move of focus out of the element", () => {
    render(leaving());
    fireEvent.blur(screen.getByRole("button", { name: "Second" }), {
      relatedTarget: screen.getByRole("button", { name: "Outside" }),
    });

    expect(screen.getByRole("status").textContent).toBe("true");
  });

  it("returns true for a blur with no element to move to", () => {
    render(leaving());
    fireEvent.blur(screen.getByRole("button", { name: "First" }), { relatedTarget: null });

    expect(screen.getByRole("status").textContent).toBe("true");
  });
});
