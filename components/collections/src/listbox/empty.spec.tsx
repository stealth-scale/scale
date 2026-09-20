import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Empty } from "#listbox/empty.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { Root } from "#listbox/root.tsx";
import { NOTHING } from "#listbox/rows.fixtures.ts";

/**
 * Draws a part inside a list that holds no rows at all.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
function emptied(children: ReactNode): ReactElement {
  return <Root collection={NOTHING}>{children}</Root>;
}

describe("Empty", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(emptied(<Empty>Nothing here.</Empty>));

    expect(slotElement(container, "listbox", "empty").tagName).toBe("SPAN");
  });

  it("conforms as a span element", () => {
    expect(
      violations(Empty, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "listbox", "empty"),
        wrapper: emptied,
      }),
    ).toStrictEqual([]);
  });

  it("says the list holds nothing where it holds nothing", () => {
    const { container } = render(emptied(<Empty>Nothing here.</Empty>));

    expect(container.textContent).toBe("Nothing here.");
  });

  it("leaves nothing in the document where the list has rows", () => {
    const { container } = render(offered(<Empty>Nothing here.</Empty>));

    expect(container.textContent).toBe("");
  });

  it("takes the size the root states", () => {
    const { container } = render(
      <Root collection={NOTHING} size="lg">
        <Empty>Nothing here.</Empty>
      </Root>,
    );

    expect(slotElement(container, "listbox", "empty").className).toContain("lg");
  });
});
