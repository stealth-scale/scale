/**
 * Renders a switcher from a list of choices: the trigger with the current choice, and the menu of
 * every choice with the caller's actions after a separator.
 *
 * @remarks
 *   The current choice is the caller's `value`, or the component's own state from `defaultValue`,
 *   which defaults to the first choice. The trigger shows the current choice's mark, its name and
 *   its detail. The glyphs are the caller's: `indicator` at the trigger's end and `checkIcon` on
 *   the current row.
 */

import { type ReactElement, type ReactNode } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";
import { useControllableState } from "@stealthscale/hooks";

import { type Choice } from "#switcher/choice.ts";
import { Current } from "#switcher/current.tsx";
import { Indicator } from "#switcher/indicator.ts";
import { Option } from "#switcher/option.tsx";
import { Placed } from "#switcher/placed.tsx";

/**
 * Describes the props of `Listed`.
 */
export interface ListedProps {
  /**
   * Glyph that marks the current choice's row.
   */
  readonly checkIcon?: ReactNode | undefined;

  /**
   * Rows after the choices, `Switcher.Action` elements.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The choices.
   */
  readonly choices: readonly Choice[];

  /**
   * Value of the choice that is current at first, when the caller does not control it.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Glyph at the end of the trigger.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * Kind of thing the switcher switches.
   */
  readonly label: string;

  /**
   * Called with the value of the choice the reader switches to.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Id the menu's machine gives the trigger.
   */
  readonly triggerId: string;

  /**
   * Value of the current choice, when the caller controls it.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the trigger and the menu of the choices.
 *
 * @param props - The choices, the current value, the glyphs, the label and the actions.
 * @returns The trigger and the portalled menu.
 */
export function Listed({
  checkIcon,
  children,
  choices,
  defaultValue,
  indicator,
  label,
  onValueChange,
  triggerId,
  value,
}: ListedProps): ReactElement {
  const [chosen, setChosen] = useControllableState({
    defaultValue: defaultValue ?? choices[0]?.value ?? "",
    onChange: onValueChange,
    value,
  });
  const current = choices.find((choice) => choice.value === chosen);

  return (
    <>
      <Placed label={label} name={current?.label} triggerId={triggerId}>
        {current === undefined ? null : <Current choice={current} />}
        {indicator === undefined ? null : <Indicator>{indicator}</Indicator>}
      </Placed>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {choices.map((choice) => (
              <Option
                checked={choice.value === chosen}
                checkIcon={checkIcon}
                choice={choice}
                key={choice.value}
                onChoose={setChosen}
              />
            ))}
            {children === undefined ? null : (
              <>
                <Menu.Separator />
                {children}
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </>
  );
}
