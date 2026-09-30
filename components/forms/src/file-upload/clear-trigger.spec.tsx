import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#file-upload/clear-trigger.tsx";
import {
  composed,
  framed,
  names,
  picked,
  RECEIPT,
  STATEMENT,
} from "#file-upload/file-upload.fixtures.tsx";
import { Label } from "#file-upload/label.tsx";
import { Root } from "#file-upload/root.tsx";
import { Trigger } from "#file-upload/trigger.tsx";

/**
 * Returns the clear trigger, found by its words, which a hidden button keeps.
 */
function clearer(): HTMLButtonElement {
  return screen.getByText<HTMLButtonElement>("Clear files");
}

describe("ClearTrigger", () => {
  it("hides itself while no file is accepted", async () => {
    await drawn(composed());

    expect(clearer().hidden).toBe(true);
  });

  it("shows itself once a file is accepted", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    expect(clearer().hidden).toBe(false);
  });

  it("removes every file on a press", async () => {
    const { container } = await drawn(composed({ defaultAcceptedFiles: [STATEMENT, RECEIPT] }));

    fireEvent.click(clearer());
    await settled();

    expect(names(slotElement(container, "file-upload", "itemGroup"))).toStrictEqual([]);
  });

  it("removes the refused files on a press", async () => {
    const { container } = await drawn(composed({ accept: "application/pdf" }));

    await picked(container, [STATEMENT, RECEIPT]);
    fireEvent.click(clearer());
    await settled();

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  it("moves focus to the dropzone after a press", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT] }));

    fireEvent.click(clearer());
    await settled();
    await framed();

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Drop statements here" }),
    );
  });

  it("moves focus to the trigger after a press where no dropzone renders", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT]}>
        <Label>Statements</Label>
        <Trigger>Choose files</Trigger>
        <ClearTrigger>Clear files</ClearTrigger>
      </Root>,
    );

    fireEvent.click(clearer());
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Choose files" }));
  });

  it("leaves focus in place when the caller cancels the press", async () => {
    await drawn(
      <Root defaultAcceptedFiles={[STATEMENT]}>
        <Trigger>Choose files</Trigger>
        <ClearTrigger
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Clear files
        </ClearTrigger>
      </Root>,
    );

    fireEvent.click(clearer());
    await settled();
    await framed();

    expect(document.activeElement).toBe(document.body);
  });

  it("hides itself in a read-only upload", async () => {
    await drawn(composed({ defaultAcceptedFiles: [STATEMENT], readOnly: true }));

    expect(clearer().hidden).toBe(true);
  });
});
