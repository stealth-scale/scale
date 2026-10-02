import { createElement } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Empty } from "#sidebar/empty.tsx";
import { aside, filtered } from "#sidebar/sidebar.fixtures.tsx";

describe("Empty", () => {
  it("renders nothing without a query", () => {
    render(filtered());

    expect(screen.queryByText("No pages match")).toBeNull();
  });

  it("renders nothing while the query keeps a row", () => {
    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inv" } });

    expect(screen.queryByText("No pages match")).toBeNull();
  });

  it("renders a paragraph while the query keeps no row", () => {
    const { container } = render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "reports" } });

    expect(slotElement(container, "sidebar", "empty").tagName).toBe("P");
  });

  it("removes its message when the query keeps a row again", () => {
    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "reports" } });
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inv" } });

    expect(screen.queryByText("No pages match")).toBeNull();
  });

  it("renders its message while the query keeps no row", () => {
    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "reports" } });

    expect(screen.getByText("No pages match")).toBeTruthy();
  });

  it("announces its message in a polite live region", async () => {
    expect.hasAssertions();

    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "reports" } });

    await waitFor(() => {
      expect(document.querySelector("[aria-live=polite]")?.textContent).toBe("No pages match");
    });
  });

  it("renders its message in a scope with zero rows", () => {
    render(aside(createElement(Empty, null, "No pages match")));

    expect(screen.getByText("No pages match")).toBeTruthy();
  });

  it("announces nothing in a scope with zero rows without a query", async () => {
    render(aside(createElement(Empty, null, "Nothing here")));

    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    expect(document.querySelector("[aria-live=polite]")?.textContent ?? "").not.toBe(
      "Nothing here",
    );
  });
});
