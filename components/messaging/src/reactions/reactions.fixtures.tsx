/**
 * Builds the rows of reactions the part specs render, and opens the picker.
 */

import { type ReactElement } from "react";

import { screen } from "@testing-library/react";

import { pressed } from "@stealthscale/testing-react";

import { Choice, type ChoiceProps } from "#reactions/choice.tsx";
import { Item, type ItemProps } from "#reactions/item.tsx";
import { Picker, type PickerProps } from "#reactions/picker.tsx";
import { Root, type RootProps } from "#reactions/root.tsx";

/**
 * Describes the parts a case sets props on.
 */
interface Parts {
  /**
   * The props of the first choice.
   */
  readonly choice?: Partial<ChoiceProps>;

  /**
   * The props of the first reaction.
   */
  readonly item?: Partial<ItemProps>;

  /**
   * The props of the picker.
   */
  readonly picker?: Partial<PickerProps>;

  /**
   * The props of the root.
   */
  readonly root?: RootProps;
}

/**
 * Renders a row of two reactions, the first pressed by the reader, and a picker of two choices.
 *
 * @param parts - The props the case sets on the root, the first reaction and the picker.
 * @returns The row.
 */
export function reacted(parts: Parts = {}): ReactElement {
  return (
    <Root {...parts.root}>
      <Item count={3} label="Thumbs up, 3 people, including you" pressed {...parts.item}>
        👍
      </Item>
      <Item count={1} label="Party popper, 1 person">
        🎉
      </Item>
      <Picker icon={<span aria-hidden="true">+</span>} {...parts.picker}>
        <Choice label="Heart" value="heart" {...parts.choice}>
          ❤️
        </Choice>
        <Choice label="Eyes" value="eyes">
          👀
        </Choice>
      </Picker>
    </Root>
  );
}

/**
 * Presses the picker's trigger and returns the panel.
 *
 * @param name - The trigger's accessible name.
 * @returns The panel.
 */
export async function opened(name = "Add a reaction"): Promise<HTMLElement> {
  await pressed(screen.getByRole("button", { name }));

  return screen.getByRole("dialog");
}
