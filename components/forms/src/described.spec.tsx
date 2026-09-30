import { type ReactElement, useState } from "react";

import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Describe, useDescribed } from "#described.ts";

function Part({ describe: report, given }: { describe: Describe; given?: string }): ReactElement {
  const id = useDescribed(report, given);

  return <span id={id}>Leaves overnight.</span>;
}

function Card({ given, shown }: { given?: string; shown: boolean }): ReactElement {
  const [ids, setIds] = useState<readonly string[]>([]);

  return (
    <>
      {shown ? <Part describe={setIds} {...(given === undefined ? {} : { given })} /> : null}
      <output>{ids.join(" ")}</output>
    </>
  );
}

describe("useDescribed", () => {
  it("reports a generated ID while the part is mounted", async () => {
    await drawn(<Card shown />);

    expect(screen.getByRole("status").textContent).toBe(screen.getByText("Leaves overnight.").id);
  });

  it("reports the ID the caller passes", async () => {
    await drawn(<Card given="overnight" shown />);

    expect(screen.getByRole("status").textContent).toBe("overnight");
  });

  it("removes the ID when the part unmounts", async () => {
    const { rerender } = await drawn(<Card given="overnight" shown />);

    await act(async () => {
      rerender(<Card given="overnight" shown={false} />);
      await Promise.resolve();
    });

    expect(screen.getByRole("status").textContent).toBe("");
  });
});
