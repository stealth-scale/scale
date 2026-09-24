import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { useRevealed } from "#app-shell/revealed.ts";

/**
 * Renders the hook's state in a button whose press opens the sheet.
 *
 * @param props - Whether the shell is too narrow for the panel beside the page.
 * @returns A button with `shown` or `hidden`.
 */
function Reader({ narrow }: { readonly narrow: boolean }): ReactElement {
  const [shown, setOpen] = useRevealed(narrow);

  return (
    <button
      onClick={() => {
        setOpen(true);
      }}
      type="button"
    >
      {shown ? "shown" : "hidden"}
    </button>
  );
}

describe("useRevealed", () => {
  it("starts hidden", () => {
    render(<Reader narrow />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });

  it("shows the sheet when set open", async () => {
    render(<Reader narrow />);

    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("shown");
  });

  it("hides the sheet when the shell widens", async () => {
    const { rerender } = render(<Reader narrow />);

    await pressed(screen.getByRole("button"));
    rerender(<Reader narrow={false} />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });

  it("starts hidden again when the shell narrows again", async () => {
    const { rerender } = render(<Reader narrow />);

    await pressed(screen.getByRole("button"));
    rerender(<Reader narrow={false} />);
    rerender(<Reader narrow />);

    expect(screen.getByRole("button").textContent).toBe("hidden");
  });
});
