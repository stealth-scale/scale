import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { only, violations } from "@stealthscale/testing-react";

import { Caption } from "#chart/caption.tsx";
import { charted } from "#chart/chart.fixtures.tsx";

describe("Caption", () => {
  it("passes the component conformance checks as a figcaption", () => {
    expect(
      violations(Caption, {
        as: true,
        children: true,
        element: "FIGCAPTION",
        subject: (container) => only(only(container)),
        wrapper: (children) => charted({ children }),
      }),
    ).toStrictEqual([]);
  });

  it("names the figure it is in", () => {
    const { getByRole } = render(
      charted({ children: <Caption>Refunds rose on Thursday.</Caption> }),
    );

    expect(getByRole("figure", { name: "Refunds rose on Thursday." })).toBeDefined();
  });

  it("takes the ID the figure is labelled by over an ID the caller passes", () => {
    const { getByRole } = render(
      charted({ children: <Caption id="caller">Refunds rose on Thursday.</Caption> }),
    );
    const figure = getByRole("figure");

    expect(figure.querySelector("figcaption")?.id).toBe(figure.getAttribute("aria-labelledby"));
  });
});
