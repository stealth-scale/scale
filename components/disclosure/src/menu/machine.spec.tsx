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
 * Runs the machine and renders its state as text.
 *
 * @param props - The machine settings.
 * @returns The state as text.
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
 * Renders the open state and the highlighted value that `useMenu` returns.
 *
 * @returns The state as text.
 */
function Reader(): ReactElement {
  const { api } = useMenu();

  return (
    <span data-testid="state">{`${api.open ? "open" : "shut"} ${api.highlightedValue ?? "none"}`}</span>
  );
}

/**
 * Renders the value that `useMenuItem` returns.
 *
 * @returns The row's value.
 */
function Row(): ReactElement {
  const item = useMenuItem();

  return <span data-testid="row">{item.value}</span>;
}

describe("splitMenuProps", () => {
  it("returns the machine's settings first", () => {
    const [options] = splitMenuProps({ closeOnSelect: false, loopFocus: true });

    expect(options).toStrictEqual({ closeOnSelect: false, loopFocus: true });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitMenuProps({ loopFocus: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useMenuMachine", () => {
  it("provides a running machine to the parts", async () => {
    await drawn(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });

  it("starts closed by default", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut none");
  });

  it("starts on the defaultHighlightedValue row", async () => {
    await drawn(<Running defaultHighlightedValue="rename" defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open rename");
  });

  it("keeps the machine's default for an undefined setting", async () => {
    await drawn(<Running closeOnSelect={undefined} defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });

  it("passes a caller's settings to the machine", async () => {
    await drawn(<Running closeOnSelect={false} defaultOpen loopFocus typeahead={false} />);

    expect(screen.getByTestId("state").textContent).toBe("open none");
  });
});

describe("useMenuItem", () => {
  it("provides the row's value to a part below it", async () => {
    await drawn(
      <ItemProvider value={{ value: "rename" }}>
        <Row />
      </ItemProvider>,
    );

    expect(screen.getByTestId("row").textContent).toBe("rename");
  });
});
