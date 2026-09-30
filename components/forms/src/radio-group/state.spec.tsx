import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ItemControl } from "#radio-group/item-control.tsx";
import { Label } from "#radio-group/label.tsx";

describe("state", () => {
  it("throws for an item's part rendered outside RadioGroup.Item", () => {
    expect(() => render(<ItemControl />)).toThrow("RadioGroup");
  });

  it("throws for a label rendered outside RadioGroup.Root", () => {
    expect(() => render(<Label>Payout window</Label>)).toThrow("RadioGroup");
  });
});
