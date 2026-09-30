import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type Size, useGrouping } from "#signature-pad/grouping.ts";
import { type SignaturePadOptions } from "#signature-pad/machine.ts";

interface Probed extends SignaturePadOptions {
  readonly invalid?: boolean | undefined;
  readonly size?: Size | undefined;
}

function Grouped({ invalid, size, ...options }: Probed): ReactElement {
  const { disabled, named, shared, size: settled } = useGrouping(options, invalid, size);

  return (
    <>
      <span data-testid="named">{JSON.stringify(named)}</span>
      <span data-testid="shared">{JSON.stringify({ ...shared, disabled, size: settled })}</span>
    </>
  );
}

function read(id: string): unknown {
  return JSON.parse(screen.getByTestId(id).textContent);
}

describe("useGrouping", () => {
  it("names nothing outside a field or a fieldset", async () => {
    await drawn(<Grouped />);

    expect(read("named")).toStrictEqual({});
  });

  it("shares the default state outside a field", async () => {
    await drawn(<Grouped />);

    expect(read("shared")).toStrictEqual({
      described: {},
      disabled: false,
      invalid: false,
      readOnly: false,
      size: "md",
    });
  });

  it("names the group after the label of the field around it", async () => {
    await drawn(
      <Field.Root id="consent">
        <Grouped />
      </Field.Root>,
    );

    expect(read("named")).toStrictEqual({ "aria-labelledby": "consent-label" });
  });

  it("describes the control by the texts of the field around it", async () => {
    await drawn(
      <Field.Root id="consent">
        <Grouped />
      </Field.Root>,
    );

    expect(read("shared")).toMatchObject({
      described: {
        "aria-describedby": "consent-helper consent-error",
        "aria-labelledby": "consent-label",
      },
    });
  });

  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root id="lease">
        <Grouped />
      </Fieldset.Root>,
    );

    expect(read("named")).toStrictEqual({ "aria-labelledby": "lease-label" });
  });

  it("shares the states of the field around it", async () => {
    await drawn(
      <Field.Root disabled invalid readOnly size="lg">
        <Grouped />
      </Field.Root>,
    );

    expect(read("shared")).toMatchObject({
      disabled: true,
      invalid: true,
      readOnly: true,
      size: "lg",
    });
  });

  it("shares the states the caller passes over the field's", async () => {
    await drawn(
      <Field.Root disabled invalid>
        <Grouped disabled={false} invalid={false} size="sm" />
      </Field.Root>,
    );

    expect(read("shared")).toMatchObject({ disabled: false, invalid: false, size: "sm" });
  });

  it("shares the ink the caller passes in drawing", async () => {
    await drawn(<Grouped drawing={{ fill: "navy" }} />);

    expect(read("shared")).toMatchObject({ ink: "navy" });
  });
});
