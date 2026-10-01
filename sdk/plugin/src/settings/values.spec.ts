import { describe, expect, it } from "vitest";

import { BROKEN, DIGEST, sectionOf, storedAs, TO_THREE } from "#settings/settings.fixtures.ts";
import { checked, defaultsOf, readSection, refusalOf } from "#settings/values.ts";

describe("values", () => {
  it("returns each property's default", () => {
    expect(defaultsOf(DIGEST)).toStrictEqual({
      frequency: "daily",
      hour: 9,
      muted: false,
      note: "hi",
      ratio: 0.5,
    });
  });

  it("returns no defaults for a section without a schema", () => {
    expect(defaultsOf()).toStrictEqual({});
  });

  it.each([
    { name: "frequency", value: "weekly", want: undefined },
    { name: "frequency", value: "hourly", want: "is not one of daily, weekly" },
    { name: "frequency", value: 3, want: "is not a string" },
    { name: "hour", value: 7, want: undefined },
    { name: "hour", value: "7", want: "is not a number" },
    { name: "hour", value: 7.5, want: "is not a whole number" },
    { name: "hour", value: -1, want: "is below the minimum 0" },
    { name: "hour", value: 24, want: "is above the maximum 23" },
    { name: "muted", value: true, want: undefined },
    { name: "muted", value: "yes", want: "is not a boolean" },
    { name: "note", value: "é", want: "is shorter than 2 characters" },
    { name: "note", value: "abcde", want: "is longer than 4 characters" },
    { name: "note", value: "ab1", want: "does not match ^[a-zé]+$" },
    { name: "note", value: "ééé", want: undefined },
    { name: "ratio", value: Number.NaN, want: "is not a number" },
    { name: "ratio", value: 0.25, want: undefined },
    { name: "volume", value: 1, want: "is not a property of the section" },
  ])("returns $want for $value as $name", ({ name, value, want }) => {
    expect(refusalOf(DIGEST.properties[name], value)).toBe(want);
  });

  it("keeps the values a schema accepts", () => {
    expect(checked(DIGEST, { hour: 30, muted: true })).toStrictEqual({
      dropped: ["hour is above the maximum 23"],
      kept: { muted: true },
    });
  });

  it("keeps every value where a section has no schema", () => {
    expect(checked(undefined, { layout: [1, 2] })).toStrictEqual({
      dropped: [],
      kept: { layout: [1, 2] },
    });
  });

  it("keeps nothing where nothing is stored", () => {
    expect(readSection(null, sectionOf(), {})).toStrictEqual({ dropped: [], kept: {} });
  });

  it("keeps nothing for a section no installed plugin declares", () => {
    expect(readSection(storedAs(1, { hour: 7 }), undefined, {})).toStrictEqual({
      dropped: [],
      kept: {},
    });
  });

  it("drops a stored value that is not JSON", () => {
    expect(readSection("{", sectionOf(), {})).toStrictEqual({
      dropped: ["the stored value is not JSON"],
      kept: {},
    });
  });

  it.each([
    { label: "a number", stored: 5 },
    { label: "an array", stored: [] },
    { label: "versioned in text", stored: { values: {}, version: "1" } },
    { label: "versioned with a fraction", stored: { values: {}, version: 1.5 } },
    { label: "at version 0", stored: { values: {}, version: 0 } },
    { label: "an array of values", stored: { values: [], version: 1 } },
    { label: "without values", stored: { version: 1 } },
  ])("drops a stored value that is $label", ({ stored }) => {
    expect(readSection(JSON.stringify(stored), sectionOf(), {})).toStrictEqual({
      dropped: ["the stored value has no version and values"],
      kept: {},
    });
  });

  it("migrates a stored value one version at a time", () => {
    const read = readSection(storedAs(1, { hour: 9 }), sectionOf({ schemaVersion: 3 }), TO_THREE);

    expect(read).toStrictEqual({ dropped: [], kept: { frequency: "weekly", hour: 7 } });
  });

  it("drops a stored value no migration reads", () => {
    expect(readSection(storedAs(1, {}), sectionOf({ schemaVersion: 2 }), {})).toStrictEqual({
      dropped: ["no migration reads version 1"],
      kept: {},
    });
  });

  it("drops a stored value whose migration throws", () => {
    expect(readSection(storedAs(1, {}), sectionOf({ schemaVersion: 2 }), BROKEN)).toStrictEqual({
      dropped: ["the migration of version 1 threw: Error: broken"],
      kept: {},
    });
  });

  it("keeps nothing of a value a later version wrote", () => {
    expect(readSection(storedAs(3, { hour: 7 }), sectionOf(), {})).toStrictEqual({
      dropped: [],
      kept: {},
    });
  });

  it("drops each stored property the schema refuses", () => {
    expect(readSection(storedAs(1, { hour: 30, muted: true }), sectionOf(), {})).toStrictEqual({
      dropped: ["hour is above the maximum 23"],
      kept: { muted: true },
    });
  });
});
