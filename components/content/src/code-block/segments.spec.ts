import { describe, expect, it } from "vitest";

import { groupsOf, piecesOf, segmentsOf } from "#code-block/segments.ts";

describe("segments", () => {
  it("cuts the highlighter's tokens into one list of pieces per line", () => {
    expect(piecesOf("let b = 2;\nb += 1;", "ts")).toHaveLength(2);
  });

  it("keeps the kind of a token on every line it spans", () => {
    const [first, second] = piecesOf("const a = `x\ny`;", "ts");

    expect([first?.at(-1), second?.at(0)]).toStrictEqual([
      { kind: "string", text: "`x" },
      { kind: "string", text: "y`" },
    ]);
  });

  it("returns the pieces of a line whose texts join to the line", () => {
    const [line] = piecesOf("const a = 1;", "ts");

    expect(line?.map((piece) => piece.text).join("")).toBe("const a = 1;");
  });

  it("returns an empty list for an empty line", () => {
    expect(piecesOf("plain\n\ntext")[1]).toStrictEqual([]);
  });

  it("returns pieces without a kind when no language is given", () => {
    expect(piecesOf("const a = 1;")).toStrictEqual([[{ kind: undefined, text: "const a = 1;" }]]);
  });

  it("cuts a piece where a changed stretch begins and ends", () => {
    expect(
      segmentsOf(
        [{ text: "attempts = 3) {" }],
        [
          { changed: false, text: "attempts = " },
          { changed: true, text: "3" },
          { changed: false, text: ") {" },
        ],
      ),
    ).toStrictEqual([
      { changed: false, kind: undefined, text: "attempts = " },
      { changed: true, kind: undefined, text: "3" },
      { changed: false, kind: undefined, text: ") {" },
    ]);
  });

  it("keeps the kind of the piece on each segment cut from it", () => {
    expect(
      segmentsOf(
        [{ kind: "string", text: '"abc"' }],
        [
          { changed: false, text: '"a' },
          { changed: true, text: 'bc"' },
        ],
      ),
    ).toStrictEqual([
      { changed: false, kind: "string", text: '"a' },
      { changed: true, kind: "string", text: 'bc"' },
    ]);
  });

  it("marks every piece a changed stretch spans", () => {
    expect(
      segmentsOf(
        [{ kind: "keyword", text: "let" }, { text: " b" }],
        [{ changed: true, text: "let b" }],
      ),
    ).toStrictEqual([
      { changed: true, kind: "keyword", text: "let" },
      { changed: true, kind: undefined, text: " b" },
    ]);
  });

  it("groups consecutive changed segments", () => {
    expect(
      groupsOf([
        { changed: false, text: "a" },
        { changed: true, text: "b" },
        { changed: true, text: "c" },
        { changed: false, text: "d" },
      ]).map((group) => `${String(group.changed)} ${group.segments.map((s) => s.text).join("")}`),
    ).toStrictEqual(["false a", "true bc", "false d"]);
  });

  it("returns no group for a line without segments", () => {
    expect(groupsOf([])).toStrictEqual([]);
  });

  it("returns every piece unmarked when no stretch is given", () => {
    expect(segmentsOf([{ kind: "keyword", text: "let" }], [])).toStrictEqual([
      { changed: false, kind: "keyword", text: "let" },
    ]);
  });
});
