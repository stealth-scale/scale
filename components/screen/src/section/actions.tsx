/**
 * Renders the row of actions at the end of the title's row, and the menu of the actions a narrow
 * section folds away.
 *
 * @remarks
 *   The element is `div`. The row keeps the end of the title's row at every width and does not
 *   wrap, so a long title wraps beside it. While an action is folded, the row renders the menu's
 *   trigger after the actions it keeps, as an `outline` button at the actions' size.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { FoldContext, More, Trigger, useFolded } from "#folding/index.ts";
import { withContext } from "#section/context.ts";
import { buttonSizeOf, useSection } from "#section/state.ts";

/**
 * Renders the `div` with the recipe's actions class.
 */
const Row = withContext("div", "actions");

/**
 * Describes the props of the actions row: the menu's words and mark, and the props of a `div`.
 */
export interface ActionsProps extends ComponentProps<typeof Row> {
  /**
   * Words that name the menu of folded actions. Defaults to `More actions`.
   */
  readonly more?: string | undefined;

  /**
   * Mark the menu's trigger shows in place of its words.
   */
  readonly moreIcon?: ReactNode | undefined;
}

/**
 * Renders the row, with the menu at its end while an action is folded.
 *
 * @param props - The menu's words and mark, and the props of a `div`.
 * @returns The `div` element.
 */
export function Actions({
  children,
  more = "More actions",
  moreIcon,
  ...rest
}: ActionsProps): ReactElement {
  const { size } = useSection();
  const [entries, fold] = useFolded();

  return (
    <FoldContext value={fold}>
      <Row {...rest}>
        {children}
        {entries.length > 0 && (
          <More
            entries={entries}
            trigger={
              <Trigger icon={moreIcon} label={more} size={buttonSizeOf(size)} variant="outline" />
            }
          />
        )}
      </Row>
    </FoldContext>
  );
}
