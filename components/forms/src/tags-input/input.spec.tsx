import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import {
  ACCOUNTS,
  composed,
  field,
  focused,
  keyed,
  tags,
  typed,
} from "#tags-input/tags-input.fixtures.tsx";

/**
 * Returns the preview of one tag, found by its text.
 */
function preview(value: string): HTMLElement | null {
  return screen.getByText(value).closest("[data-value]");
}

describe("Input", () => {
  it("adds the typed text as a tag on Enter", async () => {
    const { container } = await drawn(composed());

    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(tags(container)).toStrictEqual([...ACCOUNTS, "Pinecrest"]);
  });

  it("adds the typed text as a tag when the delimiter follows it", async () => {
    const { container } = await drawn(composed());

    await focused();
    await typed("Pinecrest");
    await typed("Pinecrest,");

    expect(tags(container)).toStrictEqual([...ACCOUNTS, "Pinecrest"]);
  });

  it("highlights the last tag on Backspace at the start", async () => {
    await drawn(composed());
    await focused();
    await keyed("Backspace");

    expect(preview("Halden & Co")?.dataset["highlighted"]).toBe("");
  });

  it("removes the highlighted tag on a second Backspace", async () => {
    const { container } = await drawn(composed());

    await focused();
    await keyed("Backspace");
    await keyed("Backspace");

    expect(tags(container)).toStrictEqual(["Bridge Ledger"]);
  });

  it("removes the highlighted tag on Delete", async () => {
    const { container } = await drawn(composed());

    await focused();
    await keyed("Backspace");
    await keyed("Delete");

    expect(tags(container)).toStrictEqual(["Bridge Ledger"]);
  });

  it("moves the highlight to the tag before on ArrowLeft", async () => {
    await drawn(composed());
    await focused();
    await keyed("Backspace");
    await keyed("ArrowLeft");

    expect(preview("Bridge Ledger")?.dataset["highlighted"]).toBe("");
  });

  it("drops the highlight on Escape", async () => {
    await drawn(composed());
    await focused();
    await keyed("Backspace");
    await keyed("Escape");

    expect(preview("Halden & Co")?.dataset["highlighted"]).toBeUndefined();
  });

  it("shows the root's placeholder while there are no tags", async () => {
    await drawn(composed({ defaultValue: [], placeholder: "Add an account" }));

    expect(field().placeholder).toBe("Add an account");
  });

  it("hides the root's placeholder while there are tags", async () => {
    await drawn(composed({ placeholder: "Add an account" }));

    expect(field().placeholder).toBe("");
  });

  it("lists the field's texts in aria-describedby", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accounts</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>Up to five accounts.</Field.HelperText>
      </Field.Root>,
    );

    expect(field().getAttribute("aria-describedby")).toContain(
      screen.getByText("Up to five accounts.").id,
    );
  });

  it("renders a read-only input that takes focus", async () => {
    await drawn(composed({ readOnly: true }));

    expect([field().readOnly, field().disabled]).toStrictEqual([true, false]);
  });

  it("keeps a read-only input disabled when the tags input is disabled", async () => {
    await drawn(composed({ disabled: true, readOnly: true }));

    expect(field().disabled).toBe(true);
  });

  it("cancels Backspace in a read-only input", async () => {
    await drawn(composed({ readOnly: true }));
    await focused();

    expect(fireEvent.keyDown(field(), { key: "Backspace" })).toBe(false);
  });

  it("keeps the tags of a read-only input on Backspace and Delete", async () => {
    const { container } = await drawn(composed({ readOnly: true }));

    await focused();
    await keyed("Backspace");
    await keyed("Delete");

    expect(tags(container)).toStrictEqual(ACCOUNTS);
  });

  it("lets a key that changes no tag through in a read-only input", async () => {
    await drawn(composed({ readOnly: true }));
    await focused();

    expect(fireEvent.keyDown(field(), { key: "Tab" })).toBe(true);
  });
});
