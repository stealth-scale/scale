import { type CSSProperties } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { only, part, parts } from "#part.ts";

function Nothing(): null {
  return null;
}

describe("part", () => {
  it("returns the part carrying the name", () => {
    const { container } = render(<article data-part="root" />);

    expect(part(container, "root").tagName).toBe("ARTICLE");
  });

  it("returns a part below the top of the output", () => {
    const { container } = render(
      <div data-part="root">
        <span data-part="indicator" />
      </div>,
    );

    expect(part(container, "indicator").tagName).toBe("SPAN");
  });

  it("throws naming the part it could not find", () => {
    const { container } = render(<div data-part="root" />);

    expect(() => part(container, "trigger")).toThrow('[data-part="trigger"]');
  });

  it("returns the first when a component rendered the part more than once", () => {
    const { container } = render(
      <div>
        <span data-part="item" id="one" />
        <span data-part="item" id="two" />
      </div>,
    );

    expect(part(container, "item").id).toBe("one");
  });
});

describe("parts", () => {
  it("returns every element under the name in document order", () => {
    const { container } = render(
      <div>
        <span data-part="item" id="one" />
        <span data-part="item" id="two" />
      </div>,
    );

    expect(parts(container, "item").map((one) => one.id)).toStrictEqual(["one", "two"]);
  });

  it("returns an array rather than a NodeList", () => {
    const { container } = render(<span data-part="item" />);

    expect(Array.isArray(parts(container, "item"))).toBe(true);
  });

  it("returns an empty array when the component rendered none", () => {
    const { container } = render(<div data-part="root" />);

    expect(parts(container, "item")).toStrictEqual([]);
  });
});

describe("only", () => {
  it("returns the one element the render produced", () => {
    const { container } = render(<article />);

    expect(only(container).tagName).toBe("ARTICLE");
  });

  it("throws when the render produced nothing", () => {
    const { container } = render(<Nothing />);

    expect(() => only(container)).toThrow("no element");
  });

  it("returns the SVG mark a component rendered", () => {
    const container = document.createElement("div");

    container.append(document.createElementNS("http://www.w3.org/2000/svg", "svg"));

    expect(only(container).tagName).toBe("svg");
  });

  it("returns the custom properties a component set", () => {
    const { container } = render(<div style={{ "--columns": 3 } as CSSProperties} />);

    expect(only(container).style.getPropertyValue("--columns")).toBe("3");
  });

  it("throws naming what it found when the render produced neither", () => {
    const container = document.createElement("div");

    container.append(document.createElementNS("http://www.w3.org/1998/Math/MathML", "math"));

    expect(() => only(container)).toThrow("<math>");
  });
});
