import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Action } from "#switcher/action.tsx";
import { Root } from "#switcher/root.tsx";
import { CHOICES } from "#switcher/switcher.fixtures.tsx";

describe("Action", () => {
  it("renders a menu item with its icon before its words", async () => {
    await drawn(
      <Root defaultOpen items={CHOICES} label="Workspace">
        <Action icon="+">New workspace</Action>
      </Root>,
    );

    expect(screen.getByRole("menuitem").textContent).toBe("+New workspace");
  });

  it("calls onClick when chosen", async () => {
    const heard: string[] = [];

    await drawn(
      <Root defaultOpen items={CHOICES} label="Workspace">
        <Action
          onClick={() => {
            heard.push("new");
          }}
        >
          New workspace
        </Action>
      </Root>,
    );
    await pressed(screen.getByRole("menuitem"));

    expect(heard).toStrictEqual(["new"]);
  });

  it("identifies the row by the caller's value", async () => {
    await drawn(
      <Root defaultOpen items={CHOICES} label="Workspace">
        <Action value="create">New workspace</Action>
      </Root>,
    );

    expect(screen.getByRole("menuitem").dataset["value"]).toBe("create");
  });
});
