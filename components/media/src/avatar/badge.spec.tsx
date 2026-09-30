import { type ReactElement } from "react";

import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { NAME } from "#avatar/avatar.fixtures.tsx";
import { Badge } from "#avatar/badge.tsx";
import { Fallback } from "#avatar/fallback.tsx";
import { Root } from "#avatar/root.tsx";

/**
 * Label of the badge every case shows.
 */
const ONLINE = "Online";

/**
 * Renders an avatar whose labelled badge renders only while `shown` is true.
 */
function Toggled({ shown }: { readonly shown: boolean }): ReactElement {
  return (
    <Root name={NAME}>
      <Fallback />
      {shown ? <Badge label={ONLINE} palette="success" /> : null}
    </Root>
  );
}

describe("Badge", () => {
  it("renders a SPAN with the avatar-badge class", async () => {
    await drawn(<Toggled shown />);

    expect(screen.getByRole("img", { name: ONLINE }).className).toContain("avatar-badge");
  });

  it("names itself by label as an image", async () => {
    await drawn(<Toggled shown />);

    expect(screen.getByRole("img", { name: ONLINE }).tagName).toBe("SPAN");
  });

  it("describes the avatar by its label", async () => {
    await drawn(<Toggled shown />);

    expect(screen.getByRole("img", { name: NAME }).getAttribute("aria-describedby")).toBe(
      screen.getByRole("img", { name: ONLINE }).id,
    );
  });

  it("stops describing the avatar once it unmounts", async () => {
    const { rerender } = await drawn(<Toggled shown />);

    await act(async () => {
      rerender(<Toggled shown={false} />);
      await Promise.resolve();
    });

    expect(screen.getByRole("img", { name: NAME }).getAttribute("aria-describedby")).toBeNull();
  });

  it("hides itself from screen readers without a label", async () => {
    const { container } = await drawn(
      <Root name={NAME}>
        <Badge>3</Badge>
      </Root>,
    );

    expect(container.querySelector(".avatar-badge")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the avatar undescribed without a label", async () => {
    const { container } = await drawn(
      <Root name={NAME}>
        <Badge>3</Badge>
      </Root>,
    );

    expect(slotElement(container, "avatar", "root").getAttribute("aria-describedby")).toBeNull();
  });

  it("renders outside an avatar without describing anything", async () => {
    await drawn(<Badge label={ONLINE} />);

    expect(screen.getByRole("img", { name: ONLINE })).toBeDefined();
  });

  it("returns no accessibility violation for an avatar with a labelled badge", async () => {
    await expect(accessibilityViolations(() => <Toggled shown />)).resolves.toStrictEqual([]);
  });
});
