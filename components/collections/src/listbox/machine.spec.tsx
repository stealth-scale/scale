import { type ReactElement } from "react";

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed } from "#listbox/listbox.fixtures.tsx";
import {
  ApiProvider,
  type ListboxOptions,
  splitListboxProps,
  useListbox,
  useListboxMachine,
} from "#listbox/machine.ts";
import { COLLECTION } from "#listbox/rows.fixtures.ts";

/**
 * Moves focus to the element with the role and returns the ID the listbox's
 * `aria-activedescendant` points at.
 */
async function focusedOn(role: "listbox" | "textbox"): Promise<null | string> {
  act(() => {
    screen.getByRole(role).focus();
  });
  await settled();

  return screen.getByRole("listbox").getAttribute("aria-activedescendant");
}

/**
 * Returns the ID of the row named by the text.
 */
function rowId(name: string): string {
  return screen.getByRole("option", { name }).id;
}

/**
 * Runs the machine with the options the case sets and renders its value through a part's hook.
 *
 * @param props - The machine options.
 * @returns The provider around the reader.
 */
function Running(props: ListboxOptions): ReactElement {
  const api = useListboxMachine({ ...props, id: props.id ?? "probe" });

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the selected values from the api a part reads.
 *
 * @returns A `span` with the values joined by commas.
 */
function Reader(): ReactElement {
  const api = useListbox();

  return <span data-testid="value">{api.value.join(",")}</span>;
}

describe("splitListboxProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitListboxProps({
      collection: COLLECTION,
      id: "probe",
      loopFocus: true,
    });

    expect(options).toMatchObject({ id: "probe", loopFocus: true });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitListboxProps({ collection: COLLECTION, id: "probe", size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useListboxMachine", () => {
  it("returns an api that reports the value", () => {
    render(<Running collection={COLLECTION} value={["reports"]} />);

    expect(screen.getByTestId("value").textContent).toBe("reports");
  });

  it("returns an api with no value by default", () => {
    render(<Running collection={COLLECTION} />);

    expect(screen.getByTestId("value").textContent).toBe("");
  });

  it("highlights the first row when the list takes focus with nothing selected", async () => {
    await drawn(composed());

    await expect(focusedOn("listbox")).resolves.toBe(rowId("Invoices"));
  });

  it("highlights the selected row when the list takes focus", async () => {
    await drawn(composed({ defaultValue: ["reports"] }));

    await expect(focusedOn("listbox")).resolves.toBe(rowId("Reports"));
  });

  it("highlights the first selected row in the collection's order", async () => {
    await drawn(composed({ defaultValue: ["settings", "reports"], selectionMode: "multiple" }));

    await expect(focusedOn("listbox")).resolves.toBe(rowId("Reports"));
  });

  it("keeps the highlighted row when the list takes focus", async () => {
    await drawn(composed({ defaultHighlightedValue: "settings", defaultValue: ["reports"] }));

    await expect(focusedOn("listbox")).resolves.toBe(rowId("Settings"));
  });

  it("highlights no row when the filter field takes focus", async () => {
    await drawn(composed({ defaultValue: ["reports"] }, true));

    await expect(focusedOn("textbox")).resolves.toBeNull();
  });
});
