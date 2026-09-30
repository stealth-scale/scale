import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { barred } from "#action-bar/action-bar.fixtures.tsx";
import { CloseTrigger, Content, Positioner, Root } from "#action-bar/index.ts";
import { type OpenChangeDetails } from "#action-bar/root.tsx";
import * as Toolbar from "#toolbar/index.ts";

describe("CloseTrigger", () => {
  it("renders a button named by aria-label", async () => {
    await drawn(barred());

    expect(screen.getByRole("button", { name: "Clear selection" }).tagName).toBe("BUTTON");
  });

  it("calls onOpenChange with open false on a press", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(barred({ onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Clear selection" }));

    expect(told).toHaveBeenCalledExactlyOnceWith({ open: false });
  });

  it("calls the caller's onClick", async () => {
    const clicked = vi.fn<() => void>();

    await drawn(
      <Root open>
        <Positioner>
          <Content>
            <Toolbar.Root aria-label="Actions">
              <CloseTrigger aria-label="Clear selection" onClick={clicked}>
                x
              </CloseTrigger>
            </Toolbar.Root>
          </Content>
        </Positioner>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Clear selection" }));

    expect(clicked).toHaveBeenCalledOnce();
  });

  it("keeps the bar open when the caller's onClick prevents it", async () => {
    const told = vi.fn<(details: OpenChangeDetails) => void>();

    await drawn(
      <Root onOpenChange={told} open>
        <Positioner>
          <Content>
            <Toolbar.Root aria-label="Actions">
              <CloseTrigger
                aria-label="Clear selection"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                x
              </CloseTrigger>
            </Toolbar.Root>
          </Content>
        </Positioner>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Clear selection" }));

    expect(told).not.toHaveBeenCalled();
  });
});
