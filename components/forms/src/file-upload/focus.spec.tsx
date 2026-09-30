import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { framed } from "#file-upload/file-upload.fixtures.tsx";
import { idOf, refocus } from "#file-upload/focus.ts";

describe("focus", () => {
  it("returns the ID in a part's props", () => {
    expect(idOf({ id: "file:evidence:dropzone" })).toBe("file:evidence:dropzone");
  });

  it("returns nothing for props without an ID", () => {
    expect(idOf({})).toBeUndefined();
  });

  it("focuses the first rendered element among the IDs after a frame", async () => {
    render(
      <>
        <button id="file:a:dropzone" type="button">
          Drop
        </button>
        <button id="file:a:trigger" type="button">
          Choose
        </button>
      </>,
    );

    refocus([undefined, "file:a:missing", "file:a:dropzone", "file:a:trigger"]);
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Drop" }));
  });

  it("skips an element that does not take focus", async () => {
    render(
      <>
        <button disabled id="file:b:dropzone" type="button">
          Drop
        </button>
        <button id="file:b:trigger" type="button">
          Choose
        </button>
      </>,
    );

    refocus(["file:b:dropzone", "file:b:trigger"]);
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Choose" }));
  });
});
