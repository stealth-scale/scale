import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { composed, framed } from "#file-upload/file-upload.fixtures.tsx";
import { Label } from "#file-upload/label.tsx";
import { Root } from "#file-upload/root.tsx";
import { Trigger } from "#file-upload/trigger.tsx";

/**
 * Returns the trigger, found by its role and its words.
 */
function trigger(): HTMLButtonElement {
  return screen.getByRole<HTMLButtonElement>("button", { name: "Choose files" });
}

describe("Trigger", () => {
  it("renders a button named by its words", async () => {
    await drawn(composed());

    expect(trigger().type).toBe("button");
  });

  it("opens the file picker on a press", async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click");

    await drawn(composed());
    fireEvent.click(trigger());
    await settled();
    await framed();

    expect(click).toHaveBeenCalledExactlyOnceWith();
  });

  it("is disabled in a read-only upload", async () => {
    await drawn(composed({ readOnly: true }));

    expect(trigger().disabled).toBe(true);
  });

  it("keeps the size it states over the upload's", async () => {
    await drawn(
      <Root size="lg">
        <Label>Statements</Label>
        <Trigger size="sm">Choose files</Trigger>
      </Root>,
    );

    expect([...trigger().classList]).toContain(variantClass("button", "size", "sm"));
  });
});
