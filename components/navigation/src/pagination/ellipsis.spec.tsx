import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Ellipsis } from "#pagination/ellipsis.tsx";
import { Root } from "#pagination/root.tsx";

describe("Ellipsis", () => {
  it("renders a span with an ellipsis", async () => {
    const { container } = await drawn(
      <Root count={240}>
        <Ellipsis index={1} />
      </Root>,
    );
    const mark = slotElement(container, "pagination", "ellipsis");

    expect([mark.tagName, mark.textContent]).toStrictEqual(["SPAN", "…"]);
  });

  it("hides the mark from assistive technology", async () => {
    const { container } = await drawn(
      <Root count={240}>
        <Ellipsis index={1} />
      </Root>,
    );

    expect(slotElement(container, "pagination", "ellipsis").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("renders children in place of the ellipsis", async () => {
    const { container } = await drawn(
      <Root count={240}>
        <Ellipsis index={1}>⋯</Ellipsis>
      </Root>,
    );

    expect(slotElement(container, "pagination", "ellipsis").textContent).toBe("⋯");
  });
});
