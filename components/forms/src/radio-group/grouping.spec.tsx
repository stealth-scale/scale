import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { useGrouping } from "#radio-group/grouping.ts";

/**
 * Runs the hook and renders what it settles on as data attributes.
 *
 * @returns A `span` carrying the name, the description and the size.
 */
function Probe(): ReactElement {
  const { attributes, size } = useGrouping({});

  return (
    <span
      data-described={attributes["aria-describedby"] ?? "none"}
      data-named={attributes["aria-labelledby"] ?? "none"}
      data-size={size ?? "none"}
      data-testid="probe"
    />
  );
}

/**
 * Renders the probe inside a fieldset of the small size, with a legend.
 *
 * @returns The fieldset.
 */
function grouped(): ReactElement {
  return (
    <Fieldset.Root id="speed" size="sm">
      <Fieldset.Legend>Delivery speed</Fieldset.Legend>
      <Probe />
    </Fieldset.Root>
  );
}

/**
 * Renders the probe inside an invalid field of the large size.
 *
 * @returns The field.
 */
function fielded(): ReactElement {
  return (
    <Field.Root id="window" invalid size="lg">
      <Probe />
    </Field.Root>
  );
}

describe("useGrouping", () => {
  it("names the group after the legend of the fieldset around it", async () => {
    await drawn(grouped());

    expect(screen.getByTestId("probe").dataset["named"]).toBe("speed-label");
  });

  it("returns the size of the fieldset around it", async () => {
    await drawn(grouped());

    expect(screen.getByTestId("probe").dataset["size"]).toBe("sm");
  });

  it("lists the texts of the field around it in aria-describedby", async () => {
    await drawn(fielded());

    expect(screen.getByTestId("probe").dataset["described"]).toBe("window-helper window-error");
  });

  it("returns the size of the field around it", async () => {
    await drawn(fielded());

    expect(screen.getByTestId("probe").dataset["size"]).toBe("lg");
  });

  it("names the group by nothing outside a field or a fieldset", async () => {
    await drawn(<Probe />);

    expect(screen.getByTestId("probe").dataset["named"]).toBe("none");
  });
});
