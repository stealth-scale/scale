import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Leading } from "#page/leading.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Leading", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Leading>A</Leading>));

    expect(slotElement(container, "page", "leading").tagName).toBe("DIV");
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(narrowed(paged(<Leading when="wide">A</Leading>)));

    expect(screen.queryByText("A")).toBeNull();
  });

  it("renders on a wide page when when is wide", () => {
    render(paged(<Leading when="wide">A</Leading>));

    expect(screen.getByText("A")).toBeTruthy();
  });
});
