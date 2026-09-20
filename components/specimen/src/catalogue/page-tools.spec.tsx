import { type ReactElement, useRef } from "react";

import { describe, expect, it } from "vitest";

import { Button } from "@stealthscale/component-actions";
import { Card } from "@stealthscale/component-surfaces";
import { drawn, pressed } from "@stealthscale/testing-react";

import { Tools } from "#catalogue/page-tools.tsx";

/**
 * Matches the line a clean audit closes with, whatever it held the scene to.
 */
const CLEAN = /Nothing found, against \d+ rules?/u;

/**
 * Draws the footer in the card it belongs to, over an element an audit can read.
 */
function Carded({
  broken,
  code,
}: {
  readonly broken: boolean;
  readonly code: null | string;
}): ReactElement {
  const stage = useRef<HTMLDivElement>(null);

  return (
    <Card.Root as="div">
      <Card.Content ref={stage}>{broken ? <Button /> : "A line of words."}</Card.Content>
      <Tools code={code} stage={stage} title="Sizes" />
    </Card.Root>
  );
}

/**
 * Draws the card, with the source the case wants in it.
 */
function carded(code: null | string = "const one = 1;"): ReactElement {
  return <Carded broken={false} code={code} />;
}

/**
 * Draws the card over a scene that breaks a rule, which is what opens the audit's panel.
 */
function flawed(): ReactElement {
  return <Carded broken code="const one = 1;" />;
}

describe("Tools", () => {
  it("offers the source and the audit", async () => {
    const { getAllByRole } = await drawn(carded());

    expect(getAllByRole("button").map((one) => one.textContent)).toStrictEqual(["Source", "Audit"]);
  });

  it("says so where the index cut no source for the scene", async () => {
    const { getByText } = await drawn(carded(null));

    expect(getByText("No source for this scene")).toBeDefined();
  });

  it("still offers the audit where there is no source", async () => {
    const { getAllByRole } = await drawn(carded(null));

    expect(getAllByRole("button").map((one) => one.textContent)).toStrictEqual(["Audit"]);
  });

  it("draws neither panel until a reader opens one", async () => {
    const { queryByRole } = await drawn(carded());

    expect(queryByRole("button", { name: "Copy the code" })).toBeNull();
  });

  it("draws the source once its control is pressed", async () => {
    const { getByRole } = await drawn(carded());

    await pressed(getByRole("button", { name: "Source" }));

    expect(getByRole("button", { name: "Copy the code" })).toBeDefined();
  });

  it("hides the source when its control is pressed again", async () => {
    const { getByRole, queryByRole } = await drawn(carded());

    await pressed(getByRole("button", { name: "Source" }));
    await pressed(getByRole("button", { name: "Source" }));

    expect(queryByRole("button", { name: "Copy the code" })).toBeNull();
  });

  it("draws what the audit found once its control is pressed", async () => {
    const { findByText, getByRole } = await drawn(carded());

    await pressed(getByRole("button", { name: "Audit" }));

    expect(await findByText(CLEAN)).toBeDefined();
  });

  it("closes the source when the audit opens", async () => {
    const { findByText, getByRole, queryByRole } = await drawn(carded());

    await pressed(getByRole("button", { name: "Source" }));
    await pressed(getByRole("button", { name: "Audit" }));
    await findByText(CLEAN);

    expect(queryByRole("button", { name: "Copy the code" })).toBeNull();
  });

  it("opens no panel where the scene broke no rule", async () => {
    const { findByText, getByRole } = await drawn(carded());

    await pressed(getByRole("button", { name: "Audit" }));
    await findByText(CLEAN);

    expect(getByRole("button", { name: "Audit" }).getAttribute("aria-expanded")).toBeNull();
  });

  it("points both controls at the panel they open", async () => {
    const { findByRole, getByRole } = await drawn(flawed());

    await pressed(getByRole("button", { name: "Audit" }));
    await findByRole("link");

    expect(getByRole("button", { name: "Source" }).getAttribute("aria-controls")).toBe(
      getByRole("button", { name: "Audit" }).getAttribute("aria-controls"),
    );
  });

  it("closes the audit when its control is pressed again", async () => {
    const { findByRole, getByRole, queryByRole } = await drawn(flawed());

    await pressed(getByRole("button", { name: "Audit" }));
    await findByRole("link");
    await pressed(getByRole("button", { name: "Audit" }));

    expect(queryByRole("link")).toBeNull();
  });
});
