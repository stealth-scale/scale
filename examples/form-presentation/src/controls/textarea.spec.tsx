import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Harness } from "#controls/harness.fixtures.tsx";
import { Textarea } from "#controls/textarea.tsx";

describe("Textarea", () => {
  it("renders the library's textarea named by the field's label", async () => {
    await drawn(<Harness draw={Textarea} schema={{ type: "string" }} />);

    expect(screen.getByRole("textbox", { name: "Note" }).tagName).toBe("TEXTAREA");
  });

  it("binds the textarea to the field", async () => {
    await drawn(<Harness draw={Textarea} schema={{ type: "string" }} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Note" }), {
      target: { value: "A few lines" },
    });
    await settled();

    expect(screen.getByRole("textbox", { name: "Note" })).toHaveProperty("value", "A few lines");
  });
});
