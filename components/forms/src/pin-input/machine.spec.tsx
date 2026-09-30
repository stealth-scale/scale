import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type PinInputOptions,
  splitPinInputProps,
  usePinInput,
  usePinInputMachine,
} from "#pin-input/machine.ts";

/**
 * Describes what the probe takes: the machine's options and the control ID of a field.
 */
interface Probed extends PinInputOptions {
  /**
   * ID the field around the pin input gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;
}

/**
 * Runs the machine with the options the case sets and renders the label's ID and two boxes.
 *
 * @param props - The machine options and the field's control ID.
 * @returns The label's ID as text, and the boxes.
 */
function Running({ control, ...options }: Probed): ReactElement {
  const { api, labelId } = usePinInputMachine(options, control);

  return (
    <ApiProvider value={api}>
      <span data-testid="label">{labelId}</span>
      <Boxes />
    </ApiProvider>
  );
}

/**
 * Renders two boxes inside the root through the hook a part reads the api with.
 *
 * @returns The root and its boxes.
 */
function Boxes(): ReactElement {
  const api = usePinInput();

  return (
    <div {...api.getRootProps()}>
      <input {...api.getInputProps({ index: 0 })} aria-label="First" />
      <input {...api.getInputProps({ index: 1 })} aria-label="Second" />
    </div>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitPinInputProps", () => {
    const [options] = splitPinInputProps({ className: "mine", count: 4, otp: true });

    expect(options).toStrictEqual({ count: 4, otp: true });
  });

  it("returns the element's props second from splitPinInputProps", () => {
    const [, rest] = splitPinInputProps({ className: "mine", count: 4 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves translations out of both halves", () => {
    const split = splitPinInputProps({
      count: 4,
      translations: { inputLabel: (index: number) => `Box ${index}` },
    });

    expect(split).toStrictEqual([{ count: 4 }, {}]);
  });

  it("derives the label's ID from the id passed", async () => {
    await drawn(<Running id="code" />);

    expect(screen.getByTestId("label").textContent).toBe("pin-input:code:label");
  });

  it("returns the label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "heading" }} />);

    expect(screen.getByTestId("label").textContent).toBe("heading");
  });

  it("gives the first box the ID passed as control", async () => {
    await drawn(<Running control="code-control" id="code" />);

    expect(screen.getByRole("textbox", { name: "First" }).id).toBe("code-control");
  });

  it("derives the other boxes' IDs from the id passed", async () => {
    await drawn(<Running control="code-control" id="code" />);

    expect(screen.getByRole("textbox", { name: "Second" }).id).toBe("pin-input:code:1");
  });

  it("derives the first box's ID from the id passed outside a field", async () => {
    await drawn(<Running id="code" />);

    expect(screen.getByRole("textbox", { name: "First" }).id).toBe("pin-input:code:0");
  });

  it("keeps the box IDs the caller passes in ids over control", async () => {
    await drawn(<Running control="code-control" ids={{ input: (index) => `mine-${index}` }} />);

    expect(screen.getByRole("textbox", { name: "First" }).id).toBe("mine-0");
  });
});
