/**
 * Renders the strip on the edge between a panel and the page that opens and closes the panel.
 *
 * @remarks
 *   Render the rail in the body beside the panel it controls: after the navbar, or before an aside.
 *   It reads the panel from the shell's store by name, like the trigger. The strip is 24px wide and
 *   centred on the edge, and shows a line under the pointer. It is a second way to reach what the
 *   trigger and the panel's shortcut already do, so it takes no tab stop. The rail renders nothing
 *   while its panel is over the page or under it, and the recipe hides it under a coarse pointer.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useAppShellPanel } from "#app-shell/state.ts";

/**
 * Renders the rail `button`, typed `button` so it submits no form.
 */
const Pressable = withContext("button", "rail", { defaultProps: { type: "button" } });

/**
 * Describes the props of `Rail`.
 */
export interface RailProps extends Omit<ComponentProps<typeof Pressable>, "aria-controls"> {
  /**
   * Accessible name of the rail while its panel is open. Defaults to `Close`.
   */
  readonly closeLabel?: string | undefined;

  /**
   * Accessible name of the rail while its panel is closed. Defaults to `Open`.
   */
  readonly openLabel?: string | undefined;

  /**
   * Name of the panel the rail controls. Defaults to `navbar`.
   */
  readonly panel?: string | undefined;
}

/**
 * Renders the strip that toggles one panel.
 *
 * @param props - The labels, the panel's name and the `button` element's props.
 * @returns The strip, or `null` while its panel is not in the body.
 */
export function Rail({
  closeLabel = "Close",
  onClick,
  openLabel = "Open",
  panel = "navbar",
  ...rest
}: RailProps): null | ReactElement {
  const held = useAppShellPanel(panel);

  if (held === undefined || held.overlaid || held.stacked) return null;

  return (
    <Pressable
      aria-controls={held.id}
      aria-expanded={held.open}
      aria-label={held.open ? closeLabel : openLabel}
      tabIndex={-1}
      {...rest}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) held.setOpen(!held.open);
      }}
    />
  );
}
