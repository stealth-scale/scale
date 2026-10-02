import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { ClearTrigger } from "#tags-input/clear-trigger.tsx";
import { Control } from "#tags-input/control.tsx";
import { Input } from "#tags-input/input.tsx";
import { Root } from "#tags-input/root.tsx";
import { ACCOUNTS, composed, field, framed, tags } from "#tags-input/tags-input.fixtures.tsx";

/**
 * Returns the clear trigger, found by its default name.
 */
function clearer(): HTMLButtonElement {
  return screen.getByRole<HTMLButtonElement>("button", { name: "Clear all" });
}

describe("ClearTrigger", () => {
  it("names the button Clear all", async () => {
    await drawn(composed());

    expect(clearer().tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root defaultValue={ACCOUNTS}>
        <Control>
          <Input aria-label="Accounts" />
          <ClearTrigger label="Remove every account" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Remove every account" })).toBeDefined();
  });

  it("leaves its tab index unset", async () => {
    await drawn(composed());

    expect(clearer().getAttribute("tabindex")).toBeNull();
  });

  it("removes every tag on a press", async () => {
    const { container } = await drawn(composed());

    fireEvent.click(clearer());
    await settled();

    expect(tags(container)).toStrictEqual([]);
  });

  it("moves focus to the input after a press", async () => {
    await drawn(composed());
    fireEvent.click(clearer());
    await settled();
    await framed();

    expect(document.activeElement).toBe(field());
  });

  it("hides itself while there are no tags", async () => {
    await drawn(composed({ defaultValue: [] }));

    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
  });

  it("hides itself in a read-only tags input", async () => {
    await drawn(composed({ readOnly: true }));

    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
  });
});
