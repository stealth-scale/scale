import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Messages, messagesOf } from "#file-upload/announced.ts";
import {
  announced,
  fileOf,
  framed,
  hiddenInput,
  picked,
  RECEIPT,
  STATEMENT,
} from "#file-upload/file-upload.fixtures.tsx";
import {
  ApiProvider,
  type FileAcceptDetails,
  type FileRejectDetails,
  type FileUploadOptions,
  splitFileUploadProps,
  useFileUpload,
  useFileUploadMachine,
} from "#file-upload/machine.ts";

/**
 * Words of every case that does not replace them.
 */
const DEFAULTS: Messages = messagesOf({});

/**
 * Describes what the probe takes: the machine's options, the words and a field's control ID.
 */
interface Probed extends FileUploadOptions {
  /**
   * ID the field around the upload gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;
}

/**
 * Renders the accepted files' names and the hidden input through the hook a part reads.
 *
 * @returns The parts.
 */
function Parts(): ReactElement {
  const api = useFileUpload();

  return (
    <div {...api.getRootProps()}>
      <span data-testid="files">{api.acceptedFiles.map((file) => file.name).join()}</span>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}

/**
 * Runs the machine with the options the case sets and renders its parts bare.
 *
 * @param props - The machine options and the field's control ID.
 * @returns The parts, with the label's ID as text.
 */
function Running({ control, ...options }: Probed): ReactElement {
  const { api, labelId } = useFileUploadMachine(options, DEFAULTS, control);

  return (
    <ApiProvider value={api}>
      <span data-testid="label">{labelId}</span>
      <Parts />
    </ApiProvider>
  );
}

describe("machine", () => {
  it("starts with the default accepted files", async () => {
    await drawn(<Running defaultAcceptedFiles={[STATEMENT]} />);

    expect(screen.getByTestId("files").textContent).toBe("statement.pdf");
  });

  it("returns a label ID built from id", async () => {
    await drawn(<Running id="evidence" />);

    expect(screen.getByTestId("label").textContent).toBe("file-upload:evidence:label");
  });

  it("returns the label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "evidence-label" }} />);

    expect(screen.getByTestId("label").textContent).toBe("evidence-label");
  });

  it("gives the hidden input the control ID of the field around it", async () => {
    const { container } = await drawn(<Running control="evidence-control" />);

    expect(hiddenInput(container).id).toBe("evidence-control");
  });

  it("keeps the hidden input ID the caller passes over the field's", async () => {
    const { container } = await drawn(
      <Running control="evidence-control" ids={{ hiddenInput: "evidence-input" }} />,
    );

    expect(hiddenInput(container).id).toBe("evidence-input");
  });

  it("accepts a picked file", async () => {
    const { container } = await drawn(<Running />);

    await picked(container, [STATEMENT]);

    expect(screen.getByTestId("files").textContent).toBe("statement.pdf");
  });

  it("calls onFileAccept with the accepted files", async () => {
    const onFileAccept = vi.fn<(details: FileAcceptDetails) => void>();
    const { container } = await drawn(<Running onFileAccept={onFileAccept} />);

    await picked(container, [STATEMENT]);

    expect(onFileAccept).toHaveBeenLastCalledWith({ files: [STATEMENT] });
  });

  it("calls onFileReject with the refused files", async () => {
    const onFileReject = vi.fn<(details: FileRejectDetails) => void>();
    const { container } = await drawn(
      <Running accept="application/pdf" onFileReject={onFileReject} />,
    );

    await picked(container, [RECEIPT]);

    expect(onFileReject).toHaveBeenLastCalledWith({
      files: [{ errors: ["FILE_INVALID_TYPE"], file: RECEIPT }],
    });
  });

  it("announces the files it accepts", async () => {
    const { container } = await drawn(<Running maxFiles={2} />);

    await picked(container, [STATEMENT, RECEIPT]);
    await framed();

    expect(announced()).toBe("Added 2 files");
  });

  it("announces the files it refuses beside the files it accepts", async () => {
    const { container } = await drawn(<Running accept="application/pdf" maxFiles={2} />);

    await picked(container, [STATEMENT, RECEIPT]);
    await framed();

    expect(announced()).toBe("Added statement.pdf. Could not add receipt.png");
  });

  it("announces a file that replaces the one before it", async () => {
    const invoice = fileOf("invoice.pdf", "application/pdf");
    const { container } = await drawn(<Running defaultAcceptedFiles={[STATEMENT]} />);

    await picked(container, [invoice]);
    await framed();

    expect(announced()).toBe("Added invoice.pdf. Removed statement.pdf");
  });

  it("reads the files before a change from acceptedFiles when the caller controls them", async () => {
    const { container } = await drawn(<Running acceptedFiles={[STATEMENT]} maxFiles={2} />);

    await picked(container, [RECEIPT]);
    await framed();

    expect(announced()).toBe("Added receipt.png");
  });

  it("splits the machine's options from the element's props without translations", () => {
    const [options, rest] = splitFileUploadProps({
      maxFiles: 3,
      title: "Statements",
      translations: { dropzone: "Drop" },
    });

    expect([options, rest]).toStrictEqual([{ maxFiles: 3 }, { title: "Statements" }]);
  });
});
