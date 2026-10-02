import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, diffed } from "#code-block/code-block.fixtures.tsx";
import { DiffStat } from "#code-block/diff-stat.tsx";
import { recipe } from "#code-block/recipe.ts";

describe("DiffStat", () => {
  it("satisfies the component contract with span as its element", () => {
    expect(
      violations(DiffStat, {
        element: "SPAN",
        subject: (container) => slotElement(container, "code-block", "stat"),
        wrapper: diffed,
      }),
    ).toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(diffed(<DiffStat />, props)).container, {
        slot: "stat",
      }),
    ).toStrictEqual([]);
  });

  it("renders the added count after a plus", () => {
    const { container } = render(diffed(<DiffStat />));

    expect(container.querySelector("[data-kind=added]")?.textContent).toBe("+2");
  });

  it("renders the removed count after a minus", () => {
    const { container } = render(diffed(<DiffStat />));

    expect(container.querySelector("[data-kind=removed]")?.textContent).toBe("−2");
  });

  it("hides both counts from a screen reader", () => {
    const { container } = render(diffed(<DiffStat />));

    expect(
      Array.from(container.querySelectorAll("[data-kind]"), (count) =>
        count.getAttribute("aria-hidden"),
      ),
    ).toStrictEqual(["true", "true"]);
  });

  it("states the counts in words for a screen reader", () => {
    const { container } = render(diffed(<DiffStat />));

    expect(
      slotElement(container, "code-block", "stat").querySelector(".visually-hidden")?.textContent,
    ).toBe("2 lines added, 2 lines removed");
  });

  it("states the counts in the caller's statLabel", () => {
    const { container } = render(
      diffed(<DiffStat statLabel={({ added }) => `${String(added)} neu`} />),
    );

    expect(container.querySelector(".visually-hidden")?.textContent).toBe("2 neu");
  });

  it("counts nothing when the root has no before", () => {
    const { container } = render(coded(<DiffStat />));

    expect(slotElement(container, "code-block", "stat").textContent).toBe(
      "+0−00 lines added, 0 lines removed",
    );
  });
});
