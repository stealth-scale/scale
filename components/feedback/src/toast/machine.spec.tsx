import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { useRegionMachine, useToast } from "#toast/machine.ts";
import { toasterOf } from "#toast/toast.fixtures.tsx";

/**
 * Renders the type the toast's api reports, which throws outside a toast.
 *
 * @returns A `span` with the type.
 */
function Reader(): ReactElement {
  const api = useToast();

  return <span>{api.type}</span>;
}

/**
 * Starts the group machine and renders the number of toasts its api reports.
 *
 * @param props - The direction the case passes.
 * @returns A `span` with the count.
 */
function Counted({ dir }: { readonly dir?: "ltr" | "rtl" }): ReactElement {
  const { api } = useRegionMachine(toasterOf(), dir);

  return <span data-testid="count">{api.getCount()}</span>;
}

describe("useToast", () => {
  it("throws with the toast's name outside a toast", () => {
    expect(() => render(<Reader />)).toThrow(
      "A part of Toast was drawn outside the root that holds it together.",
    );
  });
});

describe("useRegionMachine", () => {
  it("returns an api with no toasts for an empty toaster", async () => {
    await drawn(<Counted />);

    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("returns an api with no toasts in a right-to-left region", async () => {
    await drawn(<Counted dir="rtl" />);

    expect(screen.getByTestId("count").textContent).toBe("0");
  });
});
