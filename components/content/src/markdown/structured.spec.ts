import { describe, expect, it } from "vitest";

import { renderCallout } from "#markdown/callouts.tsx";
import { renderCode } from "#markdown/code.tsx";
import { renderFootnotes } from "#markdown/footnotes.tsx";
import { renderList } from "#markdown/lists.tsx";
import { STRUCTURED } from "#markdown/structured.ts";
import { renderTable } from "#markdown/tables.tsx";

describe("STRUCTURED", () => {
  it("maps each structured block type to its module's renderer", () => {
    expect(STRUCTURED).toStrictEqual({
      callout: renderCallout,
      code: renderCode,
      footnotes: renderFootnotes,
      list: renderList,
      table: renderTable,
    });
  });
});
