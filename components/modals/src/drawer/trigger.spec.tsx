import { type ReactElement } from "react";

import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, rooted } from "#drawer/drawer.fixtures.tsx";
import { Content, Positioner, Root, Title, Trigger } from "#drawer/index.ts";

/**
 * Renders one drawer opened by two triggers, each with a value, reporting the pressed one.
 *
 * @param onTriggerValueChange - Called with the value of the trigger that opened the drawer.
 * @returns The drawer.
 */
function shared(
  onTriggerValueChange: (details: { readonly value: null | string }) => void,
): ReactElement {
  return (
    <Root onTriggerValueChange={onTriggerValueChange}>
      <Trigger value="paid">Paid</Trigger>
      <Trigger value="overdue">Overdue</Trigger>
      <Positioner>
        <Content>
          <Title>Invoices</Title>
        </Content>
      </Positioner>
    </Root>
  );
}

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(rooted(<Trigger>Filters</Trigger>));

    expect(slotElement(container, "drawer", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-haspopup to dialog", async () => {
    await drawn(rooted(<Trigger>Filters</Trigger>));

    expect(screen.getByRole("button", { name: "Filters" }).getAttribute("aria-haspopup")).toBe(
      "dialog",
    );
  });

  it("sets aria-expanded to the open state", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: "Filters" });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    await pressed(control);

    expect(control.getAttribute("aria-expanded")).toBe("true");
  });

  it("sets aria-controls to the panel's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByText("Filters").getAttribute("aria-controls")).toBe(
      screen.getByRole("dialog").id,
    );
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      <Root>
        <Trigger onClick={heard}>Filters</Trigger>
        <Positioner>
          <Content>
            <Title>Filter invoices</Title>
          </Content>
        </Positioner>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Filters" }));

    expect(heard).toHaveBeenCalledTimes(1);
  });

  it("reports the value of the pressed trigger as triggerValue", async () => {
    const told = vi.fn<(details: { readonly value: null | string }) => void>();

    await drawn(shared(told));
    await pressed(screen.getByRole("button", { name: "Overdue" }));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "overdue" }));
  });

  it("sets aria-expanded on the pressed trigger alone", async () => {
    const { container } = await drawn(shared(vi.fn<() => void>()));

    await pressed(within(container).getByRole("button", { name: "Overdue" }));

    expect(
      within(container)
        .getAllByRole("button", { hidden: true })
        .map((button) => button.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "true"]);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rooted(<Trigger as="a">Filters</Trigger>));

    expect(slotElement(container, "drawer", "trigger").tagName).toBe("A");
  });
});
