import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#switcher/label.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Label", () => {
  it("renders a span inside the trigger", () => {
    const { container } = render(held(<Label>Acme</Label>));

    expect(slotElement(container, "switcher", "label").tagName).toBe("SPAN");
  });
});
