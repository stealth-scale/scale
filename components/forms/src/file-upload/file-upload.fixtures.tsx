/**
 * Builds the file uploads the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#file-upload/clear-trigger.tsx";
import { Dropzone } from "#file-upload/dropzone.tsx";
import { ItemContent } from "#file-upload/item-content.ts";
import { ItemDeleteTrigger } from "#file-upload/item-delete-trigger.tsx";
import { ItemGroup } from "#file-upload/item-group.tsx";
import { ItemName } from "#file-upload/item-name.tsx";
import { ItemPreviewImage } from "#file-upload/item-preview-image.tsx";
import { ItemPreview } from "#file-upload/item-preview.tsx";
import { ItemSizeText } from "#file-upload/item-size-text.tsx";
import { Item } from "#file-upload/item.tsx";
import { Items } from "#file-upload/items.tsx";
import { Label } from "#file-upload/label.tsx";
import { Root, type RootProps } from "#file-upload/root.tsx";
import { Trigger } from "#file-upload/trigger.tsx";

/**
 * Returns a file of the given name, type and size, modified at the epoch.
 *
 * @param name - The file's name.
 * @param type - The file's media type.
 * @param bytes - The file's size in bytes. Defaults to 1000.
 * @returns The file.
 */
export function fileOf(name: string, type: string, bytes = 1000): File {
  return new File([new Uint8Array(bytes)], name, { lastModified: 0, type });
}

/**
 * A 1000-byte PDF a composed upload starts with.
 */
export const STATEMENT = fileOf("statement.pdf", "application/pdf");

/**
 * A 2000-byte PNG a composed upload starts with.
 */
export const RECEIPT = fileOf("receipt.png", "image/png", 2000);

/**
 * Describes how a composed upload differs from the default one.
 */
export interface Composition {
  /**
   * Whether the upload renders `FileUpload.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Composition of the default upload.
 */
const PLAIN: Composition = {};

/**
 * Renders an upload of statements with every part, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label renders.
 * @returns The upload.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true } = composition;

  return (
    <Root maxFiles={3} {...props}>
      {labelled ? <Label>Statements</Label> : null}
      <Dropzone>Drop statements here</Dropzone>
      <Trigger>Choose files</Trigger>
      <ClearTrigger>Clear files</ClearTrigger>
      <ItemGroup>
        <Items>
          {(file) => (
            <Item file={file}>
              <ItemPreview>
                <ItemPreviewImage />
              </ItemPreview>
              <ItemContent>
                <ItemName />
                <ItemSizeText />
              </ItemContent>
              <ItemDeleteTrigger>
                <svg aria-hidden="true" />
              </ItemDeleteTrigger>
            </Item>
          )}
        </Items>
      </ItemGroup>
      <ItemGroup type="rejected">
        <Items>
          {(file, errors) => (
            <Item file={file}>
              <ItemContent>
                <ItemName />
                <ItemSizeText>{errors.join(" ")}</ItemSizeText>
              </ItemContent>
              <ItemDeleteTrigger />
            </Item>
          )}
        </Items>
      </ItemGroup>
    </Root>
  );
}

/**
 * Returns the hidden file input a composed upload renders.
 *
 * @param container - The element the upload rendered into.
 * @returns The `input` element.
 */
export function hiddenInput(container: ParentNode): HTMLInputElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the root renders the file input
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

/**
 * Picks files as the file picker does: writes them to the hidden input and fires its input event,
 * then waits for the machine.
 *
 * @param container - The element the upload rendered into.
 * @param files - The files the person picks.
 * @returns A promise that resolves once the machine has settled.
 */
export async function picked(container: ParentNode, files: readonly File[]): Promise<void> {
  const input = hiddenInput(container);

  Object.defineProperty(input, "files", { configurable: true, value: files, writable: true });
  fireEvent.input(input);
  await settled();
}

/**
 * Returns a drag's data with the given files, shaped as a browser's `DataTransfer`.
 */
function transferOf(files: readonly File[]): object {
  return {
    items: files.map((file) => ({
      getAsFile: () => file,
      kind: "file",
      webkitGetAsEntry: () => ({ isDirectory: false, isFile: true }),
    })),
    types: ["Files"],
  };
}

/**
 * Drags files over an element and drops them on it, then waits for the machine.
 *
 * @param target - The element the files are dropped on.
 * @param files - The files dropped.
 * @returns A promise that resolves once the machine has settled.
 */
export async function dropped(target: Element, files: readonly File[]): Promise<void> {
  fireEvent.dragOver(target, { dataTransfer: transferOf(files) });
  await settled();
  fireEvent.drop(target, { dataTransfer: transferOf(files) });
  await settled();
}

/**
 * Waits one animation frame inside `act`, for a move of focus or an announcement.
 *
 * @returns A promise that resolves after the frame.
 */
export async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}

/**
 * Returns the names in a list of files, in order.
 *
 * @param list - The `ul` of the list.
 * @returns The names.
 */
export function names(list: Element): readonly string[] {
  return [...list.querySelectorAll(`.${slotClass("file-upload", "itemName")}`)].map(
    (name) => name.textContent,
  );
}

/**
 * Returns the text of the polite live region, or nothing where the page has none.
 *
 * @returns The announcement.
 */
export function announced(): null | string | undefined {
  return document.querySelector('[role="status"][aria-live="polite"]')?.textContent;
}
