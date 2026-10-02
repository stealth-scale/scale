import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Confirmation } from "#settings/confirmation.tsx";

function settle(): (off: boolean) => void {
  return vi.fn<(off: boolean) => void>();
}

async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe("Confirmation", () => {
  it("names the plugin the person switches off", () => {
    render(<Confirmation dependents={["Payroll"]} name="Time off" onSettle={settle()} />);

    expect(screen.getByText("Turn off Time off?")).toBeTruthy();
  });

  it("lists the plugins that turn off with it in the person's language", () => {
    render(
      <Confirmation dependents={["Billing", "Payroll"]} name="Time off" onSettle={settle()} />,
    );

    expect(screen.getByText("Billing and Payroll need it and turn off with it.")).toBeTruthy();
  });

  it("writes one plugin that turns off with it in the singular", () => {
    render(<Confirmation dependents={["Payroll"]} name="Time off" onSettle={settle()} />);

    expect(screen.getByText("Payroll needs it and turns off with it.")).toBeTruthy();
  });

  it("settles with true where the person turns the plugin off", () => {
    const onSettle = vi.fn<(off: boolean) => void>();

    render(<Confirmation dependents={["Payroll"]} name="Time off" onSettle={onSettle} />);
    fireEvent.click(screen.getByRole("button", { name: "Turn off" }));

    expect(onSettle.mock.lastCall).toStrictEqual([true]);
  });

  it("settles with false where the person keeps the plugin on", () => {
    const onSettle = vi.fn<(off: boolean) => void>();

    render(<Confirmation dependents={["Payroll"]} name="Time off" onSettle={onSettle} />);
    fireEvent.click(screen.getByRole("button", { name: "Keep on" }));

    expect(onSettle.mock.lastCall).toStrictEqual([false]);
  });

  it("announces its words through the announcer's polite region", async () => {
    render(<Confirmation dependents={["Payroll"]} name="Profile" onSettle={settle()} />);
    await framed();

    expect(document.querySelector('[aria-live="polite"]')?.textContent).toContain(
      "Turn off Profile? Payroll needs it and turns off with it.",
    );
  });
});
