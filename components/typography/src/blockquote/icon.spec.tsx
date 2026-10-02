import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { QuoteIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import {
  boundViolations,
  slotClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { Icon } from "#blockquote/icon.tsx";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Icon", () => {
  it("passes the component conformance checks as an svg element inside Root", () => {
    expect(
      violations(Icon, {
        as: true,
        children: true,
        element: "SVG",
        subject: (container) => slotElement(container, "blockquote", "icon"),
        wrapper: quoted,
      }),
    ).toStrictEqual([]);
  });

  it("applies the class of every variant value to the icon slot", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Icon />
            </Root>,
          ).container,
        { slot: "icon" },
      ),
    ).toStrictEqual([]);
  });

  it("applies the icon recipe's size class", () => {
    const { container } = render(quoted(<Icon size="lg" />));

    expect(slotClasses(container, "blockquote", "icon")).toContain(
      variantClass("icon", "size", "lg"),
    );
  });

  it("renders the quote mark when it has no children", () => {
    const { container } = render(quoted(<Icon />));

    expect(
      slotElement(container, "blockquote", "icon").querySelector("path")?.getAttribute("d"),
    ).toBe("M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z");
  });

  it("sets viewBox to the 24-unit box by default", () => {
    const { container } = render(quoted(<Icon />));

    expect(slotElement(container, "blockquote", "icon").getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("renders the children in place of the quote mark", () => {
    const { container } = render(
      quoted(
        <Icon>
          <QuoteIcon />
        </Icon>,
      ),
    );

    expect(slotElement(container, "blockquote", "icon").querySelectorAll("path")).toHaveLength(2);
  });

  it("applies the viewBox passed by the caller", () => {
    const { container } = render(quoted(<Icon viewBox="0 0 16 16" />));

    expect(slotElement(container, "blockquote", "icon").getAttribute("viewBox")).toBe("0 0 16 16");
  });
});
