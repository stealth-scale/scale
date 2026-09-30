import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import {
  beside,
  laidOut,
  revealedOf,
  rootOf,
  row,
} from "#swipe-actions/swipe-actions.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => row())).resolves.toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(row());

    expect(rootOf(container).tagName).toBe("DIV");
  });

  it("renders the element as names", () => {
    const { container } = render(row({ as: "article" }));

    expect(rootOf(container).tagName).toBe("ARTICLE");
  });

  it("takes focus from script alone", () => {
    const { container } = render(row());

    expect(rootOf(container).tabIndex).toBe(-1);
  });

  it("states no revealed width at rest", () => {
    const { container } = render(row());

    expect(revealedOf(container)).toBe("0px");
  });

  it("keeps the caller's style beside the revealed width", () => {
    const { container } = render(row({ style: { marginBlockStart: "4px" } }));

    expect(rootOf(container).style.marginBlockStart).toBe("4px");
  });

  it("reveals the actions' width while open", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });

    expect(revealedOf(container)).toBe("160px");
  });

  it("sets data-open while the actions rest open", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });

    expect(rootOf(container).dataset["open"]).toBe("");
  });

  it("sets no data-open at rest", () => {
    const { container } = render(row());

    expect(rootOf(container).dataset["open"]).toBeUndefined();
  });

  it("closes when a press lands outside the row", () => {
    laidOut();

    const { container } = render(beside());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });
    fireEvent.pointerDown(screen.getByRole("button", { name: "Elsewhere" }));

    expect(revealedOf(container)).toBe("0px");
  });

  it("stays open when a press lands inside the row", () => {
    laidOut();

    const { container } = render(row());

    act(() => {
      screen.getByRole("button", { name: "Archive" }).focus();
    });
    fireEvent.pointerDown(screen.getByRole("button", { name: "Delete" }));

    expect(revealedOf(container)).toBe("160px");
  });
});
