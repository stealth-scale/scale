/**
 * Renders the control that opens and closes a panel.
 *
 * @remarks
 *   The trigger reads its panel from the shell's store by name, so a control in the header opens
 *   the navigation in the body without either part receiving the other. It sets `aria-controls`,
 *   `aria-expanded` and `data-state` from the panel. A panel that has dropped under the page is
 *   always shown, so the trigger renders nothing then. Name the control for the panel: `Navigation`
 *   with `aria-expanded` announces as "Navigation, collapsed, button".
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useAppShellPanel } from "#app-shell/state.ts";

/**
 * Renders the trigger `button`, typed `button` so it submits no form.
 */
const Pressable = withContext("button", "trigger", { defaultProps: { type: "button" } });

/**
 * Describes the props of `Trigger`.
 */
export interface TriggerProps extends Omit<ComponentProps<typeof Pressable>, "aria-controls"> {
  /**
   * Name of the panel the control opens. Defaults to `navbar`.
   */
  readonly panel?: string | undefined;
}

/**
 * Renders the control that toggles one panel.
 *
 * @param props - `panel` and the `button` element's props.
 * @returns The control, or `null` while its panel has dropped under the page.
 */
export function Trigger({ onClick, panel = "navbar", ...rest }: TriggerProps): null | ReactElement {
  const held = useAppShellPanel(panel);

  if (held?.stacked === true) return null;

  return (
    <Pressable
      aria-controls={held?.id}
      aria-expanded={held?.open ?? false}
      data-state={held?.open === true ? "open" : "closed"}
      {...rest}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) held?.setOpen(!held.open);
      }}
    />
  );
}
