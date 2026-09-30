/**
 * Renders the menu row of one choice a switcher lists.
 *
 * @remarks
 *   The row is a radio of the menu, checked for the current choice, with the choice's mark, its
 *   name and its detail. A choice with `href` renders its row as a link, so choosing it opens the
 *   choice's page. The check is the caller's glyph.
 */

import { type ReactElement, type ReactNode } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { type Choice, initialsOf } from "#switcher/choice.ts";

/**
 * Describes the props of `Option`.
 */
export interface OptionProps {
  /**
   * Whether the choice is the current one.
   */
  readonly checked: boolean;

  /**
   * Glyph that marks the current choice's row.
   */
  readonly checkIcon?: ReactNode | undefined;

  /**
   * The choice.
   */
  readonly choice: Choice;

  /**
   * Called with the choice's value when the reader chooses the row.
   */
  readonly onChoose: (value: string) => void;
}

/**
 * Renders the row as a checkable radio, or as a link for a choice with a page of its own.
 *
 * @param props - Whether the choice is current, the check's glyph, the choice and the handler.
 * @returns The menu's option item.
 */
export function Option({ checked, checkIcon, choice, onChoose }: OptionProps): ReactElement {
  const linked = choice.href === undefined ? {} : { as: "a" as const, href: choice.href };

  return (
    <Menu.OptionItem
      checked={checked}
      disabled={choice.disabled}
      onCheckedChange={() => {
        onChoose(choice.value);
      }}
      type="radio"
      value={choice.value}
      valueText={choice.label}
      {...linked}
    >
      <Menu.ItemIndicator>{checkIcon}</Menu.ItemIndicator>
      <Menu.ItemMark>{choice.mark ?? initialsOf(choice.label)}</Menu.ItemMark>
      <Menu.ItemLines>
        <Menu.ItemText>{choice.label}</Menu.ItemText>
        {choice.detail === undefined ? null : (
          <Menu.ItemDescription>{choice.detail}</Menu.ItemDescription>
        )}
      </Menu.ItemLines>
    </Menu.OptionItem>
  );
}
