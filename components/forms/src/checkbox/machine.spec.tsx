import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type CheckboxOptions,
  splitCheckboxProps,
  useCheckbox,
  useCheckboxMachine,
} from "#checkbox/machine.ts";

/**
 * Runs the machine with the options the case sets and renders its state.
 *
 * @param props - The machine options.
 * @returns The state, rendered through a part's hook.
 */
function Running(props: CheckboxOptions): ReactElement {
  const api = useCheckboxMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the machine's checked state through the hook a part reads it with.
 *
 * @returns The state as text.
 */
function Reader(): ReactElement {
  const api = useCheckbox();

  return <span data-testid="state">{String(api.checkedState)}</span>;
}

describe("splitCheckboxProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitCheckboxProps({ defaultChecked: true, name: "terms" });

    expect(options).toStrictEqual({ defaultChecked: true, name: "terms" });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitCheckboxProps({ defaultChecked: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("reads the option names from the machine", () => {
    const [options, rest] = splitCheckboxProps({ className: "mine", readOnly: true });

    expect(options).toStrictEqual({ readOnly: true });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useCheckboxMachine", () => {
  it("returns an api a part reads through the context", () => {
    render(<Running defaultChecked />);

    expect(screen.getByTestId("state").textContent).toBe("true");
  });

  it("starts unchecked by default", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("false");
  });

  it("starts partly on when checked is indeterminate", () => {
    render(<Running checked="indeterminate" />);

    expect(screen.getByTestId("state").textContent).toBe("indeterminate");
  });
});
