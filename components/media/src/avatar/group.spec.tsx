import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { NAME } from "#avatar/avatar.fixtures.tsx";
import { Fallback } from "#avatar/fallback.tsx";
import { Group } from "#avatar/group.tsx";
import { Root } from "#avatar/root.tsx";

describe("Group", () => {
  it("renders a SPAN for the group slot", async () => {
    const { container } = await drawn(<Group />);

    expect(slotElement(container, "avatar", "group").tagName).toBe("SPAN");
  });

  it("returns no accessibility violation for a group with a count", async () => {
    await expect(
      accessibilityViolations(() => (
        <Group>
          <Root name={NAME}>
            <Fallback />
          </Root>
          <Root name="3 more">
            <Fallback>+3</Fallback>
          </Root>
        </Group>
      )),
    ).resolves.toStrictEqual([]);
  });

  it.each([
    { axis: "palette", value: "primary" },
    { axis: "shape", value: "square" },
    { axis: "variant", value: "solid" },
  ] as const)("gives its $axis to the avatars in it", async ({ axis, value }) => {
    const { container } = await drawn(
      <Group {...{ [axis]: value }}>
        <Root name={NAME} />
      </Group>,
    );

    expect(slotElement(container, "avatar", "root").className).toContain(
      variantClass("avatar__root", axis, value),
    );
  });
});
