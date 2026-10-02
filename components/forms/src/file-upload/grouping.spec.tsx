import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { useGrouping } from "#file-upload/grouping.ts";
import { type FileUploadOptions } from "#file-upload/machine.ts";
import { type Size } from "#file-upload/state.ts";

/**
 * Describes what the probe takes: the machine's options and the size the root states.
 */
interface Probed extends FileUploadOptions {
  /**
   * Size the root states, or nothing.
   */
  readonly size?: Size | undefined;
}

/**
 * Resolves the grouping with the options the case sets and renders it as text.
 *
 * @param props - The machine options and the size.
 * @returns The naming and the shared state as text.
 */
function Grouped({ size, ...options }: Probed): ReactElement {
  const { naming, shared } = useGrouping(options, {}, size);

  return (
    <>
      <span data-testid="naming">{JSON.stringify(naming)}</span>
      <span data-testid="shared">{JSON.stringify(shared)}</span>
    </>
  );
}

/**
 * Returns what the probe rendered under a test ID, parsed.
 *
 * @param id - The test ID.
 * @returns The parsed value.
 */
function read(id: string): unknown {
  return JSON.parse(screen.getByTestId(id).textContent);
}

describe("useGrouping", () => {
  it("names nothing outside a field or a fieldset", async () => {
    await drawn(<Grouped />);

    expect(read("naming")).toStrictEqual({});
  });

  it("shares the default state outside a field", async () => {
    await drawn(<Grouped />);

    expect(read("shared")).toStrictEqual({
      disabled: false,
      locale: "en-US",
      readOnly: false,
      size: "md",
    });
  });

  it("shares the locale the caller passes", async () => {
    await drawn(<Grouped locale="de-DE" />);

    expect(read("shared")).toMatchObject({ locale: "de-DE" });
  });

  it("names the group after the label of the field around it", async () => {
    await drawn(
      <Field.Root id="evidence">
        <Grouped />
      </Field.Root>,
    );

    expect(read("naming")).toMatchObject({ "aria-labelledby": "evidence-label" });
  });

  it("describes the group by the texts of the field around it", async () => {
    await drawn(
      <Field.Root id="evidence">
        <Grouped />
      </Field.Root>,
    );

    expect(read("naming")).toMatchObject({
      "aria-describedby": "evidence-helper evidence-error",
    });
  });

  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root id="claim">
        <Grouped />
      </Fieldset.Root>,
    );

    expect(read("naming")).toStrictEqual({ "aria-labelledby": "claim-label" });
  });

  it("shares the states of the field around it", async () => {
    await drawn(
      <Field.Root disabled readOnly size="lg">
        <Grouped />
      </Field.Root>,
    );

    expect(read("shared")).toMatchObject({ disabled: true, readOnly: true, size: "lg" });
  });

  it("shares the states the caller passes over the field's", async () => {
    await drawn(
      <Field.Root disabled>
        <Grouped disabled={false} size="sm" />
      </Field.Root>,
    );

    expect(read("shared")).toMatchObject({ disabled: false, readOnly: false, size: "sm" });
  });
});
