import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { framed, opened, picked, trigger } from "#select/select.fixtures.tsx";

/**
 * Presses a key on the focused trigger and waits for the machine.
 */
async function keyed(key: string): Promise<void> {
  trigger().focus();
  fireEvent.keyDown(trigger(), { key });
  await settled();
  await framed();
}

describe("Trigger", () => {
  it("renders a button with role combobox", async () => {
    await drawn(picked());

    expect(trigger().tagName).toBe("BUTTON");
  });

  it("sets aria-expanded to false while the panel is closed", async () => {
    await drawn(picked());

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("sets aria-expanded to true while the panel is open", async () => {
    await drawn(picked());
    await opened();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("names itself by the field's label without its own", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Role</Field.Label>
        {picked({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("combobox", { name: "Role" })).toBe(trigger());
  });

  it("sets no aria-labelledby without a label", async () => {
    await drawn(picked({}, { labelled: false }));

    expect(trigger().hasAttribute("aria-labelledby")).toBe(false);
  });

  it("describes itself by the field's helper and error texts", async () => {
    await drawn(<Field.Root id="role">{picked({}, { labelled: false })}</Field.Root>);

    expect(trigger().getAttribute("aria-describedby")).toBe("role-helper role-error");
  });

  it("opens the panel on ArrowDown", async () => {
    await drawn(picked());
    await keyed("ArrowDown");

    expect(screen.getByRole("listbox")).toBeDefined();
  });

  it("highlights the first row when ArrowDown opens the panel", async () => {
    await drawn(picked());
    await keyed("ArrowDown");

    expect(screen.getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Bridge Ledger" }).id,
    );
  });

  it("selects the next row with ArrowRight while the panel is closed", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await keyed("ArrowRight");

    expect(trigger().textContent).toBe("Halden & Co");
  });

  it("selects a row by a typed letter while the panel is closed", async () => {
    await drawn(picked());
    await keyed("p");

    expect(trigger().textContent).toBe("Perrin Freight");
  });

  it("sets disabled while disabled", async () => {
    await drawn(picked({ disabled: true }));

    expect(trigger().hasAttribute("disabled")).toBe(true);
  });

  it("opens nothing on a press while read-only", async () => {
    await drawn(picked({ readOnly: true }));
    await pressed(trigger());
    await settled();

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
});
