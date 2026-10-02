import { describe, expect, it } from "vitest";

import { FOLDING, NARROW, PRIORITY } from "#folding/folding.ts";

describe("folding", () => {
  it("sets PRIORITY to data-priority", () => {
    expect(PRIORITY).toBe("data-priority");
  });

  it("sets NARROW to data-narrow", () => {
    expect(NARROW).toBe("data-narrow");
  });

  it("keeps every action on one line at every width", () => {
    expect(FOLDING).toMatchObject({ whiteSpace: "nowrap" });
  });

  it("hides the words of a secondary action on a narrow row", () => {
    expect(FOLDING["&[data-priority=secondary]"]["&[data-narrow]"]).toMatchObject({
      "& > :not(svg)": { srOnly: true },
    });
  });

  it("renders a secondary action on a narrow row as a square around its icon", () => {
    expect(FOLDING["&[data-priority=secondary]"]["&[data-narrow]"]).toStrictEqual({
      "& > :not(svg)": { srOnly: true },
      aspectRatio: "square",
      justifyContent: "center",
      paddingInline: "0",
    });
  });

  it("styles no primary or tertiary action", () => {
    expect(Object.keys(FOLDING).toSorted()).toStrictEqual([
      "&[data-priority=secondary]",
      "whiteSpace",
    ]);
  });

  it("folds only an action that carries data-narrow itself", () => {
    expect(Object.keys(FOLDING["&[data-priority=secondary]"])).toStrictEqual(["&[data-narrow]"]);
  });
});
