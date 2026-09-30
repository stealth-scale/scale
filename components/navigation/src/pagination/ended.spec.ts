import { describe, expect, it, vi } from "vitest";

import { ended } from "#pagination/ended.ts";

/**
 * Click handler of the props the machine gives a trigger.
 */
const PRESS = vi.fn<() => void>();

describe("ended", () => {
  it("sets aria-disabled at an end", () => {
    expect(ended({ disabled: true }, true, "button")).toMatchObject({ "aria-disabled": true });
  });

  it("sets aria-disabled to undefined before an end", () => {
    expect(ended({ disabled: false }, false, "button")).toMatchObject({
      "aria-disabled": undefined,
    });
  });

  it("sets disabled to undefined", () => {
    expect(ended({ disabled: true }, true, "button")).toMatchObject({ disabled: undefined });
  });

  it("keeps the machine's click handler for buttons", () => {
    expect(ended({ onClick: PRESS }, false, "button")).toMatchObject({ onClick: PRESS });
  });

  it("drops the machine's click handler for links", () => {
    expect(ended({ onClick: PRESS }, false, "link")).not.toHaveProperty("onClick");
  });

  it("gives a link at an end the link role", () => {
    expect(ended({ onClick: PRESS }, true, "link")).toMatchObject({ role: "link" });
  });

  it("sets aria-disabled on a link at an end", () => {
    expect(ended({ onClick: PRESS }, true, "link")).toMatchObject({ "aria-disabled": true });
  });
});
