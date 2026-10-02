import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, opened } from "#editable/editable.fixtures.tsx";
import { type ValueChangeDetails } from "#editable/machine.ts";

describe("CancelTrigger", () => {
  it("stays hidden while the preview shows", async () => {
    await drawn(composed());

    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("is named Cancel while the field is open", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined();
  });

  it("restores the value from before editing on a press", async () => {
    const reverted = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueRevert: reverted }));
    await opened();
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "Halden & Co" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await settled();

    expect(reverted).toHaveBeenCalledWith({ value: "Bridge Ledger" });
  });
});
