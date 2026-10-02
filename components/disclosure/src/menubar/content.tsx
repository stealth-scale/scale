/**
 * Renders the panel a name of the bar opens, and hands the sideways arrows back to the bar.
 *
 * @remarks
 *   The part renders the menu's positioner and panel. In a panel of the bar, ArrowRight closes the
 *   menu and opens the next one along the bar with its first row highlighted, and ArrowLeft the
 *   one before, unless the highlighted row opens a submenu, which the arrow towards it opens. The
 *   two arrows swap in a bar whose `dir` is `rtl`. Tab and Shift+Tab in the panel or its submenus
 *   close the menu and move focus to the element after or before the bar, from the menu's name.
 *   The panel takes these keys in the capture phase, because the machine stops the arrows at the
 *   panel and cancels Tab in a panel without a tabbable element. A caller who needs the panel
 *   outside a clipping ancestor wraps this part in a portal.
 */

import { type KeyboardEvent, type ReactElement, useEffect } from "react";

import { Content as MenuContent, type ContentProps as MenuContentProps } from "#menu/content.tsx";
import { useMenu } from "#menu/machine.ts";
import { Positioner } from "#menu/positioner.tsx";
import { useBar, useFolded, useMenuValue } from "#menubar/bar.ts";

/**
 * Maps each inline arrow to its step along a left-to-right bar.
 */
const ACROSS: Readonly<Record<string, number | undefined>> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Selects a row of a panel that takes the highlight.
 */
const ROW = "[role^=menuitem]:not([data-disabled])";

/**
 * Returns true when a key press comes from this panel and not from a submenu inside it.
 */
function isOwn(event: KeyboardEvent<HTMLElement>): boolean {
  const { currentTarget, target } = event;

  return target instanceof Element && target.closest("[role=menu]") === currentTarget;
}

/**
 * Returns true when the panel's highlighted row opens a submenu.
 */
function opensSubmenu(panel: HTMLElement): boolean {
  const highlighted = panel.getAttribute("aria-activedescendant");
  const row = highlighted === null ? null : panel.querySelector(`[id="${highlighted}"]`);

  return row instanceof HTMLElement && row.dataset["part"] === "trigger-item";
}

/**
 * Describes the props of the panel: the props of the menu's panel.
 */
export type ContentProps = MenuContentProps;

/**
 * Renders the positioner and the panel, and steps the bar on the sideways arrows.
 *
 * @remarks
 *   The menu opens on the render after the step, and its panel enters the document on a later
 *   one, so the panel claims the step once its first row is in the document.
 * @param props - The rows and the props of the menu's panel.
 * @returns The positioner, or nothing while the panel is out of the document.
 */
export function Content({ onKeyDownCapture, ...props }: ContentProps): ReactElement {
  const { api } = useMenu();
  const { claimStep, closeValue, focusName, menus, step } = useBar();
  const folded = useFolded();
  const value = useMenuValue();
  const { id } = api.getContentProps();

  useEffect(() => {
    if (!api.open || folded !== undefined) return;

    const first = document.querySelector<HTMLElement>(`[id="${id}"] ${ROW}`)?.dataset["value"];

    if (first !== undefined && claimStep(value) === true) api.setHighlightedValue(first);
  }, [api, claimStep, folded, id, value]);

  /**
   * Steps the bar on a sideways arrow pressed in this panel, and closes the menu on Tab from its
   * name, where the browser's Tab then starts.
   */
  const stepped = (event: KeyboardEvent<HTMLDivElement>): void => {
    onKeyDownCapture?.(event);

    if (folded !== undefined) return;

    if (event.key === "Tab") {
      event.stopPropagation();
      focusName(value);
      closeValue(value);

      return;
    }

    const across = ACROSS[event.key];

    if (across === undefined || !isOwn(event)) return;

    const delta = menus.dir === "rtl" ? -across : across;

    if (delta > 0 && opensSubmenu(event.currentTarget)) return;

    event.preventDefault();
    event.stopPropagation();
    step(delta);
  };

  return (
    <Positioner>
      <MenuContent onKeyDownCapture={stepped} {...props} />
    </Positioner>
  );
}
