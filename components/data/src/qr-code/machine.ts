/**
 * Connects the QR code machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the frame, the
 *   pattern and the download encode the same value. The machine encodes with a quiet zone of four
 *   modules around the pattern, the margin ISO/IEC 18004 asks for, and at error correction `H`
 *   while a mark renders over the code, which covers modules. `encoding` states either value
 *   instead.
 */

import { useId } from "react";

import * as qrCode from "@zag-js/qr-code";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createLabelling,
  createRequiredContext,
  omitUndefined,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes the api `qrCode.connect` returns: a prop getter per part plus the value and the image.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type QrCodeApi = ReturnType<typeof qrCode.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type QrCodeOptions = Partial<qrCode.Props>;

/**
 * Lists every option the encoder reads at the encoder's default, but for a quiet zone of four
 * modules.
 *
 * @remarks
 *   The machine re-encodes when its `isEqual` finds the options changed. That function reads only
 *   the keys of the new options, so an option a caller drops leaves the old code in place. With
 *   every key stated, a dropped option returns to its default and the code follows.
 */
const ENCODING: qrCode.QrCodeGenerateOptions = {
  boostEcc: false,
  border: 4,
  invert: false,
  maskPattern: -1,
  maxVersion: 40,
  minVersion: 1,
};

/**
 * Describes what the root provides to its parts.
 */
export interface QrCodeMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: QrCodeApi;

  /**
   * True while a mark renders over the code.
   */
  readonly marked: boolean;
}

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useQrCode` throws when no `QrCode.Root` is mounted above the calling part.
 */
export const [MachineProvider, useQrCode] = createRequiredContext<QrCodeMachine>("QrCode");

/**
 * Creates the context through which a mark reports to the root that it renders.
 */
export const [MarkingProvider, useMarked] = createLabelling("QrCode");

/**
 * Starts the QR code machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 * @param marked - Whether a mark renders over the code.
 */
export function useQrCodeMachine(options: QrCodeOptions, marked: boolean): QrCodeApi {
  const generated = useId();
  const service = useMachine(qrCode.machine, {
    ...omitUndefined(options),
    encoding: { ...ENCODING, ecc: marked ? "H" : "L", ...options.encoding },
    id: options.id ?? generated,
  });

  return qrCode.connect(service, normalizeProps);
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitQrCodeProps<Props extends QrCodeOptions>(
  props: Props,
): [QrCodeOptions, Omit<Props, keyof qrCode.Props>] {
  return splitEnumerable(qrCode.splitProps<Props>)(props);
}
