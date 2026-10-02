import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, framed, opened, preview } from "#editable/editable.fixtures.tsx";
import * as Field from "#field/index.ts";

describe("Preview", () => {
  it("renders the value in the button role", async () => {
    await drawn(composed());

    expect(preview().tagName).toBe("SPAN");
  });

  it("takes its name from the label and its own text", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Workspace name Bridge Ledger" })).toBeDefined();
  });

  it("takes its name from its own text without a label", async () => {
    await drawn(composed({}, { labelled: false }));

    expect(screen.getByRole("button", { name: "Bridge Ledger" })).toBeDefined();
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Workspace</Field.Label>
        {composed({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("button", { name: "Workspace Bridge Ledger" })).toBeDefined();
  });

  it("is in the tab order", async () => {
    await drawn(composed());

    expect(preview().tabIndex).toBe(0);
  });

  it("opens the field on Enter", async () => {
    await drawn(composed());
    await opened();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("opens the field on Space", async () => {
    await drawn(composed());
    fireEvent.keyDown(preview(), { key: " " });
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("ignores other keys", async () => {
    await drawn(composed());
    fireEvent.keyDown(preview(), { key: "a" });
    await settled();

    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("opens the field on a press by default", async () => {
    await drawn(composed());
    fireEvent.click(preview());
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("opens the field on a double press when activationMode is dblclick", async () => {
    await drawn(composed({ activationMode: "dblclick" }));
    fireEvent.doubleClick(preview());
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("shows the placeholder while the value is empty", async () => {
    await drawn(composed({ defaultValue: "", placeholder: "Name the workspace" }));

    expect(
      screen.getByRole("button", { name: /Name the workspace/u }).dataset["placeholderShown"],
    ).toBe("");
  });

  it("renders plain text without a role in a read-only editable", async () => {
    const { container } = await drawn(composed({ readOnly: true }));

    expect(slotElement(container, "editable", "preview").getAttribute("role")).toBeNull();
  });

  it("leaves out the machine's aria-readonly", async () => {
    const { container } = await drawn(composed({ readOnly: true }));

    expect(slotElement(container, "editable", "preview").getAttribute("aria-readonly")).toBeNull();
  });

  it("returns focus to itself after Enter without an edit trigger", async () => {
    await drawn(composed({}, { triggered: false }));
    await opened();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();
    await framed();

    expect(document.activeElement).toBe(preview());
  });
});
