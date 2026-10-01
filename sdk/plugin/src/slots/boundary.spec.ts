import { createElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "#slots/boundary.fixtures.ts";
import { Boundary } from "#slots/boundary.ts";
import { Broken, Flaky, Lead } from "#slots/parts.fixtures.tsx";

describe("Boundary", () => {
  it("renders its children while they render", () => {
    render(createElement(Boundary, propsOf(1), createElement(Lead)));

    expect(screen.getByText("lead")).toBeTruthy();
  });

  it("calls onRendered after the children commit", () => {
    const props = propsOf(1);

    render(createElement(Boundary, props, createElement(Lead)));

    expect(props.onRendered).toHaveBeenCalledTimes(1);
  });

  it("renders the fallback after a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const props = propsOf(1);

    render(createElement(Boundary, props, createElement(Broken)));

    expect(screen.getByText("fallback")).toBeTruthy();
    expect(props.onError).toHaveBeenCalledExactlyOnceWith(new Error("broken"));
  });

  it("calls no onRendered while the fallback renders", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const props = propsOf(1);

    render(createElement(Boundary, props, createElement(Broken)));

    expect(props.onRendered).not.toHaveBeenCalled();
  });

  it("renders the children again when the reset key changes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      createElement(Boundary, propsOf(1), createElement(Flaky, { fail: true })),
    );

    rerender(createElement(Boundary, propsOf(2), createElement(Flaky, { fail: false })));

    expect(screen.getByText("steady")).toBeTruthy();
  });

  it("keeps the fallback while the reset key is unchanged", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const props = propsOf(1);
    const { rerender } = render(
      createElement(Boundary, props, createElement(Flaky, { fail: true })),
    );

    rerender(createElement(Boundary, props, createElement(Flaky, { fail: false })));

    expect(screen.getByText("fallback")).toBeTruthy();
  });
});
