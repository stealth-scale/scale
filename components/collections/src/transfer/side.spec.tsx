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
 * Renders the root `div` that provides the variants.
 */
const Framed = withProvider("div", "root");

/**
 * Renders one side over the fixture's rows with the props the case sets.
 *
 * @param props - The props the case sets, without the collection.
 * @returns The side inside the root.
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
  it("names the listbox by its title", async () => {
    await drawn(<Held />);

    expect(screen.getByRole("listbox", { name: "Available" })).toBeTruthy();
  });

  it("renders an option per row", async () => {
    await drawn(<Held />);

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders a checkbox at a row's start", async () => {
    const { container } = await drawn(<Held />);

    expect(slotElement(container, "listbox", "itemCheckbox")).toBeTruthy();
  });

  it("sets --transfer-rows to tall", async () => {
    const { container } = await drawn(<Held tall={7} />);

    expect(
      slotElement(container, "transfer", "side").style.getPropertyValue("--transfer-rows"),
    ).toBe("7");
  });

  it("sets no inline size on the list", async () => {
    const { container } = await drawn(<Held />);

    expect(slotElement(container, "listbox", "content").style.minBlockSize).toBe("");
  });

  it("calls onPick with the checked values", async () => {
    const picked = vi.fn<(picked: readonly string[]) => void>();

    await drawn(<Held onPick={picked} />);
    await pressed(screen.getByRole("option", { name: /Invoices/u }));

    expect(picked).toHaveBeenCalledWith(["invoices"]);
  });

  it("renders a row's description", async () => {
    await drawn(<Held description={(place) => `Value ${place.value}`} />);

    expect(screen.getByText("Value invoices")).toBeTruthy();
  });

  it("renders no empty part without nothing", () => {
    const { container } = render(<Held nothing={undefined} />);

    expect(container.querySelector("[class*=empty]")).toBeNull();
  });
});
