import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Region } from "#toast/index.ts";
import { useToast } from "#toast/machine.ts";
import { raised, toasterOf } from "#toast/toast.fixtures.tsx";

/**
 * Renders the type the toast's api reports.
 *
 * @returns A `span` with the type.
 */
function Reader(): ReactElement {
  const api = useToast();

  return <span data-testid="type">{api.type}</span>;
}

describe("Actor", () => {
  it("provides the toast's api to the parts the render function returns", async () => {
    const toaster = toasterOf();

    await drawn(<Region toaster={toaster}>{() => <Reader />}</Region>);
    await raised(toaster, { title: "Payout held", type: "warning" });

    expect(screen.getByTestId("type").textContent).toBe("warning");
  });

  it("passes the toast to the render function", async () => {
    const toaster = toasterOf();

    await drawn(<Region toaster={toaster}>{(toast) => <span>{toast.title}</span>}</Region>);
    await raised(toaster, { title: "Payout held" });

    expect(screen.getByText("Payout held").tagName).toBe("SPAN");
  });
});
