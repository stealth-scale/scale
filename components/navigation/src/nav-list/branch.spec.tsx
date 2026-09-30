import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createFilterScope, FilterContext } from "@stealthscale/hooks";
import { drawn, pressed } from "@stealthscale/testing-react";
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

  it("keeps the branch closed on a press when open is false", async () => {
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

  it("opens while the query of its scope is active", async () => {
    const scope = createFilterScope();

    await drawn(
      <FilterContext value={scope}>
        {branched(
          <>
            <Trigger>Settings</Trigger>
            <Content>Team</Content>
          </>,
        )}
      </FilterContext>,
    );
    await act(async () => {
      scope.setQuery("team");
      await Promise.resolve();
    });

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("stays open when the query clears on a branch that started open", async () => {
    const scope = createFilterScope();

    await drawn(
      <FilterContext value={scope}>
        {branched(
          <>
            <Trigger>Settings</Trigger>
            <Content>Team</Content>
          </>,
          { defaultOpen: true },
        )}
      </FilterContext>,
    );
    await act(async () => {
      scope.setQuery("team");
      await Promise.resolve();
    });
    await act(async () => {
      scope.setQuery("");
      await Promise.resolve();
    });

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes when the query clears on a branch that started closed", async () => {
    const scope = createFilterScope();

    await drawn(
      <FilterContext value={scope}>
        {branched(
          <>
            <Trigger>Settings</Trigger>
            <Content>Team</Content>
          </>,
        )}
      </FilterContext>,
    );
    await act(async () => {
      scope.setQuery("team");
      await Promise.resolve();
    });
    await act(async () => {
      scope.setQuery("");
      await Promise.resolve();
    });

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("stays open on a press while the query of its scope is active", async () => {
    const scope = createFilterScope();

    await drawn(
      <FilterContext value={scope}>
        {branched(
          <>
            <Trigger>Settings</Trigger>
            <Content>Team</Content>
          </>,
        )}
      </FilterContext>,
    );
    await act(async () => {
      scope.setQuery("team");
      await Promise.resolve();
    });
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("hides the branch while the query of its scope is not in its words", async () => {
    const scope = createFilterScope();

    await drawn(
      <FilterContext value={scope}>{branched(<Trigger>Settings</Trigger>)}</FilterContext>,
    );
    await act(async () => {
      scope.setQuery("billing");
      await Promise.resolve();
    });

    expect(screen.getByRole("listitem", { hidden: true }).hasAttribute("hidden")).toBe(true);
  });

  it("keeps the hidden attribute a caller sets", () => {
    render(branched(<Trigger>Settings</Trigger>, { hidden: true }));

    expect(screen.getByRole("listitem", { hidden: true }).hasAttribute("hidden")).toBe(true);
  });
});
