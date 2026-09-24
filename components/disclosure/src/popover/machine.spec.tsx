import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type PopoverOptions,
  splitPopoverProps,
  usePopover,
  usePopoverMachine,
} from "#popover/machine.ts";

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns The state as text, inside the positioner and content props.
 */
function Running(props: PopoverOptions): ReactElement {
  const api = usePopoverMachine(props);

  return (
    <ApiProvider value={api}>
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <Reader />
        </div>
      </div>
    </ApiProvider>
  );
}

/**
 * Renders the open state the context reports.
 *
 * @returns A `span` with `open` or `shut`.
 */
function Reader(): ReactElement {
  const api = usePopover();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("splitPopoverProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitPopoverProps({ defaultOpen: true, modal: true });

    expect(options).toStrictEqual({ defaultOpen: true, modal: true });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitPopoverProps({ defaultOpen: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("drops translations from the machine's options", () => {
    const [options] = splitPopoverProps({
      defaultOpen: true,
      translations: { closeTriggerLabel: "Close the filters" },
    });

    expect(options).toStrictEqual({ defaultOpen: true });
  });
});

describe("usePopoverMachine", () => {
  it("provides a running machine to a part", async () => {
    await drawn(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts closed", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("keeps the machine's default for an undefined option", async () => {
    await drawn(<Running closeOnEscape={undefined} defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });
});
