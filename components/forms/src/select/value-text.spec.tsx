import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#select/content.tsx";
import { Control } from "#select/control.tsx";
import { Positioner } from "#select/positioner.tsx";
import { Root } from "#select/root.tsx";
import { accounts, picked, rowsOf, trigger } from "#select/select.fixtures.tsx";
import { Trigger } from "#select/trigger.tsx";
import { ValueText } from "#select/value-text.tsx";

describe("ValueText", () => {
  it("renders a span", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "valueText").tagName).toBe("SPAN");
  });

  it("shows the placeholder while nothing is selected", async () => {
    await drawn(picked());

    expect(trigger().textContent).toBe("Pick an account");
  });

  it("shows the label of the selected item", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));

    expect(trigger().textContent).toBe("Halden & Co");
  });

  it("joins the labels of several selected items with commas", async () => {
    await drawn(picked({ defaultValue: ["bridge", "halden"], multiple: true }));

    expect(trigger().textContent).toBe("Bridge Ledger, Halden & Co");
  });

  it("sets data-placeholder-shown on the trigger while nothing is selected", async () => {
    await drawn(picked());

    expect(trigger().dataset["placeholderShown"]).toBe("");
  });

  it("shows what a function child returns for the selected items", async () => {
    const collection = accounts();
    const counted = vi.fn<(items: readonly unknown[]) => string>(
      (items) => `${String(items.length)} accounts`,
    );

    await drawn(
      <Root collection={collection} defaultValue={["bridge", "halden"]} multiple>
        <Control>
          <Trigger aria-label="Accounts">
            <ValueText>{counted}</ValueText>
          </Trigger>
        </Control>
        <Positioner>
          <Content>{rowsOf(collection.items)}</Content>
        </Positioner>
      </Root>,
    );

    expect(trigger().textContent).toBe("2 accounts");
  });
});
