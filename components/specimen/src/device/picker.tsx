/**
 * Draws one picker of a device's bar: the axis it turns, and the library's switcher over the
 * axis's values with the one in the frame on its button.
 */

import { type ReactElement } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher } from "@stealthscale/component-screen";

import { Caption } from "#caption.tsx";
import { Picker as Row } from "#device/parts.ts";

/**
 * The size the indicator's glyph is drawn at, in pixels, which is the small icon size.
 */
const GLYPH = 16;

/**
 * Describes what a picker takes.
 */
export interface PickerProps {
  /**
   * The prop the axis turns, which captions the picker and names it for a screen reader.
   */
  readonly knob: string;

  /**
   * The values, each named the way its cell is captioned.
   */
  readonly names: readonly string[];

  /**
   * Told the position of the value picked.
   */
  readonly onPick: (position: number) => void;

  /**
   * The position of the value in the frame.
   */
  readonly picked: number;
}

/**
 * Draws the axis's name and the switcher beside it.
 *
 * @remarks
 *   The switcher is the same control the bar of an application switches the theme with, in its
 *   toolbar placement, so a page reads as one set of controls. The knob is written before it in
 *   the caption's muted ink, the way the grid captions a cell, and is what a screen reader hears
 *   before the value, so `size sm` says what pressing the control changes.
 * @param props - The axis, its values, which is picked and what to tell.
 * @returns The caption and the switcher.
 */
export function Picker({ knob, names, onPick, picked }: PickerProps): ReactElement {
  return (
    <Row>
      <Caption>{knob}</Caption>
      <Switcher.Root placement="toolbar" size="sm" variant="outline">
        <Switcher.Trigger label={knob}>
          <Switcher.Label>
            <Switcher.Name>{names[picked]}</Switcher.Name>
          </Switcher.Label>
          <Switcher.Indicator>
            <ChevronsUpDownIcon size={GLYPH} />
          </Switcher.Indicator>
        </Switcher.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            {names.map((name, position) => (
              <Menu.OptionItem
                checked={position === picked}
                key={name}
                onCheckedChange={() => {
                  onPick(position);
                }}
                type="radio"
                value={String(position)}
              >
                <Menu.ItemIndicator>
                  <CheckIcon aria-hidden size={GLYPH} />
                </Menu.ItemIndicator>
                <Menu.ItemText>{name}</Menu.ItemText>
              </Menu.OptionItem>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Switcher.Root>
    </Row>
  );
}
