import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { idsOf } from "#field/ids.ts";
import { type FieldState } from "#field/state.ts";
import { tally } from "#field/tally.ts";
import { createNaming, namesOf } from "#naming.ts";

const [NamingProvider, useNamed] = createNaming("Probe");

/**
 * Reports a name through the hook under test.
 *
 * @param props - The name to report.
 * @returns Nothing visible.
 */
function Reporting(props: { readonly name: string | undefined }): ReactElement {
  useNamed(props.name);

  return <span />;
}

/**
 * Returns the state of a field whose ID is `role`.
 */
function field(): FieldState {
  return {
    disabled: false,
    ids: idsOf("role"),
    invalid: false,
    readOnly: false,
    required: true,
    tally: tally(),
  };
}

describe("naming", () => {
  it("reports the name while the field is mounted", () => {
    const setNamed = vi.fn<(name: string | undefined) => void>();

    render(
      <NamingProvider value={setNamed}>
        <Reporting name="Zone" />
      </NamingProvider>,
    );

    expect(setNamed).toHaveBeenLastCalledWith("Zone");
  });

  it("reports a changed name", () => {
    const setNamed = vi.fn<(name: string | undefined) => void>();
    const { rerender } = render(
      <NamingProvider value={setNamed}>
        <Reporting name="Zone" />
      </NamingProvider>,
    );

    rerender(
      <NamingProvider value={setNamed}>
        <Reporting name="Region" />
      </NamingProvider>,
    );

    expect(setNamed).toHaveBeenLastCalledWith("Region");
  });

  it("withdraws the name when the field unmounts", () => {
    const setNamed = vi.fn<(name: string | undefined) => void>();
    const { unmount } = render(
      <NamingProvider value={setNamed}>
        <Reporting name="Zone" />
      </NamingProvider>,
    );

    unmount();

    expect(setNamed.mock.lastCall).toStrictEqual([undefined]);
  });

  it("throws with the component's name for a field outside its root", () => {
    expect(() => render(<Reporting name="Zone" />)).toThrow(
      "A part of Probe was drawn outside the root that holds it together.",
    );
  });

  it("names the component by its own label while one is mounted", () => {
    expect(namesOf(field(), "own-label").label).toBe("own-label");
  });

  it("names the component by the field's label without its own", () => {
    expect(namesOf(field()).label).toBe("role-label");
  });

  it("names the component by nothing outside a field without a label", () => {
    expect(namesOf(undefined, undefined, "Zone").label).toBeUndefined();
  });

  it("returns the name the field reports", () => {
    expect(namesOf(undefined, undefined, "Zone").name).toBe("Zone");
  });

  it("describes the field by the field's helper and error texts", () => {
    expect(namesOf(field()).describedBy).toBe("role-helper role-error");
  });

  it("describes the field by nothing outside a field", () => {
    expect(namesOf().describedBy).toBeUndefined();
  });
});
