import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Action } from "#page/action.tsx";
import { Actions } from "#page/actions.tsx";
import { paged } from "#page/page.fixtures.tsx";

/**
 * Renders an empty `svg` in place of an icon.
 */
const ICON = <svg aria-hidden="true" data-testid="icon" />;

describe("Action", () => {
  it("renders a button", () => {
    render(paged(<Action primary>Send</Action>));

    expect(screen.getByRole("button", { name: "Send" })).toBeTruthy();
  });

  it("sets type button", () => {
    render(paged(<Action primary>Send</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("applies the recipe's action class", () => {
    const { container } = render(paged(<Action primary>Send</Action>));

    expect(slotElement(container, "page", "action").tagName).toBe("BUTTON");
  });

  it("sets data-priority to tertiary for an action without an icon", () => {
    render(paged(<Action>Archive</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("tertiary");
  });

  it("sets data-priority to secondary for an action with an icon", () => {
    render(paged(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("secondary");
  });

  it("sets data-priority to primary for a primary action", () => {
    render(paged(<Action primary>Send</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("primary");
  });

  it("sets data-priority to its stated priority", () => {
    render(
      paged(
        <Action icon={ICON} priority="tertiary">
          Archive
        </Action>,
      ),
    );

    expect(screen.getByRole("button").dataset["priority"]).toBe("tertiary");
  });

  it("renders solid when primary", () => {
    render(paged(<Action primary>Send</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "solid"),
    );
  });

  it("renders outline when not primary", () => {
    render(paged(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "outline"),
    );
  });

  it("renders at the page's size", () => {
    render(paged(<Action primary>Send</Action>, { size: "lg" }));

    expect(screen.getByRole("button").classList).toContain(variantClass("button", "size", "lg"));
  });

  it("renders one size smaller on a narrow page", () => {
    render(narrowed(paged(<Action primary>Send</Action>)));

    expect(screen.getByRole("button").classList).toContain(variantClass("button", "size", "sm"));
  });

  it("wraps the words after an icon in a span", () => {
    render(paged(<Action icon={ICON}>Download</Action>));

    expect(screen.getByText("Download").tagName).toBe("SPAN");
  });

  it("renders nothing for a tertiary action on a narrow page", () => {
    render(
      narrowed(
        paged(
          <Actions>
            <Action>Archive</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "Archive" })).toBeNull();
  });

  it("keeps a secondary action on a narrow page", () => {
    render(narrowed(paged(<Action icon={ICON}>Download</Action>)));

    expect(screen.getByRole("button", { name: "Download" })).toBeTruthy();
  });

  it("writes data-narrow on a narrow page", () => {
    render(narrowed(paged(<Action icon={ICON}>Download</Action>)));

    expect(screen.getByRole("button").dataset["narrow"]).toBe("");
  });

  it("omits data-narrow on a wide page", () => {
    render(paged(<Action icon={ICON}>Download</Action>));

    expect(screen.getByRole("button").dataset["narrow"]).toBeUndefined();
  });

  it("renders another control passed as as without the button's look", () => {
    render(
      paged(
        <Action as="span" primary>
          Invoices
        </Action>,
      ),
    );

    expect(screen.getByText("Invoices").classList).not.toContain(
      variantClass("button", "variant", "solid"),
    );
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn<() => void>();

    render(
      paged(
        <Action onClick={onClick} primary>
          Send
        </Action>,
      ),
    );
    screen.getByRole("button").click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(
      narrowed(
        paged(
          <Action icon={ICON} when="wide">
            Download
          </Action>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "Download" })).toBeNull();
  });

  it("takes no row in the menu while when hides it", () => {
    render(
      narrowed(
        paged(
          <Actions>
            <Action when="wide">Archive</Action>
          </Actions>,
        ),
      ),
    );

    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });
});
