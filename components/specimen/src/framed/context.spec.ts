import { createElement, type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FramedProvider, useFramed } from "#framed/context.ts";

function Probe(): ReactElement {
  const pick = useFramed();

  return createElement("output", {}, pick === undefined ? "page" : JSON.stringify(pick));
}

describe("useFramed", () => {
  it("answers nothing on the page itself", () => {
    const { container } = render(createElement(Probe));

    expect(container.textContent).toBe("page");
  });

  it("answers the pick a framed document was asked for", () => {
    const { container } = render(
      createElement(FramedProvider, { value: { value: 1 } }, createElement(Probe)),
    );

    expect(container.textContent).toBe('{"value":1}');
  });
});
