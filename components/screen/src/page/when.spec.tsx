import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageProvider } from "#page/state.ts";
import { When } from "#page/when.ts";

/**
 * Renders a switch inside a page state of the given width.
 *
 * @param narrow - Whether the page has folded.
 * @param when - The width at which the children render.
 * @returns The switch inside the page provider.
 */
function under(narrow: boolean, when?: "narrow" | "wide"): React.ReactElement {
  return (
    <PageProvider value={{ narrow, size: "md" }}>
      <When when={when}>
        <span>Invoices</span>
      </When>
    </PageProvider>
  );
}

describe("When", () => {
  it("renders its children at every width without when", () => {
    render(under(false));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });

  it("renders a narrow part on a folded page", () => {
    render(under(true, "narrow"));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });

  it("removes a narrow part from an unfolded page", () => {
    render(under(false, "narrow"));

    expect(screen.queryByText("Invoices")).toBeNull();
  });

  it("removes a wide part from a folded page", () => {
    render(under(true, "wide"));

    expect(screen.queryByText("Invoices")).toBeNull();
  });

  it("renders no element of its own", () => {
    const { container } = render(under(false));

    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });
});
