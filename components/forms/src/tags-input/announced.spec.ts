import { describe, expect, it } from "vitest";

import {
  added,
  changed,
  changeMessage,
  editable,
  highlightMessage,
  type Messages,
  messagesOf,
  missing,
  removable,
  removed,
} from "#tags-input/announced.ts";

/**
 * Words of every case that does not replace them.
 */
const DEFAULTS: Messages = messagesOf({}, false);

/**
 * Returns an announcement of added tags a caller writes.
 */
function own(values: readonly string[]): string {
  return `+${values.join()}`;
}

describe("announced", () => {
  it("names the one tag added", () => {
    expect(added(["Pinecrest"])).toBe("Added Pinecrest");
  });

  it("counts several tags added", () => {
    expect(added(["Pinecrest", "Northwind", "Halden & Co"])).toBe("Added 3 tags");
  });

  it("names the one tag removed", () => {
    expect(removed(["Pinecrest"])).toBe("Removed Pinecrest");
  });

  it("counts several tags removed", () => {
    expect(removed(["Pinecrest", "Northwind"])).toBe("Removed 2 tags");
  });

  it("names the previous and the new tag of an edit", () => {
    expect(changed("Bridge Ledger", "Bridge")).toBe("Changed Bridge to Bridge Ledger");
  });

  it("names Backspace after a removable tag", () => {
    expect(removable("Pinecrest")).toBe("Pinecrest. Press Backspace to remove it.");
  });

  it("names Enter and Backspace after an editable tag", () => {
    expect(editable("Pinecrest")).toBe(
      "Pinecrest. Press Enter to edit it or Backspace to remove it.",
    );
  });

  it("keeps a message the caller passes", () => {
    expect(messagesOf({ addedMessage: own }, false).added).toBe(own);
  });

  it("defaults every message the caller leaves out", () => {
    expect(DEFAULTS).toStrictEqual({ added, changed, highlighted: removable, removed });
  });

  it("names Enter in the default highlight message when tags are editable", () => {
    expect(messagesOf({}, true).highlighted).toBe(editable);
  });

  it("returns each value the other list lacks", () => {
    expect(missing(["a", "b", "c"], ["b"])).toStrictEqual(["a", "c"]);
  });

  it("counts a repeated value once per occurrence", () => {
    expect(missing(["a", "a", "b"], ["a"])).toStrictEqual(["a", "b"]);
  });

  it("announces a tag added at the end", () => {
    expect(changeMessage(["a"], ["a", "b"], DEFAULTS)).toBe("Added b");
  });

  it("announces a tag removed from the middle", () => {
    expect(changeMessage(["a", "b", "c"], ["a", "c"], DEFAULTS)).toBe("Removed b");
  });

  it("announces an edit when one tag is gained and one is lost", () => {
    expect(changeMessage(["a", "b"], ["a", "bee"], DEFAULTS)).toBe("Changed b to bee");
  });

  it("announces the tags added before the tags removed", () => {
    expect(changeMessage(["a", "b"], ["c", "d", "e"], DEFAULTS)).toBe(
      "Added 3 tags. Removed 2 tags",
    );
  });

  it("announces every tag removed when the tags are cleared", () => {
    expect(changeMessage(["a", "b"], [], DEFAULTS)).toBe("Removed 2 tags");
  });

  it("returns an empty string when the tags only move", () => {
    expect(changeMessage(["a", "b"], ["b", "a"], DEFAULTS)).toBe("");
  });

  it("announces the tag whose ID is highlighted", () => {
    const tag = document.createElement("span");

    tag.id = "tags-input:«r1»:tag:0";
    tag.dataset["value"] = "Pinecrest";
    document.body.append(tag);

    expect(highlightMessage(tag.id, DEFAULTS)).toBe("Pinecrest. Press Backspace to remove it.");

    tag.remove();
  });

  it("returns an empty string when the highlight leaves the tags", () => {
    expect(highlightMessage(null, DEFAULTS)).toBe("");
  });

  it("returns an empty string when no tag has the ID", () => {
    expect(highlightMessage("tags-input:«r9»:tag:4", DEFAULTS)).toBe("");
  });
});
