/**
 * Resolves what a file upload takes from the field or the fieldset around it, and starts its
 * machine.
 *
 * @remarks
 *   The group is named by `FileUpload.Label` while one is rendered, and otherwise by the label of a
 *   field or the legend of a fieldset around it. Inside a field the group is described by the
 *   field's helper and error texts, and takes the field's disabled, invalid, read-only and required
 *   states and size. Inside a fieldset without a field it takes the group's disabled state and
 *   size. A prop the caller states overrides each.
 */

import { useState } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import { type Announcements, messagesOf } from "#file-upload/announced.ts";
import {
  type FileUploadApi,
  type FileUploadOptions,
  useFileUploadMachine,
} from "#file-upload/machine.ts";
import { type Shared, type Size } from "#file-upload/state.ts";

/**
 * Describes what the root renders from the settled state.
 */
export interface Grouping {
  /**
   * Connected api of the machine.
   */
  readonly api: FileUploadApi;

  /**
   * Name and description of the group, where either is settled.
   */
  readonly naming: Readonly<Record<string, string>>;

  /**
   * Setter the label reports its mounting through.
   */
  readonly setLabelled: (labelled: boolean) => void;

  /**
   * State the root shares with the parts.
   */
  readonly shared: Shared;
}

/**
 * Resolves the upload's state, name and description, and starts the machine.
 *
 * @param options - The machine options split from the root's props.
 * @param announcements - The announcement props of the root.
 * @param size - The size the root states, or nothing.
 * @returns The machine's api, the group's name and description, the label's setter and the shared
 *   state.
 */
export function useGrouping(
  options: FileUploadOptions,
  announcements: Announcements,
  size: Size | undefined,
): Grouping {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const stated = { ...inherited(field, group), ...options };
  const { api, labelId } = useFileUploadMachine(
    stated,
    messagesOf(announcements),
    field?.ids.control,
  );

  return {
    api,
    naming: omitUndefined({
      "aria-describedby": field === undefined ? undefined : describedBy(field.ids),
      "aria-labelledby": labelled ? labelId : (field?.ids.label ?? legend),
    }),
    setLabelled,
    shared: {
      disabled: stated.disabled === true,
      locale: stated.locale ?? "en-US",
      readOnly: stated.readOnly === true,
      size: sized(size, field, group) ?? "md",
    },
  };
}
