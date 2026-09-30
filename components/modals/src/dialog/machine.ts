/**
 * Connects the dialog machine and provides its api and the presence of its panel and backdrop to
 * the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the trigger, the
 *   backdrop, the positioner and the content report the same state. The machine derives the ids of
 *   the content, the title and the description from `id`, and points the content's
 *   `aria-labelledby` and `aria-describedby` at the last two while they are rendered.
 */

import { useId } from "react";

import * as dialog from "@zag-js/dialog";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes the api `dialog.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type DialogApi = ReturnType<typeof dialog.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type DialogOptions = Partial<dialog.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useDialog` throws when no `Dialog.Root` is mounted above the calling part.
 */
export const [ApiProvider, useDialog] = createRequiredContext<DialogApi>("Dialog");

/**
 * Creates the context through which the root provides the panel's presence to the positioner and
 * the content.
 */
export const [PanelProvider, usePanelPresence] = createRequiredContext<Presence>("Dialog");

/**
 * Creates the context through which the root provides the backdrop's presence to the backdrop.
 *
 * @remarks
 *   The backdrop runs its own exit animation beside the panel's, so it has a presence of its own.
 */
export const [BackdropProvider, useBackdropPresence] = createRequiredContext<Presence>("Dialog");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 *   `splitEnumerable` hands it a copy of the props, so React's `key` getter is never read.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitDialogProps<Props extends DialogOptions>(
  props: Props,
): [DialogOptions, Omit<Props, keyof dialog.Props>] {
  return splitEnumerable(dialog.splitProps<Props>)(props);
}

/**
 * Starts the dialog machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useDialogMachine(options: DialogOptions): DialogApi {
  const generated = useId();
  const service = useMachine(dialog.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return dialog.connect(service, normalizeProps);
}
