import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picked, trigger } from "#date-picker/date-picker.fixtures.tsx";
import { Input } from "#date-picker/input.tsx";
import { Trigger } from "#date-picker/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", async () => {
    await drawn(picked());

    expect(trigger().tagName).toBe("BUTTON");
  });

  it("is named by Choose date followed by the label", async () => {
    await drawn(picked());

    expect(screen.getByRole("button", { name: "Choose date Appointment" })).toBe(trigger());
  });

  it("is named by Choose date alone without a label", async () => {
    await drawn(picked({}, { label: null }));

    expect(screen.getByRole("button", { name: "Choose date" })).toBe(trigger());
  });

  it("is named by label followed by the picker's label", async () => {
    await drawn(
      picked(
        {},
        {
          control: (
            <>
              <Input />
              <Trigger label="Pick a day" />
            </>
          ),
        },
      ),
    );

    expect(screen.getByRole("button", { name: "Pick a day Appointment" })).toBe(trigger());
  });

  it("reports aria-haspopup dialog", async () => {
    await drawn(picked());

    expect(trigger().getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("reports aria-expanded false while the panel is closed", async () => {
    await drawn(picked());

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the panel on a press", async () => {
    await drawn(picked());
    await opened();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("is disabled in a disabled picker", async () => {
    await drawn(picked({ disabled: true }));

    expect(trigger().disabled).toBe(true);
  });

  it("reports aria-disabled in a read-only picker", async () => {
    await drawn(picked({ readOnly: true }));

    expect(trigger().getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps its tab stop in a read-only picker", async () => {
    await drawn(picked({ readOnly: true }));

    expect(trigger().disabled).toBe(false);
  });

  it("leaves out aria-disabled in an editable picker", async () => {
    await drawn(picked());

    expect(trigger().hasAttribute("aria-disabled")).toBe(false);
  });
});
