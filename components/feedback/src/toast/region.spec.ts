import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

/**
 * Reports the page as hidden or shown, and dispatches the change a browser dispatches.
 *
 * @param state - The visibility the page takes.
 */
async function shown(state: DocumentVisibilityState): Promise<void> {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(state);
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
    await Promise.resolve();
  });
}

describe("Region", () => {
  it("returns no accessibility violation with a toast", async () => {
    const toaster = toasterOf();

    toaster.create({ description: "The ledger was exported.", title: "Exported" });

    await expect(accessibilityViolations(() => regioned(toaster))).resolves.toStrictEqual([]);
  });

  it("renders a region named Notifications by default", async () => {
    await drawn(regioned(toasterOf()));

    expect(screen.getByRole("region", { name: "Notifications, bottom-end (alt+T)" })).toBeDefined();
  });

  it("names the region by label", async () => {
    await drawn(regioned(toasterOf(), { label: "Payouts" }));

    expect(screen.getByRole("region", { name: "Payouts, bottom-end (alt+T)" })).toBeDefined();
  });

  it("renders a toast raised after it mounts", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("status").textContent).toContain("Exported");
  });

  it("renders the newest toast first", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "First" });
    await raised(toaster, { title: "Second" });

    expect(screen.getAllByRole("status")[0]?.textContent).toContain("Second");
  });

  it("pauses every toast while the page is hidden", async () => {
    const toaster = toasterOf();
    const pause = vi.spyOn(toaster, "pause");

    await drawn(regioned(toaster));
    await shown("hidden");

    expect(pause).toHaveBeenCalledWith();
  });

  it("resumes every toast when the page shows again", async () => {
    const toaster = toasterOf();
    const resume = vi.spyOn(toaster, "resume");

    await drawn(regioned(toaster));
    await shown("visible");

    expect(resume).toHaveBeenCalledWith();
  });

  it("leaves the toasts running while the page is hidden with pauseOnPageIdle false", async () => {
    const toaster = toasterOf({ pauseOnPageIdle: false });
    const pause = vi.spyOn(toaster, "pause");

    await drawn(regioned(toaster));
    await shown("hidden");

    expect(pause).not.toHaveBeenCalled();
  });

  it("renders a div", async () => {
    const { container } = await drawn(regioned(toasterOf()));

    expect(slotElement(container, "toast", "region").tagName).toBe("DIV");
  });
});
