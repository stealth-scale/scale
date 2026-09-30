import { describe, expect, it } from "vitest";

import { type ByteOptions, bytesOf } from "#format/bytes.ts";

/**
 * Options of a size in bytes, short, on the decimal system.
 */
const BYTES: ByteOptions = { unit: "byte", unitDisplay: "short", unitSystem: "decimal" };

describe("bytesOf", () => {
  it.each([
    { value: 0, want: "0 bytes" },
    { value: 1, want: "1 byte" },
    { value: 512, want: "512 bytes" },
  ])("writes $want under a kilobyte with the long unit", ({ value, want }) => {
    expect(bytesOf(value, "en-US", BYTES)).toBe(want);
  });

  it("writes zero in the locale's words", () => {
    expect(bytesOf(0, "fr-FR", BYTES)).toBe("0 octet");
  });

  it("keeps the narrow unit under a kilobyte", () => {
    expect(bytesOf(512, "en-US", { ...BYTES, unitDisplay: "narrow" })).toBe("512B");
  });

  it("writes the largest unit a size reaches in three significant digits", () => {
    expect(bytesOf(1_450_000, "en-US", BYTES)).toBe("1.45 MB");
  });

  it("writes the decimal separator of the locale", () => {
    expect(bytesOf(1_450_000, "de-DE", BYTES)).toBe("1,45 MB");
  });

  it("divides by 1024 on the binary system", () => {
    expect(bytesOf(1_048_576, "en-US", { ...BYTES, unitSystem: "binary" })).toBe("1 MB");
  });

  it("writes a size under 1024 on the binary system in bytes", () => {
    expect(bytesOf(1000, "en-US", { ...BYTES, unitSystem: "binary" })).toBe("1,000 bytes");
  });

  it("writes bits with unit bit", () => {
    expect(bytesOf(8, "en-US", { ...BYTES, unit: "bit" })).toBe("8 bits");
  });

  it("writes the precision it is given", () => {
    expect(bytesOf(1_456_789, "en-US", { ...BYTES, precision: 2 })).toBe("1.5 MB");
  });
});
