import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PropsProvider } from "#nav-list/props-provider.tsx";
import { useDefaults } from "#nav-list/state.ts";

/**
 * Renders whether the defaults make the lists iconic.
 */
function Reader(): ReactElement {
  return <span data-testid="iconic">{String(useDefaults().iconic)}</span>;
}

describe("PropsProvider", () => {
  it("provides its value to the lists below it", () => {
    render(
      <PropsProvider value={{ iconic: true }}>
        <Reader />
      </PropsProvider>,
    );

    expect(screen.getByTestId("iconic").textContent).toBe("true");
  });

  it("renders its children and no element of its own", () => {
    const { container } = render(
      <PropsProvider value={{}}>
        <Reader />
      </PropsProvider>,
    );

    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });
});
