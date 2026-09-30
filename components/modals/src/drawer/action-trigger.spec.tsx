import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ActionTrigger } from "#drawer/action-trigger.tsx";
import { CloseTrigger } from "#drawer/close-trigger.tsx";
import { opened } from "#drawer/drawer.fixtures.tsx";

describe("ActionTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<ActionTrigger>Apply</ActionTrigger>));

    expect(slotElement(container, "drawer", "actionTrigger").tagName).toBe("BUTTON");
  });

  it("closes the drawer on a press", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(opened(<ActionTrigger>Apply</ActionTrigger>, { onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Apply" }));

    expect(told).toHaveBeenLastCalledWith({ open: false });
  });

  it("keeps the drawer open when a caller's onClick prevents the default", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(
      opened(
        <ActionTrigger
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Apply
        </ActionTrigger>,
        { onOpenChange: told },
      ),
    );
    await pressed(screen.getByRole("button", { name: "Apply" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("takes no id from the machine", async () => {
    await drawn(opened(<ActionTrigger>Apply</ActionTrigger>));

    expect(screen.getByRole("button", { name: "Apply" }).hasAttribute("id")).toBe(false);
  });

  it("takes no part attribute from the machine", async () => {
    await drawn(opened(<ActionTrigger>Apply</ActionTrigger>));

    expect(screen.getByRole("button", { name: "Apply" }).dataset["part"]).toBeUndefined();
  });

  it("leaves the close trigger the one element with the close id", async () => {
    const { container } = await drawn(
      opened(
        <>
          <ActionTrigger>Apply</ActionTrigger>
          <CloseTrigger aria-label="Close" />
        </>,
        { id: "filters" },
      ),
    );

    expect(container.ownerDocument.querySelectorAll('[id="dialog:filters:close"]')).toHaveLength(1);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<ActionTrigger as="a">Apply</ActionTrigger>));

    expect(slotElement(container, "drawer", "actionTrigger").tagName).toBe("A");
  });
});
