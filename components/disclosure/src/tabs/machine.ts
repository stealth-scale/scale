/**
 * Connects the tabs machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the list, the tabs
 *   and the panels report the same selection. The machine derives the id of every tab and panel,
 *   and the ARIA references between them, from `id`.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as tabs from "@zag-js/tabs";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `tabs.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type TabsApi = ReturnType<typeof tabs.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `translations` is omitted, because a component's words are props. The list takes its
 *   accessible name as `aria-label` on `Tabs.List`.
 */
export type TabsOptions = Omit<Partial<tabs.Props>, "translations">;

/**
 * Describes a running machine: its connected api and the measurement of the selected tab.
 */
export interface TabsMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: TabsApi;

  /**
   * Measures the selected tab again and moves the indicator onto it.
   *
   * @remarks
   *   The machine measures the selected tab when the value changes and when the list or a tab
   *   changes size. A tab that closes or opens before the selected one moves it without either, so
   *   the indicator calls this after its list changes.
   */
  readonly measure: () => void;
}

/**
 * Describes what the root does for its parts besides the machine: close a tab, and measure the
 * selected tab.
 */
export interface TabsActions {
  /**
   * Closes a closable tab: hands its selection and its focus to a neighbour, then calls the root's
   * `onClose`.
   */
  readonly close: (tab: HTMLElement) => void;

  /**
   * Measures the selected tab again and moves the indicator onto it.
   */
  readonly measure: () => void;
}

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useTabs` throws when no `Tabs.Root` is mounted above the calling part.
 */
export const [ApiProvider, useTabs] = createRequiredContext<TabsApi>("Tabs");

/**
 * Actions of Zag's tabs machine.
 */
const ACTIONS = tabs.machine.implementations?.actions;

/**
 * Zag's action that selects a pressed tab, or deselects it under `deselectable`.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine declares setValue among its actions
const selectValue = ACTIONS?.["setValue"] as NonNullable<NonNullable<typeof ACTIONS>[string]>;

/**
 * Runs Zag's tabs machine with a `setValue` that sets the value it is sent.
 *
 * @remarks
 *   Under `deselectable`, Zag's action clears the value whenever the selected tab has focus, for a
 *   press and for `api.setValue` alike. A close of the focused selected tab sets the tab that takes
 *   its place, which that rule cleared. `SET_VALUE` sets its value here, and a press keeps Zag's
 *   rule.
 */
const MACHINE: typeof tabs.machine = {
  ...tabs.machine,
  implementations: {
    ...tabs.machine.implementations,
    actions: {
      ...ACTIONS,

      /**
       * Sets the value `SET_VALUE` carries, and selects or deselects a pressed tab as Zag does.
       */
      setValue(params) {
        if (params.event.type !== "SET_VALUE") {
          selectValue(params);

          return;
        }

        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the api's setValue sends a string
        params.context.set("value", params.event["value"] as string);
      },
    },
  },
};

/**
 * Creates the context through which the root provides its actions to its parts.
 *
 * @remarks
 *   `useTabsActions` throws when no `Tabs.Root` is mounted above the calling part.
 */
export const [ActionsProvider, useTabsActions] = createRequiredContext<TabsActions>("Tabs");

/**
 * Splits the root's props into machine settings and element props, without `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 *   `splitEnumerable` hands it a copy of the props, so React's `key` getter is never read.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitTabsProps<Props extends TabsOptions>(
  props: Props,
): [TabsOptions, Omit<Props, keyof tabs.Props>] {
  const [options, rest] = splitEnumerable(tabs.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}

/**
 * Starts the tabs machine and returns its connected api and the measurement of the selected tab.
 *
 * @remarks
 *   The measurement sends the machine's `SET_INDICATOR_RECT` without an id, which measures the
 *   selected tab. The api's `setIndicatorRect(value)` sends the tab's element id where the machine
 *   reads a value, so it measures nothing.
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useTabsMachine(options: TabsOptions): TabsMachine {
  const generated = useId();
  const service = useMachine(MACHINE, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return {
    api: tabs.connect(service, normalizeProps),
    measure: () => {
      service.send({ type: "SET_INDICATOR_RECT" });
    },
  };
}
