/**
 * Names a field that opens a panel, and the panel, after a label or the field's `aria-label`.
 *
 * @remarks
 *   A `listbox` named through `aria-labelledby` at a `combobox` takes that control's value as its
 *   name, not its `aria-label`: Chromium names such a panel "Amsterdam" for a trigger named "Zone".
 *   A root without a label names its panel by the `aria-label` its field reports. The field
 *   reports the name while it is mounted and withdraws it when it unmounts. The select, the
 *   combobox and the color picker share these names.
 */

import { type FunctionComponent } from "react";

import {
  createRequiredContext,
  type ProvidedProps,
  useSafeLayoutEffect,
} from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { type FieldState } from "#field/state.ts";

/**
 * Describes what `createNaming` returns: the provider a root renders and the hook its field calls.
 */
export type Naming = readonly [
  provider: FunctionComponent<ProvidedProps<(name: string | undefined) => void>>,
  useNamed: (name: string | undefined) => void,
];

/**
 * Describes the names a root shares with its parts.
 */
export interface Names {
  /**
   * IDs of the field's helper and error texts, which describe the field inside a `Field`.
   */
  readonly describedBy: string | undefined;

  /**
   * ID of the rendered label that names the field and the panel, or nothing without one.
   */
  readonly label: string | undefined;

  /**
   * `aria-label` of the field, which names the panel when no label does.
   */
  readonly name: string | undefined;
}

/**
 * Creates the provider and the hook for one component's field.
 *
 * @param component - Name of the component, which the error for a field outside its root names.
 * @returns The provider and the hook.
 */
export function createNaming(component: string): Naming {
  const [NamingProvider, useNaming] =
    createRequiredContext<(name: string | undefined) => void>(component);

  /**
   * Reports the field's `aria-label` to the root while the calling part is mounted.
   */
  function useNamed(name: string | undefined): void {
    const setNamed = useNaming();

    useSafeLayoutEffect(() => {
      setNamed(name);

      return (): void => {
        setNamed(undefined);
      };
    }, [name, setNamed]);
  }

  return [NamingProvider, useNamed];
}

/**
 * Returns the names a root shares: the field's texts, the label that names the field, and the
 * field's `aria-label`.
 *
 * @param field - The `Field` around the component, or nothing outside a field.
 * @param label - ID of the component's own label while one is mounted, or nothing.
 * @param name - `aria-label` the field reports, or nothing.
 * @returns The field's texts, the label's ID, or the field's label's ID, and the field's name.
 */
export function namesOf(field?: FieldState, label?: string, name?: string): Names {
  return {
    describedBy: field === undefined ? undefined : describedBy(field.ids),
    label: label ?? field?.ids.label,
    name,
  };
}
