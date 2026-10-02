import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { optionIds, splitSelectProps } from "#select/machine.ts";
import { accounts, opened, picked } from "#select/select.fixtures.tsx";

describe("machine", () => {
  it("builds a row's ID from its encoded value", () => {
    expect(optionIds("account")("perrin partners")).toBe("select:account:option:perrin%20partners");
  });

  it("gives a row whose value has a space one valid ID", async () => {
    await drawn(picked({ id: "account" }));
    await opened();

    expect(screen.getByRole("option", { name: "Perrin Freight" }).id).toBe(
      "select:account:option:perrin%20partners",
    );
  });

  it("gives the label the caller's ID", async () => {
    await drawn(picked({ ids: { label: "account-label" } }));

    expect(screen.getByText("Account").id).toBe("account-label");
  });

  it("gives the trigger the caller's ID", async () => {
    await drawn(picked({ ids: { trigger: "account-trigger" } }));

    expect(screen.getByRole("combobox").id).toBe("account-trigger");
  });

  it("opens the panel as wide as the trigger", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(
      container.ownerDocument.querySelector<HTMLElement>(".select__positioner")?.style.width,
    ).toBe("var(--reference-width)");
  });

  it("keeps the caller's positioning over the trigger's width", async () => {
    const { container } = await drawn(picked({ positioning: { sameWidth: false } }));

    await opened();

    expect(
      container.ownerDocument.querySelector<HTMLElement>(".select__positioner")?.style.width,
    ).toBe("");
  });

  it("splits the machine's options from the element's props", () => {
    const collection = accounts();

    expect(splitSelectProps({ collection, title: "Account" })).toStrictEqual([
      { collection },
      { title: "Account" },
    ]);
  });

  it("drops translations from the machine's options", () => {
    const collection = accounts();

    expect(
      splitSelectProps({ collection, translations: { clearTriggerLabel: "Clear" } })[0],
    ).toStrictEqual({ collection });
  });
});
