import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Branch } from "#nav-list/branch.tsx";
import { Content } from "#nav-list/content.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";
import { Root } from "#nav-list/root.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

describe("Branch", () => {
  it("renders an LI element inside a list", () => {
    const { container } = render(branched(<Trigger>Settings</Trigger>));

    expect(slotElement(container, "nav-list", "branch").tagName).toBe("LI");
  });

  it("starts closed when defaultOpen is absent", () => {
    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("starts open when defaultOpen is true", () => {
    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
        { defaultOpen: true },
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens when the trigger is pressed", async () => {
    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
      ),
    );
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("calls onOpenChange with the new open state", async () => {
    const heard = vi.fn<(details: { readonly open: boolean }) => void>();

    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
        { onOpenChange: heard },
      ),
    );
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("stays closed on a press when open is false", async () => {
    render(
      <Root>
        <Branch open={false}>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </Branch>
      </Root>,
    );
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("builds aria-controls from the id the caller passes", () => {
    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
        { defaultOpen: true, id: "settings-rows" },
      ),
    );

    const named = screen.getByRole("button").getAttribute("aria-controls");

    expect(named).toContain("settings-rows");
    expect(screen.getAllByRole("list").map((list) => list.id)).toContain(named);
  });

  it("sets aria-controls when the caller passes no id", () => {
    render(
      branched(
        <>
          <Trigger>Settings</Trigger>
          <Content>rows</Content>
        </>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
  });
});
