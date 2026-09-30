import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  MachineProvider,
  splitStepsProps,
  type StepsOptions,
  useSteps,
  useStepsMachine,
} from "#steps/machine.ts";

/**
 * Runs the machine with the options the case sets and renders what a part reads from it.
 *
 * @param props - The machine options.
 * @returns The step, the count and the linear flag, rendered through a part's hook.
 */
function Running(props: StepsOptions): ReactElement {
  const machine = useStepsMachine(props);

  return (
    <MachineProvider value={machine}>
      <Reader />
    </MachineProvider>
  );
}

/**
 * Renders the machine's step, count and linear flag through the hook a part reads them with.
 *
 * @returns The values as text.
 */
function Reader(): ReactElement {
  const { api, linear } = useSteps();

  return <span data-testid="state">{`${api.value} ${api.count} ${String(linear)}`}</span>;
}

describe("machine", () => {
  it("returns the machine's options first from splitStepsProps", () => {
    const [options] = splitStepsProps({ count: 3, linear: true });

    expect(options).toStrictEqual({ count: 3, linear: true });
  });

  it("returns the element's props second from splitStepsProps", () => {
    const [, rest] = splitStepsProps({ className: "mine", count: 3 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("returns an api a part reads through the context", async () => {
    await drawn(<Running count={3} defaultStep={1} />);

    expect(screen.getByTestId("state").textContent).toBe("1 3 false");
  });

  it("reports a linear flow", async () => {
    await drawn(<Running count={3} linear />);

    expect(screen.getByTestId("state").textContent).toBe("0 3 true");
  });
});
