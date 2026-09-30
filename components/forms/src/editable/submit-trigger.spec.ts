import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, opened } from "#editable/editable.fixtures.tsx";
import { type ValueChangeDetails } from "#editable/machine.ts";

describe("SubmitTrigger", () => {
  it("stays hidden while the preview shows", async () => {
    await drawn(composed());

    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
  });

  it("is named Save while the field is open", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("saves the value on a press", async () => {
    const committed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueCommit: committed }));
    await opened();
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "Halden & Co" } });
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await settled();

    expect(committed).toHaveBeenCalledWith({ value: "Halden & Co" });
  });

  it("takes its name from label", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("button", { name: "Save" }).getAttribute("aria-label")).toBe("Save");
  });
});
