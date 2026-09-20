import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Pick } from "#framed/address.ts";
import { FramedProvider } from "#framed/context.ts";
import { useFramedCell } from "#matrix/framed.ts";

const SIZES = { knob: "size", of: ["sm", "md", "lg"] };

const LOOKS = { knob: "variant", of: ["outline", "solid"] };

function Crossed(): ReactElement {
  const cell = useFramedCell(SIZES, LOOKS, (size, look) => `${look} ${size}`);

  return <output>{cell === undefined ? "grid" : cell}</output>;
}

function Alone(): ReactElement {
  const cell = useFramedCell(SIZES, undefined, (size, other) => `${size} ${String(other)}`);

  return <output>{cell === undefined ? "grid" : cell}</output>;
}

/**
 * Reads what a component draws under a pick.
 */
function picked(pick: Pick | undefined, Probe: () => ReactElement): null | string {
  const { container } = render(
    pick === undefined ? <Probe /> : <FramedProvider value={pick}>{<Probe />}</FramedProvider>,
  );

  return container.textContent;
}

describe("useFramedCell", () => {
  it("answers nothing outside a framed document", () => {
    expect(picked(undefined, Crossed)).toBe("grid");
  });

  it("draws the cell at the positions picked on both axes", () => {
    expect(picked({ across: 1, value: 2 }, Crossed)).toBe("solid lg");
  });

  it("draws the first cell where a position is not picked", () => {
    expect(picked({}, Crossed)).toBe("outline sm");
  });

  it("hands the absent axis over as undefined where none crosses", () => {
    expect(picked({ value: 1 }, Alone)).toBe("md undefined");
  });

  it("draws nothing for a position past either axis", () => {
    expect(picked({ value: 7 }, Crossed)).toBe("");
    expect(picked({ across: 7, value: 0 }, Crossed)).toBe("");
  });
});
