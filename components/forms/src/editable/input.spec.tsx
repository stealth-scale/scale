import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, framed, opened } from "#editable/editable.fixtures.tsx";
import { type ValueChangeDetails } from "#editable/machine.ts";
import * as Field from "#field/index.ts";

describe("Input", () => {
  it("stays hidden while the preview shows", async () => {
    await drawn(composed());

    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("takes its name from the label", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("textbox", { name: "Workspace name" })).toBeDefined();
  });

  it("leaves out the machine's aria-label", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("textbox").getAttribute("aria-label")).toBeNull();
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Workspace</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );
    await opened();

    expect(screen.getByRole("textbox", { name: "Workspace" })).toBeDefined();
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="workspace">
        {composed({}, { labelled: false })}
        <Field.HelperText>Shown on invoices.</Field.HelperText>
      </Field.Root>,
    );
    await opened();

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")?.split(" ")).toStrictEqual([
      "workspace-helper",
      "workspace-error",
    ]);
  });

  it("sets no aria-describedby outside a field", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("saves the value on Enter", async () => {
    const committed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueCommit: committed }));
    await opened();
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "Halden & Co" } });
    await settled();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();

    expect(committed).toHaveBeenCalledWith({ value: "Halden & Co" });
  });

  it("restores the value from before editing on Escape", async () => {
    await drawn(composed());
    await opened();
    fireEvent.input(screen.getByRole("textbox"), { target: { value: "Halden & Co" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
    await settled();

    expect(screen.getByRole("button", { name: /Bridge Ledger/u })).toBeDefined();
  });

  it("returns focus to the edit trigger after Enter", async () => {
    await drawn(composed());
    await opened();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit" }));
  });
});
