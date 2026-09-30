/**
 * Catalogue page for the file upload.
 *
 * @remarks
 *   `scenesOf` generates the looks and sizes scenes from the recipe over a dropzone of receipts.
 *   Hand-written scenes show a statement behind a button, refused files with their reasons,
 *   attachments under a total limit, a profile photo, a folder of exports, pasted screenshots, a
 *   required upload in a form, and the states. `Picked` stages each scene's files through the
 *   hidden file input, the way the file picker delivers them, so a scene shows its rows at rest.
 *   Every drawing is in a room of a phone's width. The words are keys under `file-upload` in
 *   `locales/en/specimen/file-upload.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#file-upload/examples/index.ts";
import portrait from "#file-upload/examples/portrait.webp";
import receipt from "#file-upload/examples/receipt.webp";
import type * as FileUpload from "#file-upload/index.ts";
import { recipe } from "#file-upload/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the upload in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], FileUpload.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Returns a PDF of the given name and size, whose bytes are zeros.
 */
function pdf(name: string, bytes: number): File {
  return new File([new Uint8Array(bytes)], name, { type: "application/pdf" });
}

/**
 * Returns an image file read from the URL of a picture the page bundles.
 */
async function image(url: string, name: string, type: string): Promise<File> {
  const response = await fetch(url);

  return new File([await response.blob()], name, { type });
}

/**
 * Describes the files a staged scene picks: a list, or a promise of one for a scene that reads a
 * picture first.
 */
type Picks = () => File[] | Promise<File[]>;

/**
 * Returns the files each staged scene picks.
 */
const PICKS = {
  attachments: (): File[] => [pdf("brief.pdf", 1_820_000), pdf("budget.pdf", 640_000)],
  folder: (): File[] => [
    new File(["date,amount\n"], "2026-07.csv", { type: "text/csv" }),
    new File(["date,amount\n"], "2026-08.csv", { type: "text/csv" }),
  ],
  photo: async (): Promise<File[]> => [await image(portrait, "portrait.webp", "image/webp")],
  receipts: async (): Promise<File[]> => [
    pdf("receipt-0914.pdf", 182_000),
    await image(receipt, "receipt-0915.webp", "image/webp"),
  ],
  refused: async (): Promise<File[]> => [
    pdf("invoice-0412.pdf", 410_000),
    await image(receipt, "invoice-0413.webp", "image/webp"),
    pdf("invoice-0414.pdf", 3_200_000),
  ],
  screenshots: async (): Promise<File[]> => [await image(receipt, "image.png", "image/png")],
  statement: (): File[] => [pdf("statement-2026-08.pdf", 96_000)],
} satisfies Record<string, Picks>;

/**
 * Renders its children and picks files in the upload inside them once they mount.
 *
 * @remarks
 *   The staging writes the files to the hidden file input and fires its input event, the path the
 *   file picker takes, so the machine checks them as it checks a person's pick. The staging never
 *   appears in an example.
 */
function Picked({
  children,
  files,
}: {
  readonly children: ReactNode;
  readonly files: Picks;
}): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const input = box?.querySelector<HTMLInputElement>('input[type="file"]');

    if (input === undefined || input === null) return undefined;

    let live = true;

    /**
     * Waits for the files and writes them to the input, unless the drawing unmounted first.
     */
    async function pick(field: HTMLInputElement): Promise<void> {
      const picked = await files();

      if (!live) return;

      const transfer = new DataTransfer();

      for (const file of picked) transfer.items.add(file);

      field.files = transfer.files;
      field.dispatchEvent(new Event("input", { bubbles: true }));
    }

    void pick(input);

    return () => {
      live = false;
    };
  }, [box, files]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Returns a hand-written scene that renders one example in a room of a phone's width, with the
 * files its key picks.
 *
 * @param key - The scene's key under `file-upload`, and the key of its files in `PICKS`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @returns The scene.
 */
function staged(
  key: keyof typeof PICKS,
  example: object,
  Drawing: (props: FileUpload.RootProps) => ReactElement,
): Scene {
  return {
    about: `file-upload.${key}.about`,
    draw: () => (
      <Room size="sm">
        <Picked files={PICKS[key]}>
          <Drawing />
        </Picked>
      </Room>
    ),
    example,
    title: `file-upload.${key}.title`,
  };
}

/**
 * Hand-written scene for an invalid, a read-only and a disabled upload.
 */
export const states: Scene = {
  about: "file-upload.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          <examples.receipts.Receipts {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.receipts,
  props: { invalid: true },
  title: "file-upload.states.title",
};

/**
 * Hand-written scene for a required upload in a form, which shows its error text after a submit.
 */
export const required: Scene = {
  about: "file-upload.evidence.about",
  draw: () => (
    <Room size="sm">
      <examples.evidence.Evidence />
    </Room>
  ),
  example: examples.evidence,
  title: "file-upload.evidence.title",
};

export default specimen({
  about: "file-upload.about",
  id: "components/forms/file-upload",
  imports: 'import { FileUpload } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<FileUpload.RootProps>(recipe, {
      axes: { size: { direction: "column" }, variant: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <Picked files={PICKS.receipts}>
            <examples.receipts.Receipts {...props} />
          </Picked>
        </Room>
      ),
      example: examples.receipts,
      namespace: "file-upload",
      order: ["variant", "size"],
    }),
    staged("statement", examples.statement, examples.statement.Statement),
    staged("refused", examples.refused, examples.refused.Refused),
    staged("attachments", examples.attachments, examples.attachments.Attachments),
    staged("photo", examples.photo, examples.photo.Photo),
    staged("folder", examples.folder, examples.folder.Folder),
    staged("screenshots", examples.screenshots, examples.screenshots.Screenshots),
    required,
    states,
  ],
  title: "file-upload.title",
});
