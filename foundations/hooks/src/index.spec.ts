import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "FilterContext",
      "createFilterScope",
      "createLabelling",
      "createRequiredContext",
      "omitUndefined",
      "revealSideways",
      "speakable",
      "splitEnumerable",
      "useAnnounce",
      "useCallbackRef",
      "useCoarsePointer",
      "useConst",
      "useControllableState",
      "useCrowded",
      "useFilterActive",
      "useFilterEmpty",
      "useFilterScope",
      "useFilteredRow",
      "useHighlight",
      "useIsOverflowing",
      "useLiveRef",
      "useMatrixCrosshair",
      "useMediaQuery",
      "usePresence",
      "useSafeLayoutEffect",
      "useStickyOffsets",
    ]);
  });
});
