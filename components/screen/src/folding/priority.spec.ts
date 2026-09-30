import { describe, expect, it } from "vitest";

import { PRIORITIES, type Priority, priorityOf } from "#folding/priority.ts";

describe("priority", () => {
  it("lists the priorities from the one a narrow row keeps to the one it folds first", () => {
    expect(PRIORITIES).toStrictEqual(["primary", "secondary", "tertiary"]);
  });

  it("contains a priority the type allows", () => {
    const held: Priority = "secondary";

    expect(PRIORITIES).toContain(held);
  });

  it("returns the stated priority over the one icon and primary imply", () => {
    expect(priorityOf("tertiary", true, true)).toBe("tertiary");
  });

  it("returns secondary for an action with an icon", () => {
    expect(priorityOf(undefined, true, false)).toBe("secondary");
  });

  it("returns secondary for a primary action with an icon", () => {
    expect(priorityOf(undefined, true, true)).toBe("secondary");
  });

  it("returns primary for a primary action without an icon", () => {
    expect(priorityOf(undefined, false, true)).toBe("primary");
  });

  it("returns tertiary for any other action", () => {
    expect(priorityOf(undefined, false, false)).toBe("tertiary");
  });
});
