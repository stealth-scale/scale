import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeElement, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Loader } from "#loader/loader.tsx";

describe("Loader", () => {
  it("renders the spinner before the text by default", () => {
    const { container } = render(<Loader text="Matching" />);

    expect(recipeElement(container, "loader").firstElementChild?.className).toContain(
      "loader__indicator",
    );
  });

  it("renders the spinner after the text when placement is end", () => {
    const { container } = render(<Loader placement="end" text="Matching" />);

    expect(recipeElement(container, "loader").lastElementChild?.className).toContain(
      "loader__indicator",
    );
  });

  it("renders the text in place of the children when both are passed", () => {
    render(<Loader text="Matching">Settled</Loader>);

    expect(screen.queryByText("Settled")).toBeNull();
  });

  it("renders the children inside the content slot when no text is passed", () => {
    const { container } = render(<Loader>Settled</Loader>);

    expect(slotElement(container, "loader", "content").textContent).toBe("Settled");
  });

  it("renders the default label for screen readers over hidden children", () => {
    const { container } = render(<Loader>Settled</Loader>);

    expect(slotElement(container, "loader", "label").textContent).toBe("Loading");
  });

  it("renders the label passed as label over hidden children", () => {
    const { container } = render(<Loader label="Saving changes">Save</Loader>);

    expect(slotElement(container, "loader", "label").textContent).toBe("Saving changes");
  });

  it("renders the children with no loader element when loading is false", () => {
    const { container } = render(<Loader loading={false}>Settled</Loader>);

    expect(container.innerHTML).toBe("Settled");
  });

  it("renders the spinner passed as spinner in place of the default", () => {
    const { container } = render(<Loader spinner={<b>wait</b>} text="Matching" />);

    expect(slotElement(container, "loader", "indicator").innerHTML).toBe("<b>wait</b>");
  });

  it("renders the default spinner at the inherit size", () => {
    const { container } = render(<Loader text="Matching" />);

    expect(recipeElement(container, "spinner").className).toContain(
      variantClass("spinner", "size", "inherit"),
    );
  });

  it("applies the palette class to the indicator when palette is set", () => {
    const { container } = render(<Loader palette="error" text="Matching" />);

    expect(slotElement(container, "loader", "indicator").className).toContain(
      variantClass("loader__indicator", "palette", "error"),
    );
  });

  it("returns no accessibility violation over hidden children", async () => {
    await expect(accessibilityViolations(() => <Loader>Settled</Loader>)).resolves.toStrictEqual(
      [],
    );
  });

  it("returns no accessibility violation beside text", async () => {
    await expect(accessibilityViolations(() => <Loader text="Matching" />)).resolves.toStrictEqual(
      [],
    );
  });
});
