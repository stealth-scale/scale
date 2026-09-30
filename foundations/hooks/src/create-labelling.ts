/**
 * Creates the context through which a component's label reports that it is mounted.
 *
 * @remarks
 *   A root points `aria-labelledby` at its label part only while the label is mounted, because an
 *   ID reference to an element that does not exist is invalid. A mounted label calls the root's
 *   setter with `true`, and with `false` when it unmounts.
 */

import { type FunctionComponent } from "react";

import { createRequiredContext, type ProvidedProps } from "#create-required-context.ts";
import { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";

/**
 * Describes what `createLabelling` returns: the provider a root renders and the hook its label
 * calls.
 */
export type Labelling = readonly [
  provider: FunctionComponent<ProvidedProps<(labelled: boolean) => void>>,
  useLabelled: () => void,
];

/**
 * Creates the provider and the hook for one component's label.
 *
 * @param name - Name of the component, which the error for a label outside its root names.
 * @returns The provider and the hook.
 */
export function createLabelling(name: string): Labelling {
  const [LabellingProvider, useLabelling] =
    createRequiredContext<(labelled: boolean) => void>(name);

  /**
   * Reports a label to the root while the calling part is mounted.
   */
  function useLabelled(): void {
    const setLabelled = useLabelling();

    useSafeLayoutEffect(() => {
      setLabelled(true);

      return (): void => {
        setLabelled(false);
      };
    }, [setLabelled]);
  }

  return [LabellingProvider, useLabelled];
}
