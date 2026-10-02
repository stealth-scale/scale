import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Failed } from "#catalogue/failed.tsx";

describe("Failed", () => {
  it("renders the page.failed message with the failure reason", async () => {
    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="page.failed" />);

    expect(getByRole("alert").textContent).toBe("This page could not be loaded: gone");
  });

  it("renders the props.failed message with the failure reason", async () => {
    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="props.failed" />);

    expect(getByRole("alert").textContent).toBe("What the parts accept could not be read: gone");
  });

  it("reloads the document when the reload button is pressed", async () => {
    const reload = vi.fn();

    vi.stubGlobal("location", { href: globalThis.location.href, reload });

    const { getByRole } = await drawn(<Failed failure={new Error("gone")} said="page.failed" />);

    fireEvent.click(getByRole("button", { name: "Reload the page" }));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("reloads no document before the reload button is pressed", async () => {
    const reload = vi.fn();

    vi.stubGlobal("location", { href: globalThis.location.href, reload });

    await drawn(<Failed failure={new Error("gone")} said="page.failed" />);

    expect(reload).not.toHaveBeenCalled();
  });
});
