import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Meta } from "#page/meta.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Meta", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Meta>Paid</Meta>));

    expect(slotElement(container, "page", "meta").tagName).toBe("DIV");
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(narrowed(paged(<Meta when="wide">Paid</Meta>)));

    expect(screen.queryByText("Paid")).toBeNull();
  });

  it("renders on a wide page when when is wide", () => {
    render(paged(<Meta when="wide">Paid</Meta>));

    expect(screen.getByText("Paid")).toBeTruthy();
  });
});
