import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Failed } from "#catalogue/failed.tsx";

describe("Failed", () => {
  it("says what could not be loaded and why", async () => {
    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="page.failed" />);

    expect(getByRole("alert").textContent).toBe("This page could not be loaded: gone");
  });

  it("says the same for the parts under their own sentence", async () => {
    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="props.failed" />);

    expect(getByRole("alert").textContent).toBe("What the parts accept could not be read: gone");
  });

  it("reloads the document when the reader asks and not before", async () => {
    const reload = vi.fn();

    vi.stubGlobal("location", { href: globalThis.location.href, reload });

    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="page.failed" />);

    expect(reload).not.toHaveBeenCalled();

    fireEvent.click(getByRole("button", { name: "Reload the page" }));

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
