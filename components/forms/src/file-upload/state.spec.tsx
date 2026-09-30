import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { STATEMENT } from "#file-upload/file-upload.fixtures.tsx";
import {
  ItemProvider,
  ListedProvider,
  SharedProvider,
  useItem,
  useLabelled,
  useListed,
  useShared,
} from "#file-upload/state.ts";

/**
 * Renders the shared state through the hook under test.
 *
 * @returns The state as text.
 */
function Sharing(): ReactElement {
  const { disabled, readOnly, size } = useShared();

  return <span data-testid="shared">{`${String(disabled)} ${String(readOnly)} ${size}`}</span>;
}

/**
 * Renders the list of the group above through the hook under test.
 *
 * @returns The list as text.
 */
function Listing(): ReactElement {
  return <span data-testid="listed">{useListed()}</span>;
}

/**
 * Renders an item's file through the hook under test.
 *
 * @returns The file's name and list as text.
 */
function Filing(): ReactElement {
  const { file, type } = useItem();

  return <span data-testid="item">{`${file.name} ${type}`}</span>;
}

/**
 * Reports a label through the hook under test.
 *
 * @returns Nothing.
 */
function Labelling(): null {
  useLabelled();

  return null;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <SharedProvider value={{ disabled: false, locale: "en-US", readOnly: true, size: "lg" }}>
        <Sharing />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("false true lg");
  });

  it("returns the list the group above passes", () => {
    render(
      <ListedProvider value="rejected">
        <Listing />
      </ListedProvider>,
    );

    expect(screen.getByTestId("listed").textContent).toBe("rejected");
  });

  it("returns the file the item above passes", () => {
    render(
      <ItemProvider value={{ file: STATEMENT, type: "accepted" }}>
        <Filing />
      </ItemProvider>,
    );

    expect(screen.getByTestId("item").textContent).toBe("statement.pdf accepted");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Sharing />)).toThrow(
      "A part of FileUpload was drawn outside the root that holds it together.",
    );
  });

  it("throws for a label outside a root", () => {
    expect(() => render(<Labelling />)).toThrow(
      "A part of FileUpload was drawn outside the root that holds it together.",
    );
  });

  it("throws for an item outside an item group", () => {
    expect(() => render(<Listing />)).toThrow(
      "A part of FileUpload.ItemGroup was drawn outside the root that holds it together.",
    );
  });

  it("throws for an item part outside an item", () => {
    expect(() => render(<Filing />)).toThrow(
      "A part of FileUpload.Item was drawn outside the root that holds it together.",
    );
  });
});
