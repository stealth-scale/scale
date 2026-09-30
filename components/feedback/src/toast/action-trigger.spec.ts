import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { framed, raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("ActionTrigger", () => {
  it("renders a button", async () => {
    const toaster = toasterOf();
    const { container } = await drawn(regioned(toaster));

    await raised(toaster, {
      action: { label: "Undo", onClick: vi.fn<() => void>() },
      title: "Removed",
    });

    expect(slotElement(container, "toast", "actionTrigger").tagName).toBe("BUTTON");
  });

  it("calls the action's onClick on a press", async () => {
    const undone = vi.fn<() => void>();
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { action: { label: "Undo", onClick: undone }, title: "Removed" });
    await pressed(screen.getByRole("button", { name: "Undo" }));

    expect(undone).toHaveBeenCalledExactlyOnceWith();
  });

  it("dismisses the toast on a press", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, {
      action: { label: "Undo", onClick: vi.fn<() => void>() },
      duration: Number.POSITIVE_INFINITY,
      title: "Removed",
    });
    await pressed(screen.getByRole("button", { name: "Undo" }));
    await framed();

    expect(screen.getByRole("status").dataset["state"]).toBe("closed");
  });
});
