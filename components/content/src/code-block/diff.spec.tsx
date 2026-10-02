import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { AFTER, coded, diffed, reviewed } from "#code-block/code-block.fixtures.tsx";
import { Diff, type DiffProps } from "#code-block/diff.tsx";
import { recipe } from "#code-block/recipe.ts";
import { Root } from "#code-block/root.tsx";

/**
 * Returns the number of rendered lines, both sides of a pair counted.
 */
function linesIn(container: HTMLElement): number {
  return container.querySelectorAll(".code-block__line").length;
}

/**
 * Presses the fold button a name matches, with the pointer's click.
 */
function opened(name: string): void {
  act(() => {
    fireEvent.click(screen.getByRole("button", { name }));
  });
}

describe("Diff", () => {
  it("satisfies the component contract with div as its element", () => {
    expect(
      violations(Diff, {
        element: "DIV",
        subject: (container) => slotElement(container, "code-block", "diff"),
        wrapper: diffed,
      }),
    ).toStrictEqual([]);
  });

  it("reports no axe violation in a unified diff with folds", async () => {
    await expect(accessibilityViolations(() => reviewed({ context: 1 }))).resolves.toStrictEqual(
      [],
    );
  });

  it("reports no axe violation side by side", async () => {
    await expect(
      accessibilityViolations(() => reviewed({ context: 1, mode: "split" })),
    ).resolves.toStrictEqual([]);
  });

  it("reports no axe violation without changes", async () => {
    await expect(
      accessibilityViolations(() => diffed(<Diff />, { before: AFTER })),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(diffed(<Diff />, props)).container, {
        slot: "diff",
      }),
    ).toStrictEqual([]);
  });

  it("omits as and children from its props", () => {
    expectTypeOf<DiffProps>().not.toHaveProperty("as");
    expectTypeOf<DiffProps>().not.toHaveProperty("children");
    expect(Diff).toBeDefined();
  });

  it("renders the lines inside the scroll area's content", () => {
    const { container } = render(reviewed());

    expect(slotElement(container, "code-block", "diff").parentElement?.className).toContain(
      "scroll-area__content",
    );
  });

  it("names the region by the title while one renders", () => {
    const { container } = render(reviewed());

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-labelledby")).toBe(
      screen.getByText("retry.ts").id,
    );
  });

  it("names the region by label without a title", () => {
    const { container } = render(diffed(<Diff label="Retry helper" />));

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-label")).toBe(
      "Retry helper",
    );
  });

  it("names the region Changes by default", () => {
    const { container } = render(diffed(<Diff />));

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-label")).toBe(
      "Changes",
    );
  });

  it("renders every line of the diff at a context of Infinity", () => {
    const { container } = render(reviewed({ context: Infinity }));

    expect(linesIn(container)).toBe(14);
  });

  it("folds the unchanged lines more than context lines from a change", () => {
    render(reviewed({ context: 1 }));

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toStrictEqual([
      "Show 1 unchanged line",
      "Show 3 unchanged lines",
      "Show 2 unchanged lines",
    ]);
  });

  it("shows the lines of a fold when its button is pressed", () => {
    const { container } = render(reviewed({ context: 1 }));

    opened("Show 3 unchanged lines");

    expect(linesIn(container)).toBe(11);
  });

  it("moves focus to the first line a fold showed", () => {
    render(reviewed({ context: 1 }));

    opened("Show 3 unchanged lines");

    expect(document.activeElement?.textContent).toBe("55     try {");
  });

  it("moves focus to the first line of a fold that starts the diff", () => {
    render(reviewed({ context: 1 }));

    opened("Show 1 unchanged line");

    expect(document.activeElement?.textContent).toBe('11 import { sleep } from "./sleep";');
  });

  it("moves focus to the earlier version's side of the first line a fold showed side by side", () => {
    render(reviewed({ context: 1, mode: "split" }));

    opened("Show 3 unchanged lines");

    expect(document.activeElement?.textContent).toBe("5     try {");
  });

  it("keeps focus on the element that has it when the diff renders again", () => {
    const { rerender } = render(reviewed({ context: 1 }));

    opened("Show 3 unchanged lines");
    act(() => {
      screen.getByRole("button", { name: "Show 2 unchanged lines" }).focus();
    });
    rerender(reviewed({ context: 1, mode: "split" }));

    expect(document.activeElement?.textContent).toBe("Show 2 unchanged lines");
  });

  it("writes data-mode unified by default", () => {
    const { container } = render(reviewed());

    expect(slotElement(container, "code-block", "diff").dataset["mode"]).toBe("unified");
  });

  it("writes data-mode split side by side", () => {
    const { container } = render(reviewed({ mode: "split" }));

    expect(slotElement(container, "code-block", "diff").dataset["mode"]).toBe("split");
  });

  it("renders an unchanged line on both sides side by side", () => {
    const { container } = render(reviewed({ context: Infinity, mode: "split" }));

    expect(linesIn(container)).toBe(24);
  });

  it("puts a filler beside a removed line no added line replaces", () => {
    const { container } = render(
      <Root before={"a\nb\nc"} code={"a\nc"}>
        <Diff mode="split" />
      </Root>,
    );

    expect(container.querySelectorAll(".code-block__filler")).toHaveLength(1);
  });

  it("puts a filler beside an added line that replaces no removed line", () => {
    const { container } = render(
      <Root before={"a\nc"} code={"a\nb\nc"}>
        <Diff mode="split" />
      </Root>,
    );
    const filler = container.querySelector(".code-block__filler");

    expect(filler?.nextElementSibling?.textContent).toBe("2+Added b");
  });

  it("renders emptyLabel when both versions are the same", () => {
    const { container } = render(diffed(<Diff />, { before: AFTER }));

    expect(slotElement(container, "code-block", "empty").textContent).toBe("No changes");
  });

  it("renders emptyLabel when the root has no before", () => {
    const { container } = render(coded(<Diff />));

    expect(slotElement(container, "code-block", "empty").textContent).toBe("No changes");
  });

  it("renders the caller's emptyLabel", () => {
    const { container } = render(coded(<Diff emptyLabel="Keine Änderungen" />));

    expect(slotElement(container, "code-block", "empty").textContent).toBe("Keine Änderungen");
  });

  it("names a fold by the caller's expandLabel", () => {
    render(reviewed({ context: 1, expandLabel: (count) => `${String(count)} more` }));

    expect(screen.getAllByRole("button")[0]?.textContent).toBe("1 more");
  });

  it("states the caller's removedLabel before a removed line", () => {
    const { container } = render(reviewed({ removedLabel: "Entfernt" }));

    expect(container.querySelector("[data-kind=removed] .visually-hidden")?.textContent).toBe(
      "Entfernt ",
    );
  });

  it("marks no changed word when wordLevel is false", () => {
    const { container } = render(reviewed({ wordLevel: false }));

    expect(container.querySelectorAll("ins, del")).toHaveLength(0);
  });

  it("marks the changed words of both versions by default", () => {
    const { container } = render(reviewed());

    expect(
      Array.from(container.querySelectorAll("ins, del"), (change) => change.textContent),
    ).toStrictEqual(["3", "5", " * 2 ** attempt"]);
  });

  it("keeps the syntax inks of a changed word", () => {
    const { container } = render(reviewed());

    expect(container.querySelector<HTMLElement>("ins > [data-token]")?.dataset["token"]).toBe(
      "number",
    );
  });
});
