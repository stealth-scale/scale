import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type DialogOptions,
  splitDialogProps,
  useDialog,
  useDialogMachine,
} from "#dialog/machine.ts";

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns The state as text, inside the positioner and content props.
 */
function Running(props: DialogOptions): ReactElement {
  const api = useDialogMachine(props);

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
  const api = useDialog();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("splitDialogProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitDialogProps({ defaultOpen: true, role: "alertdialog" });

    expect(options).toStrictEqual({ defaultOpen: true, role: "alertdialog" });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitDialogProps({ defaultOpen: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useDialogMachine", () => {
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

  it("derives the ids of the parts from id", async () => {
    await drawn(<Running defaultOpen id="rename" />);

    expect(screen.getByRole("dialog").id).toBe("dialog:rename:content");
  });
});
