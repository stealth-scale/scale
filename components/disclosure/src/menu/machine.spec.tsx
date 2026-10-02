import { type ReactElement, useState } from "react";

import { act, fireEvent, screen } from "@testing-library/react";
import * as menu from "@zag-js/menu";
import { describe, expect, it, vi } from "vitest";

import { usePresence } from "@stealthscale/hooks";
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
import { composed, kept } from "#menu/menu.fixtures.tsx";

const OUTERMOST: menu.Service | undefined = undefined;

/**
 * Waits for the animation frames and timers a machine defers an outside press to.
 */
async function framed(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  });
}

/**
 * Presses an element with the three pointer events in one task, as a browser fires them within one
 * animation frame, and waits for the frames after it.
 */
async function clicked(element: Element): Promise<void> {
  await act(async () => {
    fireEvent.pointerDown(element);
    fireEvent.pointerUp(element);
    fireEvent.click(element);
    await Promise.resolve();
  });
  await framed();
}

/**
 * Runs the machine and renders its state as text.
 *
 * @param props - The machine settings.
 * @returns The state as text.
 */
function Running(props: MenuOptions): ReactElement {
  const [api, service] = useMenuMachine(props);
  const presence = usePresence({ present: api.open });

  useNestedMenu(service, OUTERMOST);

  return (
    <ApiProvider
      value={{ api, depth: 0, dir: undefined, parent: undefined, presence, service, variants: {} }}
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
 * Renders an open menu whose caller keeps `open`, and a button outside it.
 *
 * @returns The menu and the button.
 */
function Controlled(): ReactElement {
  const [open, setOpen] = useState(true);

  return (
    <>
      {composed({
        onOpenChange: (details) => {
          setOpen(details.open);
        },
        open,
      })}
      <button type="button">Outside</button>
    </>
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

  it("opens a menu whose trigger is pressed while another menu is open", async () => {
    await drawn(
      <>
        {composed()}
        {kept()}
      </>,
    );

    await clicked(screen.getByRole("button", { name: "Actions" }));
    await clicked(screen.getByRole("button", { name: "Format" }));

    expect(screen.getByRole("button", { name: "Format" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("calls a caller's onRequestDismiss when Zag closes the menu with another", async () => {
    const onRequestDismiss = vi.fn<(event: Event) => void>();

    await drawn(
      <>
        {composed()}
        {kept({ lazyMount: false, onRequestDismiss })}
      </>,
    );

    await clicked(screen.getByRole("button", { name: "Actions" }));
    await clicked(screen.getByRole("button", { name: "Format" }));

    expect(onRequestDismiss).toHaveBeenCalledOnce();
  });

  it("keeps focus on a button outside when a controlled menu closes on its press", async () => {
    await drawn(<Controlled />);
    await framed();

    const outside = screen.getByRole("button", { name: "Outside" });

    await act(async () => {
      fireEvent.pointerDown(outside);
      outside.focus();
      await Promise.resolve();
    });
    await framed();

    expect(document.activeElement).toBe(outside);
  });

  it("returns focus to the trigger when a controlled menu closes with focus in its panel", async () => {
    await drawn(<Controlled />);
    await framed();
    act(() => {
      screen.getByRole("menu").focus();
    });
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions" }));
  });

  it("returns focus to the trigger when a controlled menu closes with focus on the body", async () => {
    await drawn(<Controlled />);
    await framed();
    act(() => {
      screen.getByRole("menu").blur();
    });
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions" }));
  });

  it("closes the open menu when another menu's trigger is pressed", async () => {
    await drawn(
      <>
        {composed()}
        {kept()}
      </>,
    );

    await clicked(screen.getByRole("button", { name: "Actions" }));
    await clicked(screen.getByRole("button", { name: "Format" }));

    expect(screen.getByRole("button", { name: "Actions" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
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
