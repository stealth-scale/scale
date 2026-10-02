import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { NAME, pictured } from "#avatar/avatar.fixtures.tsx";
import { Group } from "#avatar/group.tsx";
import { recipe } from "#avatar/recipe.ts";
import { Root, type RootProps } from "#avatar/root.tsx";

describe("Root", () => {
  it("renders a SPAN for the root slot", async () => {
    const { container } = await drawn(pictured());

    expect(slotElement(container, "avatar", "root").tagName).toBe("SPAN");
  });

  it("returns no accessibility violation for a named avatar with a picture", async () => {
    await expect(accessibilityViolations(() => pictured())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(pictured(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("names the avatar by name as an image", async () => {
    await drawn(pictured());

    expect(screen.getByRole("img", { name: NAME })).toBeDefined();
  });

  it("renders no role without a name", async () => {
    const { container } = await drawn(<Root />);

    expect(slotElement(container, "avatar", "root").getAttribute("role")).toBeNull();
  });

  it("takes the size of the group it is in", async () => {
    const { container } = await drawn(
      <Group size="lg">
        <Root name={NAME} />
      </Group>,
    );

    expect(slotElement(container, "avatar", "root").className).toContain(
      variantClass("avatar__root", "size", "lg"),
    );
  });

  it("keeps its own size over the group's", async () => {
    const { container } = await drawn(
      <Group size="lg">
        <Root name={NAME} size="xs" />
      </Group>,
    );

    expect(slotElement(container, "avatar", "root").className).toContain(
      variantClass("avatar__root", "size", "xs"),
    );
  });

  it("calls onStatusChange with loaded when the picture loads", async () => {
    const told = vi.fn<(details: { readonly status: string }) => void>();
    const { container } = await drawn(pictured({ onStatusChange: told }));

    await act(async () => {
      fireEvent.load(slotElement(container, "avatar", "image"));
      await Promise.resolve();
    });

    expect(told).toHaveBeenLastCalledWith({ status: "loaded" });
  });
});
