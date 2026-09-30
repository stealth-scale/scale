import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Iframe } from "#iframe/iframe.tsx";
import { recipe } from "#iframe/recipe.ts";

/**
 * Renders a frame and returns it.
 */
function drawnFrame(element: Parameters<typeof render>[0]): HTMLIFrameElement {
  const { container } = render(element);
  const frame = recipeElement(container, "iframe");

  if (!(frame instanceof HTMLIFrameElement)) throw new TypeError("The frame did not render.");

  return frame;
}

describe("Iframe", () => {
  it("passes the component conformance checks as an iframe element", () => {
    expect(
      violations(Iframe, { as: true, element: "IFRAME", props: { title: "Preview" } }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Iframe, { props: { srcDoc: "<p>Paid</p>", title: "Receipt" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Iframe title="Preview" {...props} />).container),
    ).toStrictEqual([]);
  });

  it("grants the framed document nothing by default", () => {
    expect(drawnFrame(<Iframe title="Preview" />).getAttribute("sandbox")).toBe("");
  });

  it("grants the capabilities sandbox names", () => {
    expect(
      drawnFrame(<Iframe sandbox="allow-scripts" title="Preview" />).getAttribute("sandbox"),
    ).toBe("allow-scripts");
  });

  it("sets no allow attribute by default", () => {
    expect(drawnFrame(<Iframe title="Preview" />).getAttribute("allow")).toBeNull();
  });

  it("sends no referrer by default", () => {
    expect(drawnFrame(<Iframe title="Preview" />).getAttribute("referrerpolicy")).toBe(
      "no-referrer",
    );
  });

  it("keeps the referrer policy the caller passes", () => {
    expect(
      drawnFrame(<Iframe referrerPolicy="origin" title="Preview" />).getAttribute("referrerpolicy"),
    ).toBe("origin");
  });

  it("loads lazily by default", () => {
    expect(drawnFrame(<Iframe title="Preview" />).getAttribute("loading")).toBe("lazy");
  });

  it("loads eagerly when loading is eager", () => {
    expect(drawnFrame(<Iframe loading="eager" title="Preview" />).getAttribute("loading")).toBe(
      "eager",
    );
  });

  it("takes its accessible name from title", () => {
    expect(drawnFrame(<Iframe title="Preview of the March invoice" />).title).toBe(
      "Preview of the March invoice",
    );
  });
});
