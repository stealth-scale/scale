import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { entry } from "#catalogue/mounted.fixtures.tsx";
import { framedDeclaration } from "#framed/route.tsx";

const LISTED = [entry("actions/button", "Actions", "Button")];

describe("framedDeclaration", () => {
  it("declares the framed page at the path it was given in no frame and under no parent", () => {
    const declared = framedDeclaration(LISTED, { id: "docs.framed", path: "framed" });

    expect(declared).toMatchObject({ id: "docs.framed", path: "framed" });
    expect(declared).not.toHaveProperty("layout");
    expect(declared).not.toHaveProperty("parent");
    expect(declared).not.toHaveProperty("navigation");
  });

  it("draws the framed page as a component that draws nothing until a sample is addressed", () => {
    const { component } = framedDeclaration(LISTED, { id: "docs.framed", path: "framed" });
    const drawn = typeof component === "function" ? createElement(component) : null;
    const { container } = render(<div>{drawn}</div>);

    expect(drawn).not.toBeNull();
    expect(container.textContent).toBe("");
  });
});
