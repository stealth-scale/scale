import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Display, DisplayProvider, useDisplay } from "#sample/display.ts";

/**
 * Draws what the hook resolved, so a specification reads it out of the document.
 */
function Probe(stated: Display): ReactElement {
  return <output>{JSON.stringify(useDisplay(stated))}</output>;
}

/**
 * Reads what the hook resolved under the container's value.
 */
function resolvedIn(held: Display, stated: Display): Display {
  const { container } = render(
    <DisplayProvider value={held}>
      <Probe {...stated} />
    </DisplayProvider>,
  );

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the probe writes what the hook returned, which is of this shape
  return JSON.parse(container.textContent ?? "{}") as Display;
}

describe("useDisplay", () => {
  it("reads nothing outside a container", () => {
    const { container } = render(<Probe />);

    expect(JSON.parse(container.textContent ?? "{}")).toStrictEqual({});
  });

  it("takes both axes from the container when the sample states neither", () => {
    expect(resolvedIn({ place: "center", variant: "outline" }, {})).toStrictEqual({
      place: "center",
      variant: "outline",
    });
  });

  it("lets a sample's own look win over the container's", () => {
    expect(
      resolvedIn({ place: "center", variant: "outline" }, { variant: "subtle" }),
    ).toStrictEqual({ place: "center", variant: "subtle" });
  });

  it("takes the axis the sample leaves out from the container", () => {
    expect(resolvedIn({ variant: "outline" }, { place: "stretch" })).toStrictEqual({
      place: "stretch",
      variant: "outline",
    });
  });
});
