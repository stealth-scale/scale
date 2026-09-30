import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SharedProvider, useLabelled, useShared } from "#signature-pad/state.ts";

function Sharing(): ReactElement {
  const { ink, invalid, readOnly } = useShared();

  return (
    <span data-testid="shared">{`${String(ink)} ${String(invalid)} ${String(readOnly)}`}</span>
  );
}

function Labelling(): null {
  useLabelled();

  return null;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <SharedProvider value={{ described: {}, ink: "navy", invalid: true, readOnly: false }}>
        <Sharing />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("navy true false");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Sharing />)).toThrow(
      "A part of SignaturePad was drawn outside the root that holds it together.",
    );
  });

  it("throws for a label outside a root", () => {
    expect(() => render(<Labelling />)).toThrow(
      "A part of SignaturePad was drawn outside the root that holds it together.",
    );
  });
});
