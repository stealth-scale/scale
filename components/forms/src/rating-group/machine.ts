/**
 * Runs the rating group machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the items and their
 *   glyphs report one value. A press on an item rates it, a pointer over an item previews its
 *   value, and the arrow keys, Home and End move the rating.
 */

import { useId } from "react";

import * as rating from "@zag-js/rating-group";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `rating.connect` returns: a prop getter per part, and the value and the
 * methods that change it.
 */
export type RatingGroupApi = ReturnType<typeof rating.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because the root takes the items' words as `getItemLabel`.
 */
export type RatingGroupOptions = Omit<Partial<rating.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the value.
 */
export type ValueChangeDetails = rating.ValueChangeDetails;

/**
 * Describes what `onHoverChange` receives: the value under the pointer, or -1 once it leaves.
 */
export type HoverChangeDetails = rating.HoverChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useRatingGroup` throws for a part rendered outside `RatingGroup.Root`.
 */
export const [ApiProvider, useRatingGroup] = createRequiredContext<RatingGroupApi>("RatingGroup");

/**
 * Describes what the root needs from the machine: the api, the ID it gives the label, and the
 * function that ends a pointer's preview.
 */
export interface RatingGroupMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: RatingGroupApi;

  /**
   * ID the machine gives `RatingGroup.Label`.
   */
  readonly labelId: string;

  /**
   * Sends the machine the event a pointer leaving the group sends, which moves it from its hover
   * state, where it takes no keys, to its focus state. The machine ignores the event in its idle
   * state.
   */
  readonly release: () => void;
}

/**
 * Starts the rating group machine and returns its connected api, the label's ID and `release`.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api, the ID and `release`.
 */
export function useRatingGroupMachine(options: RatingGroupOptions): RatingGroupMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `rating:${id}:label`;
  const service = useMachine(rating.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...options.ids, label: labelId },
  });

  /**
   * Ends the pointer's preview.
   */
  function release(): void {
    service.send({ type: "GROUP_POINTER_LEAVE" });
  }

  return { api: rating.connect(service, normalizeProps), labelId, release };
}

/**
 * Splits the root's props into the machine's options and the element's props, without the options
 * the root leaves out.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitRatingGroupProps<Props extends RatingGroupOptions>(
  props: Props,
): [RatingGroupOptions, Omit<Props, keyof rating.Props>] {
  const [options, rest] = splitEnumerable(rating.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
