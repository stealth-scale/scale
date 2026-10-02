import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Alert",
      "EmptyState",
      "Loader",
      "LoaderOverlay",
      "Meter",
      "Progress",
      "ProgressCircle",
      "Skeleton",
      "SkeletonPropsProvider",
      "SkeletonText",
      "SkeletonTextPropsProvider",
      "Spinner",
      "Toast",
    ]);
  });

  it("exports Alert as a namespace of its parts", () => {
    expect(Object.keys(barrel.Alert).toSorted()).toStrictEqual([
      "Aside",
      "CloseTrigger",
      "Content",
      "Description",
      "Indicator",
      "LIVES",
      "Root",
      "Title",
    ]);
  });

  it("exports Meter as a namespace of its parts", () => {
    expect(Object.keys(barrel.Meter).toSorted()).toStrictEqual([
      "Label",
      "Marker",
      "Range",
      "Root",
      "Segment",
      "Track",
      "ValueText",
    ]);
  });

  it("exports Progress as a namespace of its parts", () => {
    expect(Object.keys(barrel.Progress).toSorted()).toStrictEqual([
      "Label",
      "Marker",
      "Range",
      "Root",
      "Segment",
      "Track",
      "ValueText",
    ]);
  });

  it("exports ProgressCircle as a namespace of its parts", () => {
    expect(Object.keys(barrel.ProgressCircle).toSorted()).toStrictEqual([
      "Circle",
      "Label",
      "Range",
      "Root",
      "Track",
      "ValueText",
    ]);
  });

  it("exports no name that starts with recipe or with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
