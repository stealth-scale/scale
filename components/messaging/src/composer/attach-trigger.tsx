/**
 * Renders the control that opens the file picker, and the hidden file input behind it.
 *
 * @remarks
 *   The control is the actions `Button`, square, small, in the ghost look, named by `label`,
 *   "Attach files" unless stated, with the caller's glyph. A press opens the browser's file picker,
 *   and the files picked reach the root's `onAttach`. The file input is `hidden`, so neither a
 *   screen reader nor the Tab key finds a second, unnamed control. It is emptied after each pick,
 *   so picking the same file twice attaches it twice. `accept` limits the files the picker offers.
 */

import { type ReactElement, useRef } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { useComposerState } from "#composer/state.ts";

/**
 * Describes the props of the attach control: its name, the files it accepts, and the props of the
 * actions `Button`.
 */
export interface AttachTriggerProps extends ButtonProps {
  /**
   * File types the picker offers, as an `input`'s `accept` attribute takes them.
   */
  readonly accept?: string | undefined;

  /**
   * Accessible name of the control, "Attach files" unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the control and the hidden file input.
 *
 * @param props - The name, the accepted types and the props of the actions `Button`, the glyph
 *   among its children.
 * @returns The `button` element and the `input` element.
 */
export function AttachTrigger({
  accept,
  label = "Attach files",
  onClick,
  ...props
}: AttachTriggerProps): ReactElement {
  const { disabled, onAttach } = useComposerState();
  const picker = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        aria-label={label}
        disabled={disabled}
        shape="square"
        size="sm"
        variant="ghost"
        {...props}
        onClick={(event) => {
          onClick?.(event);
          picker.current?.click();
        }}
      />
      <input
        accept={accept}
        hidden
        multiple
        onChange={(event) => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the files of an input of type file are never null
          const files = [...(event.currentTarget.files as FileList)];

          event.currentTarget.value = "";

          if (files.length > 0) onAttach?.(files);
        }}
        ref={picker}
        type="file"
      />
    </>
  );
}
