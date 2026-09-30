import { createElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as examples from "#sidebar/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "console",
      "filter",
      "guides",
      "phone",
      "rail",
      "shell",
      "sizes",
      "workspace",
    ]);
  });

  it("lists every page in the filter example with an empty query", () => {
    render(createElement(examples.filter.Filter));

    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("narrows the filter example to the pages matching the query", () => {
    render(createElement(examples.filter.Filter));

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inv" } });

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders the empty message when the query matches no page", () => {
    const { container } = render(createElement(examples.filter.Filter));

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zebra" } });

    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(slotElement(container, "sidebar", "empty").tagName).toBe("P");
  });
});
