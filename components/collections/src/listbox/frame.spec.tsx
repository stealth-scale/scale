import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Frame } from "#listbox/frame.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { Root } from "#listbox/root.tsx";
import { COLLECTION } from "#listbox/rows.fixtures.ts";

describe("Frame", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(offered(<Frame />));

    expect(slotElement(container, "listbox", "frame").tagName).toBe("DIV");
  });

  it("conforms as a div element", () => {
    expect(
      violations(Frame, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "listbox", "frame"),
        wrapper: offered,
      }),
    ).toStrictEqual([]);
  });

  it("takes the look the root states", () => {
    const { container } = render(
      <Root collection={COLLECTION} variant="surface">
        <Frame />
      </Root>,
    );

    expect(slotElement(container, "listbox", "frame").className).toContain("surface");
  });
});
