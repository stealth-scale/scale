import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, opened } from "#editable/editable.fixtures.tsx";
import { type ValueChangeDetails } from "#editable/machine.ts";
import * as Field from "#field/index.ts";

describe("Textarea", () => {
  it("renders a textarea named by the label", async () => {
    await drawn(composed({}, { lines: true }));
    await opened();

    expect(screen.getByRole("textbox", { name: "Workspace name" }).tagName).toBe("TEXTAREA");
  });

  it("keeps editing on Enter alone", async () => {
    const committed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueCommit: committed }, { lines: true }));
    await opened();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();

    expect(committed).not.toHaveBeenCalled();
  });

  it("saves the value on Control and Enter", async () => {
    const committed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueCommit: committed }, { lines: true }));
    await opened();
    fireEvent.keyDown(screen.getByRole("textbox"), { ctrlKey: true, key: "Enter" });
    await settled();

    expect(committed).toHaveBeenCalledWith({ value: "Bridge Ledger" });
  });

  it("lists the field's texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="notes">
        {composed({}, { labelled: false, lines: true })}
        <Field.HelperText>Seen by the courier.</Field.HelperText>
      </Field.Root>,
    );
    await opened();

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      "notes-helper notes-error",
    );
  });

  it("sets no aria-describedby outside a field", async () => {
    await drawn(composed({}, { lines: true }));
    await opened();

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBeNull();
  });
});
