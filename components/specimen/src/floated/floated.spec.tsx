import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { Floated } from "#floated/floated.tsx";

/**
 * Returns the floated box's element.
 */
function boxOf(container: HTMLElement): HTMLElement {
  const box = container.querySelector<HTMLElement>(".floated");

  if (box === null) throw new Error("no floated box rendered");

  return box;
}

/**
 * Returns the box's block-end padding in pixels, read from its custom property.
 */
function depthOf(box: HTMLElement): number {
  return Number(box.style.getPropertyValue("--floated-block-end").slice(0, -2));
}

describe("Floated", () => {
  it("returns no accessibility violation with a button", async () => {
    await expect(
      accessibilityViolations(Floated, {
        props: { children: <button type="button">Save</button> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the floated class", () => {
    const { container } = render(<Floated>Draft</Floated>);

    expect(recipeClasses(container, "floated")).toContain("floated");
  });

  it("sets every side's custom property to zero before it measures", () => {
    const { container } = render(<Floated>Draft</Floated>);

    expect(boxOf(container).style.getPropertyValue("--floated-block-end")).toBe("0px");
  });

  it("sets the block end to the depth a positioner extends below", async () => {
    const { container } = render(
      <Floated>
        <div data-part="positioner" />
      </Floated>,
    );
    const box = boxOf(container);
    const positioner = box.querySelector<HTMLElement>("[data-part=positioner]");

    vi.spyOn(box, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, 0, 100, 40 + depthOf(box)),
    );
    if (positioner !== null) {
      vi.spyOn(positioner, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 40, 100, 30));
    }

    await act(async () => {
      positioner?.setAttribute("style", "position: absolute");
      await new Promise((settle) => {
        setTimeout(settle, 0);
      });
    });

    expect(box.style.getPropertyValue("--floated-block-end")).toBe("30px");
  });

  it("stops measuring after eight changes of padding", async () => {
    const { container } = render(
      <Floated>
        <div data-part="positioner" />
      </Floated>,
    );
    const box = boxOf(container);
    const positioner = box.querySelector<HTMLElement>("[data-part=positioner]");
    let depth = 40;

    vi.spyOn(box, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 100, 40));
    if (positioner !== null) {
      vi.spyOn(positioner, "getBoundingClientRect").mockImplementation(() => {
        depth += 10;

        return new DOMRect(0, 40, 100, depth);
      });
    }

    await act(async () => {
      positioner?.setAttribute("style", "position: absolute");
      await new Promise((settle) => {
        setTimeout(settle, 0);
      });
    });

    expect(depthOf(box)).toBeLessThan(1000);
  });

  it("keeps a caller's style beside the padding", () => {
    const { container } = render(<Floated style={{ color: "red" }}>Draft</Floated>);

    expect(boxOf(container).style.color).toBe("red");
  });
});
