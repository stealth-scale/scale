/**
 * Renders a name of the bar: the trigger of its menu and an item of the bar's single tab stop, or,
 * in the folded bar's menu, the row that opens its menu as a submenu.
 *
 * @remarks
 *   The name is the menubar's `menuitem` and the menu's trigger in one element, so the bar keeps
 *   one tab stop and the arrows move along it. The machine sets `aria-haspopup`, `aria-expanded`
 *   and `aria-controls`. ArrowDown, Enter and Space open the menu with its first row highlighted,
 *   and ArrowUp with its last. A name in the bar registers its element, which the bar's steps and
 *   typeahead read in document order. The folded row ends with the root's `foldIndicator`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";

import { Indicator } from "#menu/indicator.tsx";
import { TriggerItem } from "#menu/trigger-item.tsx";
import { useBar, useFolded, useMenuValue } from "#menubar/bar.ts";
import { withContext } from "#menubar/context.ts";
import { Name } from "#menubar/name.tsx";

/**
 * Renders the name's button with the menubar's trigger class.
 */
const Named = withContext(Name, "trigger");

/**
 * Describes the props of a name: its words.
 */
export interface TriggerProps {
  /**
   * Words of the name, after a leading icon where it has one.
   */
  readonly children?: ReactNode | undefined;
}

/**
 * Renders the name as the bar's item, or as the folded bar's submenu row.
 *
 * @param props - The words.
 * @returns The `button` element.
 */
export function Trigger({ children }: TriggerProps): ReactElement {
  const { register } = useBar();
  const folded = useFolded();
  const value = useMenuValue();
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(
    () => (element === null ? undefined : register({ element, value })),
    [element, register, value],
  );

  if (folded !== undefined) {
    return (
      <TriggerItem>
        {children}
        {folded.indicator === undefined ? null : <Indicator>{folded.indicator}</Indicator>}
      </TriggerItem>
    );
  }

  return (
    <RovingFocus.Item as={Named} ref={setElement} role="menuitem">
      {children}
    </RovingFocus.Item>
  );
}
