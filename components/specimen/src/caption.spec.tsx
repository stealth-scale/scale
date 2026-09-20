import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { Caption } from "#caption.tsx";

describe("Caption", () => {
  it("draws the value it was given", () => {
    expect(render(<Caption>sm</Caption>).container.textContent).toBe("sm");
  });

  it("writes the prop before the value when one is given", () => {
    expect(render(<Caption knob="size">sm</Caption>).container.textContent).toBe("size = sm");
  });

  it("draws the value in an element of its own", () => {
    const { container } = render(<Caption knob="size">sm</Caption>);

    expect(container.querySelector("span")?.textContent).toBe("sm");
  });

  it("draws the line as the library's paragraph", () => {
    const { container } = render(<Caption>sm</Caption>);

    expect(recipeClasses(container, "text")).toContain("text");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Caption, { props: { children: "sm", knob: "size" } }),
    ).resolves.toStrictEqual([]);
  });
});
