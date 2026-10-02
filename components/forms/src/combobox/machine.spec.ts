import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  accounts,
  hiddenOf,
  input,
  keyed,
  left,
  opened,
  picked,
  typed,
} from "#combobox/combobox.fixtures.tsx";
import { optionIds, splitComboboxProps } from "#combobox/machine.ts";

describe("machine", () => {
  it("builds a row's ID from its encoded value", () => {
    expect(optionIds("account")("perrin partners")).toBe(
      "combobox:account:option:perrin%20partners",
    );
  });

  it("gives a row whose value has a space one valid ID", async () => {
    await drawn(picked({ id: "account" }));
    await opened();

    expect(screen.getByRole("option", { name: "Perrin Freight" }).id).toBe(
      "combobox:account:option:perrin%20partners",
    );
  });

  it("gives the label the caller's ID", async () => {
    await drawn(picked({ ids: { label: "account-label" } }));

    expect(screen.getByText("Account").id).toBe("account-label");
  });

  it("gives the input the caller's ID", async () => {
    await drawn(picked({ ids: { input: "account-input" } }));

    expect(input().id).toBe("account-input");
  });

  it("clears the value of a single combobox once its text is emptied", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"] }));

    await typed("");

    expect(hiddenOf(container).value).toBe("");
  });

  it("reports no change when the text of a combobox without a value is emptied", async () => {
    const changed = vi.fn<(details: { value: string[] }) => void>();

    await drawn(picked({ onValueChange: changed }));
    await typed("ha");
    await typed("");

    expect(changed).not.toHaveBeenCalled();
  });

  it("keeps the value while text remains", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"] }));

    await typed("Hal");

    expect(hiddenOf(container).value).toBe("halden");
  });

  it("keeps the values of a multiple combobox once its text is emptied", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"], multiple: true }));

    await typed("br");
    await typed("");

    expect([...hiddenOf(container).selectedOptions].map((option) => option.value)).toStrictEqual([
      "halden",
    ]);
  });

  it("restores the value's text when the input loses focus with a text that matches no pick", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await typed("Halx");
    await keyed("Escape");
    await left();

    expect(input().value).toBe("Halden & Co");
  });

  it("clears the text of a multiple combobox when the input loses focus", async () => {
    await drawn(picked({ defaultValue: ["halden"], multiple: true }));
    await typed("br");
    await keyed("Escape");
    await left();

    expect(input().value).toBe("");
  });

  it("keeps a custom text when the input loses focus while custom values are allowed", async () => {
    await drawn(picked({ allowCustomValue: true }));
    await typed("Orbit");
    await keyed("Escape");
    await left();

    expect(input().value).toBe("Orbit");
  });

  it("keeps the text when the input loses focus with selectionBehavior preserve", async () => {
    await drawn(picked({ selectionBehavior: "preserve" }));
    await typed("Orbit");
    await keyed("Escape");
    await left();

    expect(input().value).toBe("Orbit");
  });

  it("keeps the value's text when the input loses focus", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await typed("Halden & Co");
    await left();

    expect(input().value).toBe("Halden & Co");
  });

  it("splits the machine's options from the element's props", () => {
    const collection = accounts();

    expect(splitComboboxProps({ collection, title: "Account" })).toStrictEqual([
      { collection },
      { title: "Account" },
    ]);
  });

  it("drops translations and composite from the machine's options", () => {
    const collection = accounts();

    expect(
      splitComboboxProps({
        collection,
        composite: false,
        translations: { clearTriggerLabel: "Clear" },
      })[0],
    ).toStrictEqual({ collection });
  });
});
