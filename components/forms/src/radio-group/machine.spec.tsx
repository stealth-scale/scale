import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  optionIds,
  type RadioGroupOptions,
  splitItemProps,
  splitRadioGroupProps,
  useRadioGroup,
  useRadioGroupMachine,
} from "#radio-group/machine.ts";

/**
 * Runs the machine with the options the case sets and renders its value.
 *
 * @param props - The machine options.
 * @returns The value, rendered through a part's hook.
 */
function Running(props: RadioGroupOptions): ReactElement {
  const { api } = useRadioGroupMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the machine's value through the hook a part reads it with.
 *
 * @returns The value as text.
 */
function Reader(): ReactElement {
  const api = useRadioGroup();

  return <span data-testid="value">{api.value ?? "none"}</span>;
}

/**
 * Runs the machine with the options the case sets and renders the label's ID.
 *
 * @param props - The machine options.
 * @returns The ID as text.
 */
function Labelled(props: RadioGroupOptions): ReactElement {
  const { labelId } = useRadioGroupMachine(props);

  return <span data-testid="label">{labelId}</span>;
}

describe("machine", () => {
  it("returns the machine's options first from splitRadioGroupProps", () => {
    const [options] = splitRadioGroupProps({ defaultValue: "Weekly", name: "window" });

    expect(options).toStrictEqual({ defaultValue: "Weekly", name: "window" });
  });

  it("returns the element's props second from splitRadioGroupProps", () => {
    const [, rest] = splitRadioGroupProps({ className: "mine", orientation: "horizontal" });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("returns an item's options first from splitItemProps", () => {
    const [options, rest] = splitItemProps({ className: "mine", disabled: true, value: "Weekly" });

    expect([options, rest]).toStrictEqual([
      { disabled: true, value: "Weekly" },
      { className: "mine" },
    ]);
  });

  it("percent-encodes the value in an option's ID", () => {
    expect(optionIds("window", "text")("Same day")).toBe("radio-group-window-text-Same%20day");
  });

  it("returns an api a part reads through the context", async () => {
    await drawn(<Running defaultValue="Weekly" />);

    expect(screen.getByTestId("value").textContent).toBe("Weekly");
  });

  it("starts with no value by default", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("value").textContent).toBe("none");
  });

  it("derives the label's ID from the group's id", async () => {
    await drawn(<Labelled id="window" />);

    expect(screen.getByTestId("label").textContent).toBe("radio-group-window-label");
  });

  it("returns the label ID the caller passes in ids", async () => {
    await drawn(<Labelled ids={{ label: "heading" }} />);

    expect(screen.getByTestId("label").textContent).toBe("heading");
  });
});
