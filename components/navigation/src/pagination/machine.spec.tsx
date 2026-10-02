import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  MachineProvider,
  type PaginationOptions,
  splitPaginationProps,
  usePagination,
  usePaginationMachine,
} from "#pagination/machine.ts";

/**
 * Runs the machine with the options the case sets and renders what a part reads from it.
 *
 * @param props - The machine options.
 * @returns The page, the page count and the type, rendered through a part's hook.
 */
function Running(props: PaginationOptions): ReactElement {
  const machine = usePaginationMachine(props);

  return (
    <MachineProvider value={machine}>
      <Reader />
    </MachineProvider>
  );
}

/**
 * Renders the machine's page, page count and type through the hook a part reads them with.
 *
 * @returns The values as text.
 */
function Reader(): ReactElement {
  const { api, type } = usePagination();

  return <span data-testid="state">{`${api.page} ${api.totalPages} ${type}`}</span>;
}

describe("machine", () => {
  it("returns the machine's options first from splitPaginationProps", () => {
    const [options] = splitPaginationProps({ count: 90, pageSize: 10 });

    expect(options).toStrictEqual({ count: 90, pageSize: 10 });
  });

  it("returns the element's props second from splitPaginationProps", () => {
    const [, rest] = splitPaginationProps({ className: "mine", count: 90 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("drops translations from the options splitPaginationProps returns", () => {
    const [options] = splitPaginationProps({ count: 90, translations: { rootLabel: "pages" } });

    expect(options).toStrictEqual({ count: 90 });
  });

  it("returns an api a part reads through the context", async () => {
    await drawn(<Running count={90} defaultPage={3} pageSize={10} />);

    expect(screen.getByTestId("state").textContent).toBe("3 9 button");
  });

  it("reports links when type is link", async () => {
    await drawn(<Running count={90} type="link" />);

    expect(screen.getByTestId("state").textContent).toBe("1 9 link");
  });
});
