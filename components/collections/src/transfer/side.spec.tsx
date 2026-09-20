import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { useListCollection } from "#collection/collection.ts";
import { withProvider } from "#transfer/context.ts";
import { Side, type SideProps } from "#transfer/side.tsx";
import { type Place, PLACES } from "#transfer/transfer.fixtures.tsx";

/**
 * Draws the frame a side needs above it, which sets the variants it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Draws one side, building the collection it holds from whatever rows a case hands it.
 *
 * @param props - Whatever the case sets on the side, less the collection.
 * @returns The side, inside the frame it needs.
 */
function Held(props: Partial<Omit<SideProps<Place>, "collection">> = {}): ReactElement {
  const { collection } = useListCollection<Place>({
    itemToString: (place) => place.label,
    itemToValue: (place) => place.value,
    rows: PLACES,
  });

  return (
    <Framed>
      <Side<Place>
        collection={collection}
        itemToValue={(place) => place.value}
        mark="check"
        nothing="Nothing here."
        onPick={vi.fn<(picked: readonly string[]) => void>()}
        picked={[]}
        tall={3}
        title="Available"
        {...props}
      />
    </Framed>
  );
}

describe("Side", () => {
  it("names itself with the words it is given", async () => {
    await drawn(<Held />);

    expect(screen.getByRole("listbox", { name: "Available" })).toBeTruthy();
  });

  it("draws one row per row of the collection", async () => {
    await drawn(<Held />);

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("draws a box at the start of every row, because a side takes several at a time", async () => {
    const { container } = await drawn(<Held />);

    expect(slotElement(container, "listbox", "itemCheckbox")).toBeTruthy();
  });

  it("keeps room for every row there is, whichever side the rows are on", async () => {
    const { container } = await drawn(<Held tall={7} />);

    expect(slotElement(container, "listbox", "content").style.minBlockSize).toBe(
      "calc(var(--listbox-row) * 7)",
    );
  });

  it("reports the rows a reader picks on it", async () => {
    const picked = vi.fn<(picked: readonly string[]) => void>();

    await drawn(<Held onPick={picked} />);
    await pressed(screen.getByRole("option", { name: /Invoices/u }));

    expect(picked).toHaveBeenCalledWith(["invoices"]);
  });

  it("draws a line under a row's name where a caller writes one", async () => {
    await drawn(<Held description={(place) => `Value ${place.value}`} />);

    expect(screen.getByText("Value invoices")).toBeTruthy();
  });

  it("says nothing of its own where a caller gives it no words for an empty side", () => {
    const { container } = render(<Held nothing={undefined} />);

    expect(container.querySelector("[class*=empty]")).toBeNull();
  });
});
