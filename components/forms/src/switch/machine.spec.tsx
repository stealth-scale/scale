import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  splitSwitchProps,
  type SwitchOptions,
  useSwitch,
  useSwitchMachine,
} from "#switch/machine.ts";

/**
 * Runs the machine with the options the case sets and renders its state through a part's hook.
 *
 * @param props - The machine options.
 * @returns The provider around the reader.
 */
function Running(props: SwitchOptions): ReactElement {
  const { api } = useSwitchMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders `on` or `off` from the api a part reads.
 *
 * @returns A `span` with the state.
 */
function Reader(): ReactElement {
  const api = useSwitch();

  return <span data-testid="state">{api.checked ? "on" : "off"}</span>;
}

describe("splitSwitchProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitSwitchProps({ defaultChecked: true, name: "theme" });

    expect(options).toStrictEqual({ defaultChecked: true, name: "theme" });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitSwitchProps({ defaultChecked: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("splits readOnly from className by the machine's own key list", () => {
    const [options, rest] = splitSwitchProps({ className: "mine", readOnly: true });

    expect(options).toStrictEqual({ readOnly: true });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useSwitchMachine", () => {
  it("returns an api that reports defaultChecked", () => {
    render(<Running defaultChecked />);

    expect(screen.getByTestId("state").textContent).toBe("on");
  });

  it("returns an api that reports off by default", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("off");
  });
});
