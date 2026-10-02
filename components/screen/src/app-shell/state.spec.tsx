import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { bodied, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import {
  COLLAPSES,
  FOLDS,
  useAppShellPanel,
  useNearestPanel,
  useOverlaid,
} from "#app-shell/state.ts";

/**
 * Renders whether the panel named `navbar` is open, read through `useAppShellPanel`.
 *
 * @returns A span with `open` or `shut`.
 */
function Named(): ReactElement {
  return (
    <span data-testid="read">{useAppShellPanel("navbar")?.open === true ? "open" : "shut"}</span>
  );
}

/**
 * Renders the identifier of the panel above, read through `useNearestPanel`.
 *
 * @returns A span with the identifier.
 */
function Nearest(): ReactElement {
  return <span data-testid="read">{useNearestPanel().id}</span>;
}

/**
 * Renders the number of panels over the page, read through `useOverlaid`.
 *
 * @returns A span with the count.
 */
function Counted(): ReactElement {
  return <span data-testid="read">{useOverlaid().length}</span>;
}

describe("COLLAPSES", () => {
  it("lists hide and icons", () => {
    expect(COLLAPSES).toStrictEqual(["hide", "icons"]);
  });
});

describe("FOLDS", () => {
  it("lists over and under", () => {
    expect(FOLDS).toStrictEqual(["over", "under"]);
  });
});

describe("useAppShellPanel", () => {
  it("returns the panel with the name passed", () => {
    render(bodied(<Navbar>{<Named />}</Navbar>));

    expect(screen.getByTestId("read").textContent).toBe("open");
  });

  it("returns undefined for a name no panel uses", () => {
    render(bodied(<Named />));

    expect(screen.getByTestId("read").textContent).toBe("shut");
  });

  it("throws outside AppShell.Root", () => {
    expect(() => render(<Named />)).toThrow(/AppShell\.Root/u);
  });
});

describe("useNearestPanel", () => {
  it("returns the panel above the caller", () => {
    const { container } = render(bodied(<Navbar>{<Nearest />}</Navbar>));

    expect(screen.getByTestId("read").textContent).toBe(
      container.querySelector(".app-shell__navbar")?.id,
    );
  });

  it("throws outside a panel", () => {
    expect(() => render(bodied(<Nearest />))).toThrow(/AppShell panel/u);
  });
});

describe("useOverlaid", () => {
  it("returns no panel while every panel is beside the page", () => {
    render(bodied(<Navbar>{<Counted />}</Navbar>));

    expect(screen.getByTestId("read").textContent).toBe("0");
  });

  it("returns a panel that is open over the page", () => {
    render(
      narrowed(
        bodied(
          <Navbar open>
            <Counted />
          </Navbar>,
        ),
      ),
    );

    expect(screen.getByTestId("read").textContent).toBe("1");
  });
});
