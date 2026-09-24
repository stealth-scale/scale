import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  splitTabsProps,
  type TabsOptions,
  useTabs,
  useTabsMachine,
} from "#tabs/machine.ts";

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns The state as text.
 */
function Running(props: TabsOptions): ReactElement {
  const api = useTabsMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the selected value and the orientation the context reports.
 *
 * @returns A `span` with the value and the orientation.
 */
function Reader(): ReactElement {
  const api = useTabs();
  const list: Record<string, unknown> = api.getListProps();

  return (
    <span data-testid="state">{`${api.value ?? "none"} ${String(list["aria-orientation"])}`}</span>
  );
}

describe("splitTabsProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitTabsProps({ defaultValue: "first", orientation: "vertical" });

    expect(options).toStrictEqual({ defaultValue: "first", orientation: "vertical" });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitTabsProps({ defaultValue: "first", size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("drops translations from the machine's options", () => {
    const [options] = splitTabsProps({
      defaultValue: "first",
      translations: { listLabel: "Views" },
    });

    expect(options).toStrictEqual({ defaultValue: "first" });
  });
});

describe("useTabsMachine", () => {
  it("provides a running machine to a part", async () => {
    await drawn(<Running defaultValue="first" />);

    expect(screen.getByTestId("state").textContent).toBe("first horizontal");
  });

  it("defaults to horizontal with no value", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("none horizontal");
  });

  it("takes the orientation", async () => {
    await drawn(<Running defaultValue="first" orientation="vertical" />);

    expect(screen.getByTestId("state").textContent).toBe("first vertical");
  });

  it("keeps the machine's default for an undefined option", async () => {
    await drawn(<Running defaultValue="first" orientation={undefined} />);

    expect(screen.getByTestId("state").textContent).toBe("first horizontal");
  });

  it("passes the machine's other options through", async () => {
    await drawn(
      <Running activationMode="manual" defaultValue="first" loopFocus orientation="vertical" />,
    );

    expect(screen.getByTestId("state").textContent).toBe("first vertical");
  });
});
