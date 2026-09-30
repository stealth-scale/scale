import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Context } from "#page/context-band.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Context", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Context>Billing</Context>));

    expect(slotElement(container, "page", "context").tagName).toBe("DIV");
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(narrowed(paged(<Context when="wide">Billing</Context>)));

    expect(screen.queryByText("Billing")).toBeNull();
  });

  it("renders on a narrow page when when is narrow", () => {
    render(narrowed(paged(<Context when="narrow">Billing</Context>)));

    expect(screen.getByText("Billing")).toBeTruthy();
  });

  it("renders nothing on a wide page when when is narrow", () => {
    render(paged(<Context when="narrow">Billing</Context>));

    expect(screen.queryByText("Billing")).toBeNull();
  });
});
