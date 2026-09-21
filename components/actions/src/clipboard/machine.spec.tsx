import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type ClipboardOptions,
  splitClipboardProps,
  useClipboard,
  useClipboardMachine,
} from "#clipboard/machine.ts";

/**
 * Starts a machine and publishes its api over a reader a case can inspect.
 *
 * @param props - The settings the machine starts with.
 * @returns The reader, beneath a provider holding the connected api.
 */
function Running(props: ClipboardOptions): ReactElement {
  const api = useClipboardMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the api's state through the same hook the parts use.
 *
 * @returns A span holding the value and the copied flag, separated by a colon.
 */
function Reader(): ReactElement {
  const api = useClipboard();

  return (
    <span data-testid="state">
      {api.value}:{api.copied ? "copied" : "idle"}
    </span>
  );
}

describe("splitClipboardProps", () => {
  it("returns the machine's own settings in the first half", () => {
    const [options] = splitClipboardProps({ timeout: 250, value: "4109" });

    expect(options).toStrictEqual({ timeout: 250, value: "4109" });
  });

  it("returns a prop the machine does not declare in the second half", () => {
    const [, rest] = splitClipboardProps({ size: "lg", value: "4109" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("routes defaultValue to the machine and className to the element", () => {
    const [options, rest] = splitClipboardProps({ className: "mine", defaultValue: "4109" });

    expect(options).toStrictEqual({ defaultValue: "4109" });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useClipboardMachine", () => {
  it("exposes the value it was started with through the parts' hook", () => {
    render(<Running value="4109" />);

    expect(screen.getByTestId("state").textContent).toBe("4109:idle");
  });

  it("starts idle on an empty value when given no options", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe(":idle");
  });
});
