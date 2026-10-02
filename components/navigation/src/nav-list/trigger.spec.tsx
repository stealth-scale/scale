import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#nav-list/content.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

describe("Trigger", () => {
  it("renders a BUTTON element inside a branch", () => {
    const { container } = render(branched(<Trigger>Settings</Trigger>));

    expect(slotElement(container, "nav-list", "trigger").tagName).toBe("BUTTON");
  });

  it("sets type to button", () => {
    render(branched(<Trigger>Settings</Trigger>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("sets aria-controls to the content id", () => {
    const { container } = render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBe(
      slotElement(container, "nav-list", "content").id,
    );
  });

  it("keeps the caller's onClick handler when it opens the branch", async () => {
    const heard = vi.fn<() => void>();

    render(branched(<Trigger onClick={heard}>Settings</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("throws an error naming NavList.Branch when rendered outside a branch", () => {
    expect(rootedViolations({ Trigger }, /NavList.Branch/u)).toStrictEqual([]);
  });
});
