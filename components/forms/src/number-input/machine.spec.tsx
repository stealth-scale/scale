import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type NumberInputOptions,
  splitNumberInputProps,
  useNumberInput,
  useNumberInputMachine,
} from "#number-input/machine.ts";

/**
 * Describes what the probe takes: the machine's options and the control ID of a field.
 */
interface Probed extends NumberInputOptions {
  /**
   * ID the field around the input gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;
}

/**
 * Runs the machine with the options the case sets and renders its input's props.
 *
 * @param props - The machine options and the field's control ID.
 * @returns The input, rendered with the machine's props.
 */
function Running({ control, ...options }: Probed): ReactElement {
  const api = useNumberInputMachine(options, control);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the input through the hook a part reads the api with.
 *
 * @returns The input.
 */
function Reader(): ReactElement {
  const api = useNumberInput();

  return <input aria-label="Seats" {...api.getInputProps()} />;
}

describe("machine", () => {
  it("returns the machine's options first from splitNumberInputProps", () => {
    const [options] = splitNumberInputProps({ className: "mine", max: 50, min: 1 });

    expect(options).toStrictEqual({ max: 50, min: 1 });
  });

  it("returns the element's props second from splitNumberInputProps", () => {
    const [, rest] = splitNumberInputProps({ className: "mine", max: 50 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves translations out of both halves", () => {
    const split = splitNumberInputProps({
      max: 50,
      translations: { decrementLabel: "less", incrementLabel: "more" },
    });

    expect(split).toStrictEqual([{ max: 50 }, {}]);
  });

  it("returns an api a part reads through the context", async () => {
    await drawn(<Running defaultValue="4" />);

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("4");
  });

  it("gives the input the ID passed as control", async () => {
    await drawn(<Running control="seats-control" />);

    expect(screen.getByRole("spinbutton").id).toBe("seats-control");
  });

  it("keeps the input ID the caller passes in ids over control", async () => {
    await drawn(<Running control="seats-control" ids={{ input: "mine" }} />);

    expect(screen.getByRole("spinbutton").id).toBe("mine");
  });

  it("derives the input ID from the id passed", async () => {
    await drawn(<Running id="seats" />);

    expect(screen.getByRole("spinbutton").id).toBe("number-input:seats:input");
  });

  it("generates an id when none is passed", async () => {
    await drawn(<Running />);

    expect(screen.getByRole("spinbutton").id).toMatch(/^number-input:.+:input$/u);
  });
});
