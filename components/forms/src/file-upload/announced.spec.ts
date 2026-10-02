import { describe, expect, it } from "vitest";

import {
  acceptMessage,
  added,
  messagesOf,
  rejected,
  rejectMessage,
  removed,
} from "#file-upload/announced.ts";
import { fileOf, RECEIPT, STATEMENT } from "#file-upload/file-upload.fixtures.tsx";

/**
 * Words of every case that does not replace them.
 */
const DEFAULTS = messagesOf({});

describe("announced", () => {
  it("names the one file added", () => {
    expect(added([STATEMENT])).toBe("Added statement.pdf");
  });

  it("counts the files added when there are more than one", () => {
    expect(added([STATEMENT, RECEIPT])).toBe("Added 2 files");
  });

  it("names the one file removed", () => {
    expect(removed([STATEMENT])).toBe("Removed statement.pdf");
  });

  it("counts the files removed when there are more than one", () => {
    expect(removed([STATEMENT, RECEIPT])).toBe("Removed 2 files");
  });

  it("names the one file refused", () => {
    expect(rejected([{ errors: ["FILE_TOO_LARGE"], file: STATEMENT }])).toBe(
      "Could not add statement.pdf",
    );
  });

  it("counts the files refused when there are more than one", () => {
    expect(
      rejected([
        { errors: ["FILE_TOO_LARGE"], file: STATEMENT },
        { errors: ["FILE_INVALID_TYPE"], file: RECEIPT },
      ]),
    ).toBe("Could not add 2 files");
  });

  it("uses the words the caller passes", () => {
    const messages = messagesOf({ addedMessage: () => "Attached" });

    expect(messages.added([STATEMENT])).toBe("Attached");
  });

  it("announces the files added and then the files removed", () => {
    const invoice = fileOf("invoice.pdf", "application/pdf");

    expect(acceptMessage([STATEMENT, RECEIPT], [STATEMENT, invoice], DEFAULTS)).toBe(
      "Added invoice.pdf. Removed receipt.png",
    );
  });

  it("returns an empty string when the accepted files did not change", () => {
    expect(acceptMessage([STATEMENT], [STATEMENT], DEFAULTS)).toBe("");
  });

  it("announces the files refused", () => {
    expect(rejectMessage([{ errors: ["TOO_MANY_FILES"], file: RECEIPT }], DEFAULTS)).toBe(
      "Could not add receipt.png",
    );
  });

  it("returns an empty string when the refused files were cleared", () => {
    expect(rejectMessage([], DEFAULTS)).toBe("");
  });
});
