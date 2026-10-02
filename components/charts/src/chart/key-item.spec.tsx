import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { KeyItem } from "#chart/key-item.tsx";
import { Key } from "#chart/key.tsx";

/**
 * Renders one entry in a key, and returns the container.
 */
function drawn(): HTMLElement {
  return render(
    charted({
      children: (
        <Key>
          <KeyItem
            className="probe"
            glyph={
              <svg viewBox="0 0 16 16">
                <rect height="16" width="16" />
              </svg>
            }
          >
            Median
          </KeyItem>
        </Key>
      ),
    }),
  ).container;
}

describe("KeyItem", () => {
  it("renders an li named by its text", () => {
    const item = drawn().querySelector("li");

    expect([item?.textContent, item?.classList.contains("probe")]).toStrictEqual(["Median", true]);
  });

  it("renders the glyph before the name", () => {
    expect(drawn().querySelector("li")?.firstElementChild?.querySelector("svg")).not.toBeNull();
  });

  it("hides the glyph from assistive technology", () => {
    expect(drawn().querySelector("li > span")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("gives the glyph the chart's glyph class", () => {
    expect(drawn().querySelector("li > span")?.classList.contains("chart__glyph")).toBe(true);
  });
});
