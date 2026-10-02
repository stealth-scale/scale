/**
 * Renders the tabs' root and starts the machine its parts share.
 *
 * @remarks
 *   The element is a `div` without a role. The machine sets `tablist` on the list, `tab` on each
 *   trigger and `tabpanel` on each panel, and a role on the root would announce a widget that does
 *   not exist.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type CloseDetails, closeTab } from "#tabs/closing.ts";
import { withProvider } from "#tabs/context.ts";
import {
  ActionsProvider,
  ApiProvider,
  splitTabsProps,
  type TabsOptions,
  useTabsMachine,
} from "#tabs/machine.ts";

/**
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the close handler, the recipe's
 * variants and the props of a `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. It derives every
 *   ARIA reference from `id`, and reads `dir` for the arrow keys.
 */
export interface RootProps
  extends
    Omit<
      ComponentProps<typeof Framed>,
      "defaultValue" | "dir" | "id" | "onChange" | "onClose" | "value"
    >,
    TabsOptions {
  /**
   * Called with the value of a closable tab that a person closes, after the selection has moved
   * off it. The caller removes the tab and its panel.
   */
  readonly onClose?: ((details: CloseDetails) => void) | undefined;
}

/**
 * Renders the root and provides the machine's api and the root's actions to the parts.
 *
 * @param props - The machine's options, the close handler, the recipe's variants and the props of
 *   a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({ onClose, ...props }: RootProps): ReactElement {
  const [options, rest] = splitTabsProps(props);
  const { api, measure } = useTabsMachine(options);
  const actions = {
    close: (tab: HTMLElement): void => {
      closeTab(tab, api, onClose);
    },
    measure,
  };

  return (
    <ApiProvider value={api}>
      <ActionsProvider value={actions}>
        <Framed {...rest} {...api.getRootProps()} />
      </ActionsProvider>
    </ApiProvider>
  );
}
