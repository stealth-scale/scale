import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated } from "#form/form.fixtures.tsx";

const SYNC: Schema = {
  properties: {
    sync: { const: true, description: "On every device", title: "Sync", type: "boolean" },
  },
  required: ["sync"],
  type: "object",
};

const SWITCHED: Presentation<Record<string, unknown>> = {
  fields: { sync: { control: "switch" } },
  id: "profile",
};

/**
 * Returns the switch.
 */
function toggle(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("switch", { name: "Sync" });
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("SwitchField", () => {
  it("renders a switch named by its label for a boolean that names the switch", async () => {
    await drawn(generated(SYNC, { presentation: SWITCHED }));

    expect(toggle().getAttribute("aria-checked")).toBe("false");
  });

  it("writes a press into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(SYNC, { onSubmit: submit, presentation: SWITCHED }));
    fireEvent.click(toggle());
    await settled();
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ sync: true });
  });

  it("shows the schema's error under the switch after a refused submit", async () => {
    await drawn(
      generated(SYNC, {
        presentation: SWITCHED,
        translate: translateFrom({ "errors.const": "Turn sync on" }),
      }),
    );
    await submitted();

    expect(screen.getByText("Turn sync on").getAttribute("role")).toBe("alert");
  });

  it("describes the switch by its help text", async () => {
    await drawn(generated(SYNC, { presentation: SWITCHED }));

    expect(toggle().getAttribute("aria-describedby")).toContain(
      screen.getByText("On every device").id,
    );
  });

  it("marks the switch required where the schema requires the property", async () => {
    await drawn(generated(SYNC, { presentation: SWITCHED }));

    expect(toggle().required).toBe(true);
  });

  it("runs the field's blur validators once focus leaves the switch", async () => {
    await drawn(
      generated(SYNC, {
        fieldOptions: { sync: { validators: { onBlur: () => "Sync is on for admins" } } },
        presentation: SWITCHED,
      }),
    );
    fireEvent.blur(toggle());
    await settled();

    expect(screen.getByText("Sync is on for admins")).toBeDefined();
  });
});
