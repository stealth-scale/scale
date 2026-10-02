import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { Focused } from "#focused/focused.tsx";

describe("Focused", () => {
  it("returns no accessibility violation with a button", async () => {
    await expect(
      accessibilityViolations(Focused, {
        props: { children: <button type="button">Save</button> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the contained class", () => {
    const { container } = render(<Focused>Draft</Focused>);

    expect(recipeClasses(container, "contained")).toContain("contained");
  });

  it("sets data-focus-visible on the first focusable descendant", () => {
    const { getByRole } = render(
      <Focused>
        <a href="#content">Skip to content</a>
        <button type="button">Save</button>
      </Focused>,
    );

    expect(getByRole("link").dataset["focusVisible"]).toBe("");
  });

  it("leaves data-focus-visible unset on later focusable descendants", () => {
    const { getByRole } = render(
      <Focused>
        <a href="#content">Skip to content</a>
        <button type="button">Save</button>
      </Focused>,
    );

    expect(getByRole("button").dataset["focusVisible"]).toBeUndefined();
  });

  it("sets data-focus-visible on the first descendant target selects", () => {
    const { getByRole } = render(
      <Focused target="button">
        <a href="#content">Skip to content</a>
        <button type="button">Save</button>
      </Focused>,
    );

    expect(getByRole("button").dataset["focusVisible"]).toBe("");
  });

  it("leaves data-focus-visible unset on a focusable descendant target does not select", () => {
    const { getByRole } = render(
      <Focused target="button">
        <a href="#content">Skip to content</a>
        <button type="button">Save</button>
      </Focused>,
    );

    expect(getByRole("link").dataset["focusVisible"]).toBeUndefined();
  });

  it("skips a disabled button", () => {
    const { getByRole } = render(
      <Focused>
        <button disabled type="button">
          Undo
        </button>
        <button type="button">Save</button>
      </Focused>,
    );

    expect(getByRole("button", { name: "Save" }).dataset["focusVisible"]).toBe("");
  });

  it("removes data-focus-visible when it unmounts", () => {
    const { getByRole, unmount } = render(
      <Focused>
        <button type="button">Save</button>
      </Focused>,
    );
    const button = getByRole("button");

    unmount();

    expect(button.dataset["focusVisible"]).toBeUndefined();
  });
});
