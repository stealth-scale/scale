import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import * as menu from "@zag-js/menu";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  ItemProvider,
  type MenuOptions,
  splitMenuProps,
  useMenu,
  useMenuItem,
  useMenuMachine,
  useNestedMenu,
} from "#menu/machine.ts";

const OUTERMOST: menu.Service | undefined = undefined;

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: MenuOptions): ReactElement {
  const [api, service] = useMenuMachine(props);

  useNestedMenu(service, OUTERMOST);

  return (
    <ApiProvider
      value={{ api, depth: 0, dir: undefined, parent: undefined, service, variants: {} }}
    >
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <Reader />
        </div>
      </div>
    </ApiProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the rows are open, and the row the reader is on.
 */
function Reader(): ReactElement {
  const { api } = useMenu();

  return (
    <span data-testid="state">{`${api.open ? "open" : "shut"} ${api.highlightedValue ?? "none"}`}</span>
  );
}

/**
 * Reads the row a provider above it states.
 *
 * @returns The row's value.
 */
function Row(): ReactElement {
  const item = useMenuItem();

  return <span data-testid="row">{item.value}</span>;
}

describe("splitMenuProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitMenuProps({ closeOnSelect: false, loopFocus: true });

    expect(options).toStrictEqual({ closeOnSelect: false, loopFocus: true });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitMenuProps({ loopFocus: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useMenuMachine", () => {
  it("answers a running machine a part can read", async () => {
    await drawn(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });

  it("starts shut where a caller says nothing", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut none");
  });

  it("starts on the row a caller names", async () => {
    await drawn(<Running defaultHighlightedValue="rename" defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open rename");
  });

  it("keeps the machine's own default where a caller hands over nothing for it", async () => {
    await drawn(<Running closeOnSelect={undefined} defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });

  it("passes every setting the machine defaults through where a caller names them", async () => {
    await drawn(<Running closeOnSelect={false} defaultOpen loopFocus typeahead={false} />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });
});

describe("useMenuItem", () => {
  it("hands the row below it the value the row was named with", async () => {
    await drawn(
      <ItemProvider value={{ value: "rename" }}>
        <Row />
      </ItemProvider>,
    );

    expect(screen.getByTestId("row").textContent).toBe("rename");
  });
});
