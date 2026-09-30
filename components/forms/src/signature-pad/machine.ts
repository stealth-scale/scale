/**
 * Runs the signature pad machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the control, the
 *   strokes and the clear trigger report one drawing. The machine turns each stroke of a primary
 *   pointer in the control into a filled outline through `perfect-freehand`, and keeps the strokes
 *   as SVG path data in the control's pixel coordinates.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as pad from "@zag-js/signature-pad";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `pad.connect` returns: a prop getter per part, and the strokes and the methods
 * that read and clear them.
 */
export type SignaturePadApi = ReturnType<typeof pad.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The control takes its name
 *   from a label, and the clear trigger takes `label`.
 */
export type SignaturePadOptions = Omit<Partial<pad.Props>, "translations">;

/**
 * Describes what `onDraw` receives: the committed strokes and the stroke being drawn.
 */
export type DrawDetails = pad.DrawDetails;

/**
 * Describes what `onDrawEnd` receives: the committed strokes and a function that renders them as an
 * image.
 */
export type DrawEndDetails = pad.DrawEndDetails;

/**
 * Describes the stroke options `drawing` takes: the ink, the size and `perfect-freehand`'s shape.
 */
export type DrawingOptions = pad.DrawingOptions;

/**
 * Describes the image types `getDataUrl` renders.
 */
export type DataUrlType = pad.DataUrlType;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useSignaturePad` throws for a part rendered outside `SignaturePad.Root`.
 */
export const [ApiProvider, useSignaturePad] =
  createRequiredContext<SignaturePadApi>("SignaturePad");

/**
 * Describes what the root needs from the machine: the api and the ID of the label.
 */
export interface SignaturePadMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: SignaturePadApi;

  /**
   * ID the machine gives `SignaturePad.Label`.
   */
  readonly labelId: string;
}

/**
 * Starts the signature pad machine and returns its connected api and the label's ID.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the pad gives its control, or nothing outside a field. The
 *   hidden input takes it, because a `label` points at a form control. A hidden input ID the caller
 *   passes in `ids` replaces it.
 * @returns The connected api and the label's ID.
 */
export function useSignaturePadMachine(
  options: SignaturePadOptions,
  control: string | undefined,
): SignaturePadMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `signature-pad:${id}:label`;
  const service = useMachine(pad.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...omitUndefined({ hiddenInput: control }), ...options.ids, label: labelId },
  });

  return { api: pad.connect(service, normalizeProps), labelId };
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
export function splitSignaturePadProps<Props extends SignaturePadOptions>(
  props: Props,
): [SignaturePadOptions, Omit<Props, keyof pad.Props>] {
  const [options, rest] = splitEnumerable(pad.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
