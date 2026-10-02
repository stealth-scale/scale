import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Action } from "#page/action.tsx";
import { Actions } from "#page/actions.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Actions", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Actions>controls</Actions>));

    expect(slotElement(container, "page", "actions").tagName).toBe("DIV");
  });

  it("renders its controls", () => {
    render(
      paged(
        <Actions>
          <button type="button">Download</button>
        </Actions>,
      ),
    );

    expect(screen.getByRole("button", { name: "Download" })).toBeTruthy();
  });

  it("renders no menu on a wide page", () => {
    render(
      paged(
        <Actions>
          <Action>Archive</Action>
        </Actions>,
      ),
    );

    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("renders no menu on a narrow page that folds nothing", () => {
    render(
      narrowed(
        paged(
          <Actions>
            <Action primary>Send</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("renders the menu's trigger after the actions on a narrow page with a tertiary action", () => {
    render(
      narrowed(
        paged(
          <Actions>
            <Action>Archive</Action>
            <Action primary>Send</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toStrictEqual([
      "Send",
      "More actions",
    ]);
  });

  it("names the menu with more", () => {
    render(
      narrowed(
        paged(
          <Actions more="More invoice actions" moreIcon={<svg aria-hidden="true" />}>
            <Action>Archive</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.getByRole("button", { name: "More invoice actions" })).toBeTruthy();
  });

  it("renders the trigger at the actions' size", () => {
    render(
      narrowed(
        paged(
          <Actions>
            <Action>Archive</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.getByRole("button", { name: "More actions" }).classList).toContain(
      variantClass("button", "size", "sm"),
    );
  });

  it("runs a folded action's onClick from its menu row", async () => {
    const onClick = vi.fn<() => void>();

    await drawn(
      narrowed(
        paged(
          <Actions>
            <Action onClick={onClick}>Archive</Action>
          </Actions>,
        ),
      ),
    );
    await pressed(screen.getByRole("button", { name: "More actions" }));
    await pressed(screen.getByRole("menuitem", { name: "Archive" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(
      narrowed(
        paged(
          <Actions when="wide">
            <button type="button">Download</button>
          </Actions>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "Download" })).toBeNull();
  });
});
