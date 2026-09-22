import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text } from "@stealthscale/component-typography";
import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

import { CAPTION, captioned } from "#caption.tsx";

/**
 * Draws a caption the way a part that carries one draws it: the look on the line, the words in it.
 */
function Captioned({ knob }: { readonly knob?: string }): ReturnType<typeof Text> {
  return <Text {...CAPTION}>{captioned("sm", knob)}</Text>;
}

describe("captioned", () => {
  it("writes the value it was given", () => {
    expect(render(<Captioned />).container.textContent).toBe("sm");
  });

  it("writes the prop before the value when one is given", () => {
    expect(render(<Captioned knob="size" />).container.textContent).toBe("size = sm");
  });

  it("writes the value in an element of its own", () => {
    const { container } = render(<Captioned knob="size" />);

    expect(container.querySelector("span")?.textContent).toBe("sm");
  });

  it("draws the value as the library's text", () => {
    const { container } = render(<Captioned />);

    expect(recipeClasses(container, "text")).toContain("text");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Captioned, { props: { knob: "size" } }),
    ).resolves.toStrictEqual([]);
  });
});
