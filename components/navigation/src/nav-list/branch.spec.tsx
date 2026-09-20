import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Branch } from "#nav-list/branch.tsx";
import { Content } from "#nav-list/content.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";
import { Root } from "#nav-list/root.ts";
import { Trigger } from "#nav-list/trigger.tsx";

describe("Branch", () => {
  it("draws a list item inside the list it needs above it", () => {
    const { container } = render(branched(<Trigger>Settings</Trigger>));

    expect(slotElement(container, "nav-list", "branch").tagName).toBe("LI");
  });

  it("keeps its list closed where a caller says nothing", () => {
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

  it("opens its list where a caller asks it to start open", () => {
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

  it("opens its list when the trigger is pressed", async () => {
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

  it("reports the state it moved to", async () => {
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

  it("stays where a caller holding the state puts it", async () => {
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

  it("builds the reference between the row and its list from the id a caller names", () => {
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

  it("generates an id where a caller names none", () => {
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
