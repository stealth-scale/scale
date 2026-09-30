import { type ReactElement } from "react";

import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, rooted } from "#dialog/dialog.fixtures.tsx";
import { Content, Positioner, Root, Title, Trigger } from "#dialog/index.ts";

/**
 * Renders one dialog opened by two triggers, each with a value, reporting the pressed one.
 *
 * @param onTriggerValueChange - Called with the value of the trigger that opened the dialog.
 * @returns The dialog.
 */
function shared(
  onTriggerValueChange: (details: { readonly value: null | string }) => void,
): ReactElement {
  return (
    <Root onTriggerValueChange={onTriggerValueChange}>
      <Trigger value="ada">Ada</Trigger>
      <Trigger value="grace">Grace</Trigger>
      <Positioner>
        <Content>
          <Title>Member</Title>
        </Content>
      </Positioner>
    </Root>
  );
}

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(rooted(<Trigger>Rename</Trigger>));

    expect(slotElement(container, "dialog", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-haspopup to dialog", async () => {
    await drawn(rooted(<Trigger>Rename</Trigger>));

    expect(screen.getByRole("button", { name: "Rename" }).getAttribute("aria-haspopup")).toBe(
      "dialog",
    );
  });

  it("sets aria-expanded to the open state", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: "Rename" });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    await pressed(control);

    expect(control.getAttribute("aria-expanded")).toBe("true");
  });

  it("sets aria-controls to the panel's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByText("Rename").getAttribute("aria-controls")).toBe(
      screen.getByRole("dialog").id,
    );
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      <Root>
        <Trigger onClick={heard}>Rename</Trigger>
        <Positioner>
          <Content>
            <Title>Rename the report</Title>
          </Content>
        </Positioner>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Rename" }));

    expect(heard).toHaveBeenCalledOnce();
  });

  it("reports the value of the pressed trigger as triggerValue", async () => {
    const told = vi.fn<(details: { readonly value: null | string }) => void>();

    await drawn(shared(told));
    await pressed(screen.getByRole("button", { name: "Grace" }));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "grace" }));
  });

  it("sets aria-expanded on the pressed trigger alone", async () => {
    const { container } = await drawn(shared(vi.fn<() => void>()));

    await pressed(within(container).getByRole("button", { name: "Grace" }));

    expect(
      within(container)
        .getAllByRole("button", { hidden: true })
        .map((button) => button.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "true"]);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rooted(<Trigger as="a">Rename</Trigger>));

    expect(slotElement(container, "dialog", "trigger").tagName).toBe("A");
  });
});
