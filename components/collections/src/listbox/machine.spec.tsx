import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type ListboxOptions,
  splitListboxProps,
  useListbox,
  useListboxMachine,
} from "#listbox/machine.ts";
import { COLLECTION } from "#listbox/rows.fixtures.ts";

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
});
