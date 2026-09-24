import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import {
  boundViolations,
  classesOf,
  slotClass,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { composed } from "#app-shell/app-shell.fixtures.tsx";
import { recipe } from "#app-shell/recipe.ts";
import { Root, type RootProps } from "#app-shell/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a whole shell", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(<Root {...props} />).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(<Root />);

    expect(slotElement(container, "app-shell", "root").tagName).toBe("DIV");
  });

  it("renders no landmark of its own", () => {
    render(composed());

    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it("exposes the aside as a named complementary landmark", () => {
    render(composed());

    expect(screen.getByRole("complementary", { name: "Detail" })).toBeTruthy();
  });

  it("defaults to the page scroll and the plain look", () => {
    const { container } = render(<Root />);

    expect(classesOf(slotElement(container, "app-shell", "root"))).toStrictEqual([
      slotClass("app-shell", "root"),
      variantClass(slotClass("app-shell", "root"), "scroll", "page"),
      variantClass(slotClass("app-shell", "root"), "variant", "plain"),
    ]);
  });

  it("writes data-settled after it mounts", () => {
    const { container } = render(<Root />);

    expect(slotElement(container, "app-shell", "root").dataset["settled"]).toBe("");
  });
});
