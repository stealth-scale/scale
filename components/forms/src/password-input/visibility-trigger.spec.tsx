import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { composed, framed } from "#password-input/password-input.fixtures.tsx";

/**
 * Returns the text of the polite live region, or nothing where the page has none.
 *
 * @returns The announcement.
 */
function announced(): null | string | undefined {
  return document.querySelector('[role="status"][aria-live="polite"]')?.textContent;
}

describe("VisibilityTrigger", () => {
  it("is named Show password while the value is hidden", async () => {
    await drawn(composed());

    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Show password");
  });

  it("is named Hide password while the value is shown", async () => {
    await drawn(composed({ defaultVisible: true }));

    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Hide password");
  });

  it("takes its names from label and visibleLabel", async () => {
    await drawn(
      composed({ defaultVisible: true }, { label: "Show key", visibleLabel: "Hide key" }),
    );

    expect(screen.getByRole("button", { name: "Hide key" })).toBeDefined();
  });

  it("is in the tab order", async () => {
    await drawn(composed());

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("keeps a tabIndex the caller passes", async () => {
    await drawn(composed({}, { tabIndex: -1 }));

    expect(screen.getByRole("button").tabIndex).toBe(-1);
  });

  it("sets no aria-expanded", async () => {
    await drawn(composed());

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBeNull();
  });

  it("points aria-controls at the input", async () => {
    await drawn(composed());

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBe(
      screen.getByLabelText("Password").id,
    );
  });

  it("shows the value on a press from the keyboard", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button"));
    await settled();

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("text");
  });

  it("shows the value once on a pointer press and its click", async () => {
    await drawn(composed());
    fireEvent.pointerDown(screen.getByRole("button"), { button: 0 });
    await settled();
    fireEvent.click(screen.getByRole("button"), { detail: 1 });
    await settled();

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("text");
  });

  it("moves focus to the input on a pointer press", async () => {
    await drawn(composed());
    fireEvent.pointerDown(screen.getByRole("button"), { button: 0 });
    await settled();

    expect(document.activeElement).toBe(screen.getByLabelText("Password"));
  });

  it("shows the value of a read-only input on a pointer click", async () => {
    await drawn(<Field.Root readOnly>{composed()}</Field.Root>);
    fireEvent.pointerDown(screen.getByRole("button"), { button: 0 });
    fireEvent.click(screen.getByRole("button"), { detail: 1 });
    await settled();

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("text");
  });

  it("is disabled with the input", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(true);
  });

  it("announces that the value is visible after showing it", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button"));
    await settled();
    await framed();

    expect(announced()).toBe("Your password is visible");
  });

  it("announces that the value is hidden after hiding it", async () => {
    await drawn(composed({ defaultVisible: true }));
    fireEvent.click(screen.getByRole("button"));
    await settled();
    await framed();

    expect(announced()).toBe("Your password is hidden");
  });

  it("takes its announcement from visibleMessage", async () => {
    await drawn(composed({}, { visibleMessage: "The key is visible" }));
    fireEvent.click(screen.getByRole("button"));
    await settled();
    await framed();

    expect(announced()).toBe("The key is visible");
  });
});
