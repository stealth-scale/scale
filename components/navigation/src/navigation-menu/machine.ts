/**
 * Connects the navigation menu machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the triggers, the
 *   panels, the indicator and the viewport report one open item. The machine derives every
 *   element's ID from `id` and an item's `value`.
 */

import { useEffect, useId, useState } from "react";

import * as navigationMenu from "@zag-js/navigation-menu";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  splitEnumerable,
  useControllableState,
} from "@stealthscale/hooks";

/**
 * Describes the api `navigationMenu.connect` returns: a prop getter per part, the open item's
 * value, and the methods that change it.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine.
 */
export type NavigationMenuApi = ReturnType<typeof navigationMenu.connect>;

/**
 * Describes the machine options, every one optional.
 *
 * @remarks
 *   `translations` is left out, because the root takes its name as `aria-label`.
 */
export type NavigationMenuOptions = Omit<Partial<navigationMenu.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the value of the open item, or an empty string once
 * every item is closed.
 */
export type ValueChangeDetails = navigationMenu.ValueChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useNavigationMenu` throws for a part rendered outside `NavigationMenu.Root`.
 */
export const [ApiProvider, useNavigationMenu] =
  createRequiredContext<NavigationMenuApi>("NavigationMenu");

/**
 * Starts the navigation menu machine and returns its connected api.
 *
 * @remarks
 *   The machine measures the open trigger and tracks Escape and presses outside the open panel
 *   when its value changes after mount, and never for the value it mounts with. The hook keeps the
 *   value, from `value` or `defaultValue`, and hands the machine an item open at mount from the
 *   render after the first commit, so the machine sees that item open as a change. `onValueChange`
 *   receives each change the machine makes, and never the value the menu mounts with.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api.
 */
export function useNavigationMenuMachine(options: NavigationMenuOptions): NavigationMenuApi {
  const { defaultValue, onValueChange, value: stated, ...rest } = options;
  const generated = useId();
  const [value, setValue] = useControllableState({
    defaultValue: defaultValue ?? "",
    onChange: (next: string) => onValueChange?.({ value: next }),
    value: stated,
  });
  const [committed, setCommitted] = useState(value === "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the machine sees an item open at mount only as a change after the first commit
    setCommitted(true);
  }, []);

  const service = useMachine(navigationMenu.machine, {
    ...omitUndefined(rest),
    id: rest.id ?? generated,
    onValueChange: (details) => {
      setValue(details.value);
    },
    value: committed ? value : "",
  });

  return navigationMenu.connect(service, normalizeProps);
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
export function splitNavigationMenuProps<Props extends NavigationMenuOptions>(
  props: Props,
): [NavigationMenuOptions, Omit<Props, keyof navigationMenu.Props>] {
  const [options, rest] = splitEnumerable(navigationMenu.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
