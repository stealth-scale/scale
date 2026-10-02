import { type ReactElement, type ReactNode, useState } from "react";

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoldContext, useFoldable, useFolded } from "#folding/fold.ts";

/**
 * Describes the props of the row under test.
 */
interface RowProps {
  /**
   * The actions in the row.
   */
  readonly children?: ReactNode;
}

/**
 * Renders a row that lists its folded actions' labels in the order it keeps them.
 */
function Row({ children }: RowProps): ReactElement {
  const [entries, fold] = useFolded();

  return (
    <FoldContext value={fold}>
      {children}
      <ul aria-label="Folded">
        {entries.map((entry) => (
          <li key={entry.id}>{entry.action.label}</li>
        ))}
      </ul>
    </FoldContext>
  );
}

/**
 * Describes the props of the action under test.
 */
interface ActorProps {
  /**
   * Whether the row folds the action.
   */
  readonly folded: boolean;

  /**
   * Words of the action.
   */
  readonly label: string;
}

/**
 * Registers an action with the row around it while it is folded, and renders nothing.
 */
function Actor({ folded, label }: ActorProps): null {
  useFoldable(folded, { label });

  return null;
}

/**
 * Renders a folded action whose words change when the button beside it is pressed, so the action
 * renders again while its siblings do not.
 */
function Renamed(): ReactElement {
  const [label, setLabel] = useState("Archive");

  return (
    <>
      <button
        onClick={() => {
          setLabel("Archive all");
        }}
        type="button"
      >
        Rename
      </button>
      <Actor folded label={label} />
    </>
  );
}

/**
 * Reads the labels the row lists, in order.
 */
function listed(): ReadonlyArray<null | string> {
  return screen.queryAllByRole("listitem").map((item) => item.textContent);
}

describe("fold", () => {
  it("registers a folded action with its row", () => {
    render(
      <Row>
        <Actor folded label="Archive" />
      </Row>,
    );

    expect(listed()).toStrictEqual(["Archive"]);
  });

  it("registers nothing while the action is not folded", () => {
    render(
      <Row>
        <Actor folded={false} label="Archive" />
      </Row>,
    );

    expect(listed()).toStrictEqual([]);
  });

  it("removes the action when it unfolds", () => {
    const { rerender } = render(
      <Row>
        <Actor folded label="Archive" />
      </Row>,
    );

    rerender(
      <Row>
        <Actor folded={false} label="Archive" />
      </Row>,
    );

    expect(listed()).toStrictEqual([]);
  });

  it("removes the action when it unmounts", () => {
    const { rerender } = render(
      <Row>
        <Actor folded label="Archive" />
      </Row>,
    );

    rerender(<Row />);

    expect(listed()).toStrictEqual([]);
  });

  it("keeps the actions in the order they folded", () => {
    render(
      <Row>
        <Actor folded label="Archive" />
        <Actor folded label="Duplicate" />
        <Actor folded label="Print" />
      </Row>,
    );

    expect(listed()).toStrictEqual(["Archive", "Duplicate", "Print"]);
  });

  it("keeps an action's place when it renders again alone", () => {
    render(
      <Row>
        <Renamed />
        <Actor folded label="Duplicate" />
      </Row>,
    );

    act(() => {
      screen.getByRole("button", { name: "Rename" }).click();
    });

    expect(listed()).toStrictEqual(["Archive all", "Duplicate"]);
  });

  it("registers nothing outside a row", () => {
    const { container } = render(<Actor folded label="Archive" />);

    expect(container.childElementCount).toBe(0);
  });
});
