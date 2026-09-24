import { describe, expect, it } from "vitest";

import { describedBy, idsOf } from "#field/ids.ts";

describe("ids", () => {
  it("gives the control the identifier unchanged", () => {
    expect(idsOf("email").control).toBe("email");
  });

  it("derives the other four identifiers with a suffix each", () => {
    expect(idsOf("email")).toStrictEqual({
      control: "email",
      counter: "email-counter",
      errorText: "email-error",
      helperText: "email-helper",
      label: "email-label",
    });
  });

  it("lists the helper text then the error text for aria-describedby", () => {
    expect(describedBy(idsOf("email"))).toBe("email-helper email-error");
  });
});
