import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ActionTrigger } from "#dialog/action-trigger.tsx";
import { CloseTrigger } from "#dialog/close-trigger.tsx";
import { opened } from "#dialog/dialog.fixtures.tsx";

describe("ActionTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<ActionTrigger>Cancel</ActionTrigger>));

    expect(slotElement(container, "dialog", "actionTrigger").tagName).toBe("BUTTON");
  });

  it("sets type button", async () => {
    await drawn(opened(<ActionTrigger>Cancel</ActionTrigger>));

    expect(screen.getByRole("button", { name: "Cancel" }).getAttribute("type")).toBe("button");
  });

  it("closes the dialog on a press", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(opened(<ActionTrigger>Cancel</ActionTrigger>, { onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Cancel" }));

    expect(told).toHaveBeenLastCalledWith({ open: false });
  });

  it("keeps the dialog open when a caller's onClick prevents the default", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(
      opened(
        <ActionTrigger
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Cancel
        </ActionTrigger>,
        { onOpenChange: told },
      ),
    );
    await pressed(screen.getByRole("button", { name: "Cancel" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("takes no id from the machine", async () => {
    await drawn(opened(<ActionTrigger>Cancel</ActionTrigger>));

    expect(screen.getByRole("button", { name: "Cancel" }).hasAttribute("id")).toBe(false);
  });

  it("takes no part attribute from the machine", async () => {
    await drawn(opened(<ActionTrigger>Cancel</ActionTrigger>));

    expect(screen.getByRole("button", { name: "Cancel" }).dataset["part"]).toBeUndefined();
  });

  it("leaves the close trigger the one element with the close id", async () => {
    const { container } = await drawn(
      opened(
        <>
          <ActionTrigger>Cancel</ActionTrigger>
          <CloseTrigger aria-label="Close" />
        </>,
        { id: "rename" },
      ),
    );

    expect(container.ownerDocument.querySelectorAll('[id="dialog:rename:close"]')).toHaveLength(1);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<ActionTrigger as="a">Cancel</ActionTrigger>));

    expect(slotElement(container, "dialog", "actionTrigger").tagName).toBe("A");
  });
});
