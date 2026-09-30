import { render, type RenderResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Grid } from "#heat/grid.ts";
import { Group, type GroupProps } from "#heat/group.tsx";
import { framed, observed } from "#heat/heat.fixtures.tsx";
import { OVERFLOW } from "#heat/recipe.ts";

/**
 * Lays each group's words out `wide` pixels wide in a heading `room` pixels wide.
 */
function laidOut(wide: number, room: number): void {
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(wide);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(room);
}

/**
 * Renders a group spanning three columns in the head of a grid.
 */
function grouped(changes: Partial<GroupProps> = {}): RenderResult {
  return render(
    framed(
      <Grid aria-label="Days">
        <thead>
          <tr>
            <Group hidden={false} label="Mar" span={3} {...changes} />
          </tr>
        </thead>
      </Grid>,
    ),
  );
}

/**
 * Returns the group's words.
 */
function words(): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the group's words
  return document.querySelector(".heat__group-label") as HTMLElement;
}

describe("Group", () => {
  it("spans its columns", () => {
    grouped();

    expect(document.querySelector("th")?.colSpan).toBe(3);
  });

  it("states the scope of a group of columns", () => {
    grouped();

    expect(document.querySelector("th")?.getAttribute("scope")).toBe("colgroup");
  });

  it("renders its words", () => {
    grouped();

    expect(words().textContent).toBe("Mar");
  });

  it("marks words wider than the group", () => {
    laidOut(40, 30);
    grouped();

    expect(words().hasAttribute(OVERFLOW)).toBe(true);
  });

  it("leaves words as wide as the group unmarked", () => {
    laidOut(30, 30);
    grouped();

    expect(words().hasAttribute(OVERFLOW)).toBe(false);
  });

  it("measures its words again when the group resizes", () => {
    const observer = observed();

    laidOut(40, 30);
    grouped();
    laidOut(40, 60);
    observer.resize();

    expect(words().hasAttribute(OVERFLOW)).toBe(false);
  });

  it("measures its words again when they change", () => {
    laidOut(20, 30);

    const { rerender } = grouped();

    laidOut(40, 30);
    rerender(
      framed(
        <Grid aria-label="Days">
          <thead>
            <tr>
              <Group hidden={false} label="March" span={3} />
            </tr>
          </thead>
        </Grid>,
      ),
    );

    expect(words().hasAttribute(OVERFLOW)).toBe(true);
  });

  it("observes the size of the group's heading", () => {
    const observer = observed();

    grouped();

    expect(observer.targets()).toContain(document.querySelector("th"));
  });

  it("observes the size of its words", () => {
    const observer = observed();

    grouped();

    expect(observer.targets()).toContain(words());
  });

  it("disconnects its resize observer once it unmounts", () => {
    const observer = observed();
    const { unmount } = grouped();

    unmount();

    expect(observer.disconnected()).toBe(true);
  });

  it("renders a hidden heading's words for a screen reader alone", () => {
    grouped({ hidden: true });

    expect(document.querySelector(".heat__name")?.textContent).toBe("Mar");
  });

  it("renders no measured words for a hidden heading", () => {
    grouped({ hidden: true });

    expect(document.querySelector(".heat__group-label")).toBeNull();
  });
});
