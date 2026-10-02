import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type PasswordInputOptions,
  splitPasswordInputProps,
  usePasswordInput,
  usePasswordInputMachine,
} from "#password-input/machine.ts";

/**
 * Describes what the probe takes: the machine's options and the control ID of a field.
 */
interface Probed extends PasswordInputOptions {
  /**
   * ID the field around the input gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;
}

/**
 * Runs the machine with the options the case sets and renders its input.
 *
 * @param props - The machine options and the field's control ID.
 * @returns The input, rendered with the machine's props.
 */
function Running({ control, ...options }: Probed): ReactElement {
  const api = usePasswordInputMachine(options, control);

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
  const api = usePasswordInput();

  return <input {...api.getInputProps()} aria-label="Password" />;
}

describe("machine", () => {
  it("returns the machine's options first from splitPasswordInputProps", () => {
    const [options] = splitPasswordInputProps({ className: "mine", defaultVisible: true });

    expect(options).toStrictEqual({ defaultVisible: true });
  });

  it("returns the element's props second from splitPasswordInputProps", () => {
    const [, rest] = splitPasswordInputProps({ className: "mine", defaultVisible: true });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves translations out of both halves", () => {
    const split = splitPasswordInputProps({
      name: "password",
      translations: { visibilityTrigger: () => "Toggle" },
    });

    expect(split).toStrictEqual([{ name: "password" }, {}]);
  });

  it("gives the input the ID passed as control", async () => {
    await drawn(<Running control="password-control" />);

    expect(screen.getByLabelText("Password").id).toBe("password-control");
  });

  it("keeps the input ID the caller passes in ids over control", async () => {
    await drawn(<Running control="password-control" ids={{ input: "mine" }} />);

    expect(screen.getByLabelText("Password").id).toBe("mine");
  });

  it("derives the input ID from the id passed", async () => {
    await drawn(<Running id="password" />);

    expect(screen.getByLabelText("Password").id).toBe("p-input-password-input");
  });

  it("generates an id when none is passed", async () => {
    await drawn(<Running />);

    expect(screen.getByLabelText("Password").id).toMatch(/^p-input-.+-input$/u);
  });
});
