import { describe, expect, it } from "vitest";

import { PickerProvider, usePickerState } from "#reactions/state.ts";

describe("state", () => {
  it("returns a provider and the hook that reads it", () => {
    expect([typeof PickerProvider, typeof usePickerState]).toStrictEqual(["function", "function"]);
  });
});
