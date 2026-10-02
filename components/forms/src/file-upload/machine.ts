/**
 * Runs the file upload machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the dropzone, the
 *   trigger and the list report one set of files. The machine checks each file a person picks,
 *   drops or pastes against `accept`, `minFileSize`, `maxFileSize`, `maxFiles` and `validate`, and
 *   keeps the files it accepts and the files it refuses, each refusal with its reasons.
 */

import { useId, useState } from "react";

import * as upload from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  splitEnumerable,
  useAnnounce,
} from "@stealthscale/hooks";

import { acceptMessage, type Messages, rejectMessage } from "#file-upload/announced.ts";

/**
 * Describes the api `upload.connect` returns: a prop getter per part, and the files and the
 * methods that change them.
 */
export type FileUploadApi = ReturnType<typeof upload.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The dropzone takes its name
 *   from its content, the delete trigger takes `label`, and the preview image takes `alt`.
 */
export type FileUploadOptions = Omit<Partial<upload.Props>, "translations">;

/**
 * Describes what `onFileAccept` receives: the accepted files.
 */
export type FileAcceptDetails = upload.FileAcceptDetails;

/**
 * Describes what `onFileChange` receives: the accepted and the refused files.
 */
export type FileChangeDetails = upload.FileChangeDetails;

/**
 * Describes one reason the machine refuses a file, or a code `validate` returns.
 */
export type FileError = upload.FileError;

/**
 * Describes what `onFileReject` receives: the refused files with their reasons.
 */
export type FileRejectDetails = upload.FileRejectDetails;

/**
 * Describes one refused file with its reasons.
 */
export type FileRejection = upload.FileRejection;

/**
 * Describes what `validate` receives beside the file: the files accepted and refused so far.
 */
export type FileValidateDetails = upload.FileValidateDetails;

/**
 * Describes which list an item group renders: the accepted files or the refused ones.
 */
export type ItemType = upload.ItemType;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useFileUpload` throws for a part rendered outside `FileUpload.Root`.
 */
export const [ApiProvider, useFileUpload] = createRequiredContext<FileUploadApi>("FileUpload");

/**
 * Describes what the root needs from the machine: the api and the ID of the label.
 */
export interface FileUploadMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: FileUploadApi;

  /**
   * ID the machine gives `FileUpload.Label`.
   */
  readonly labelId: string;
}

/**
 * Starts the file upload machine and returns its connected api and the label's ID.
 *
 * @remarks
 *   Every change of the accepted files is announced, and every refusal in a second live region, so
 *   one pick that adds a file and refuses another is read in full. Inside a field the hidden input
 *   takes the field's control ID, so a press on the field's label opens the file picker.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param messages - The words the root announces.
 * @param control - ID the field around the upload gives its control, or nothing outside a field. A
 *   hidden input ID the caller passes in `ids` replaces it.
 * @returns The connected api and the label's ID.
 */
export function useFileUploadMachine(
  options: FileUploadOptions,
  messages: Messages,
  control: string | undefined,
): FileUploadMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `file-upload:${id}:label`;
  const announceAccepted = useAnnounce();
  const announceRejected = useAnnounce();
  const [kept, setKept] = useState<readonly File[]>(options.defaultAcceptedFiles ?? []);
  const before = options.acceptedFiles ?? kept;
  const service = useMachine(upload.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...omitUndefined({ hiddenInput: control }), ...options.ids, label: labelId },
    onFileAccept: (details) => {
      setKept(details.files);
      announceAccepted(acceptMessage(before, details.files, messages));
      options.onFileAccept?.(details);
    },
    onFileReject: (details) => {
      announceRejected(rejectMessage(details.files, messages));
      options.onFileReject?.(details);
    },
  });

  return { api: upload.connect(service, normalizeProps), labelId };
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitFileUploadProps<Props extends FileUploadOptions>(
  props: Props,
): [FileUploadOptions, Omit<Props, keyof upload.Props>] {
  const [options, rest] = splitEnumerable(upload.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
