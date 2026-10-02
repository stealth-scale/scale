import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCell, useTable, useView } from "#date-picker/scopes.ts";

describe("scopes", () => {
  it("throws for a view part outside a view", () => {
    expect(() => renderHook(() => useView())).toThrow(
      "A part of DatePicker.View was drawn outside the root that holds it together.",
    );
  });

  it("throws for a cell outside a table", () => {
    expect(() => renderHook(() => useTable())).toThrow(
      "A part of DatePicker.Table was drawn outside the root that holds it together.",
    );
  });

  it("throws for a cell trigger outside a cell", () => {
    expect(() => renderHook(() => useCell())).toThrow(
      "A part of DatePicker.TableCell was drawn outside the root that holds it together.",
    );
  });
});
