/**
 * Renders the line a signature is written on.
 *
 * @remarks
 *   The element is a `div` hidden from assistive technology, drawn as a dashed line near the
 *   control's bottom. It takes no pointer events, so a stroke that starts on it still draws.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#signature-pad/context.ts";
import { useSignaturePad } from "#signature-pad/machine.ts";

/**
 * Renders the guide `div` with the signature pad's guide class.
 */
const Lined = withContext("div", "guide");

/**
 * Describes the props of the guide: the props of a `div`.
 */
export type GuideProps = ComponentProps<typeof Lined>;

/**
 * Renders the guide with the machine's props.
 *
 * @param props - Attributes of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Guide(props: GuideProps): ReactElement {
  const api = useSignaturePad();

  return <Lined aria-hidden {...mergeProps(api.getGuideProps(), props)} />;
}
