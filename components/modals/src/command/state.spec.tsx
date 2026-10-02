import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { ACTIONS } from "#command/actions.fixtures.ts";
import { type CommandOptions, useCommandState } from "#command/state.ts";

/**
 * Formats the result count as `<count> left`.
 */
function counted(matches: number): string {
  return `${String(matches)} left`;
}

/**
 * Narrows the hook's collection from a button, and renders the matching labels and the query as
 * text.
 */
function Reader(props: { to: string } & Partial<CommandOptions>): ReactElement {
  const { to, ...rest } = props;
  const palette = useCommandState({
    actions: ACTIONS,
    count: counted,
    label: "Commands",
    ...rest,
  });

  return (
    <>
      <button
        onClick={() => {
          palette.narrow(to);
        }}
        type="button"
      >
        Narrow
      </button>
      <span data-testid="left">{palette.collection.items.map((row) => row.label).join(",")}</span>
      <span data-testid="typed">{palette.typed}</span>
    </>
  );
}

describe("useCommandState", () => {
  it("keeps every action before a query is typed", () => {
    render(<Reader to="" />);

    expect(screen.getByTestId("left").textContent).toBe("Invoices,Reports,New document");
  });

  it("drops the actions whose labels do not contain the query", async () => {
    render(<Reader to="rep" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("Reports");
  });

  it("keeps an action whose keywords contain the query but whose label does not", async () => {
    render(<Reader to="create" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("left").textContent).toBe("New document");
  });

  it("returns the query it was last narrowed with", async () => {
    render(<Reader to="rep" />);
    await pressed(screen.getByRole("button"));

    expect(screen.getByTestId("typed").textContent).toBe("rep");
  });

  it("narrows to the query the palette opens with", () => {
    render(<Reader query="rep" to="" />);

    expect(screen.getByTestId("left").textContent).toBe("Reports");
  });
});
