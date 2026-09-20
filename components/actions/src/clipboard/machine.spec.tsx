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
 * Runs the machine and reports what it returns, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
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
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns The value and whether it was copied.
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
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitClipboardProps({ timeout: 250, value: "4109" });

    expect(options).toStrictEqual({ timeout: 250, value: "4109" });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitClipboardProps({ size: "lg", value: "4109" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("reads the list off the machine rather than one this package keeps", () => {
    const [options, rest] = splitClipboardProps({ className: "mine", defaultValue: "4109" });

    expect(options).toStrictEqual({ defaultValue: "4109" });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useClipboardMachine", () => {
  it("returns a running machine a part can read", () => {
    render(<Running value="4109" />);

    expect(screen.getByTestId("state").textContent).toBe("4109:idle");
  });

  it("starts with nothing to copy where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe(":idle");
  });
});
