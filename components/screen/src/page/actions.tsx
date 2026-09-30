/**
 * Renders the row of actions at the end of the title's row, and the menu of the actions a narrow
 * page folds away.
 *
 * @remarks
 *   The row keeps the end of the title's row at every width and does not wrap. While an action is
 *   folded, the row renders the menu's trigger after the actions it keeps, as an `outline` button
 *   at the actions' size. `when` renders the row at one width of the page alone.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { FoldContext, More, Trigger, useFolded } from "#folding/index.ts";
import { withContext } from "#page/context.ts";
import { buttonSizeOf, shown, usePage, type WhenProps } from "#page/state.ts";

/**
 * Renders the `div` with the recipe's actions class.
 */
const Row = withContext("div", "actions");

/**
 * Describes the props of the actions row: the menu's words and mark, `when` and the props of a
 * `div`.
 */
export interface ActionsProps extends ComponentProps<typeof Row>, WhenProps {
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
 * Renders the row at the width `when` names, with the menu at its end while an action is folded.
 *
 * @param props - The menu's words and mark, the width and the props of a `div`.
 * @returns The `div` element, or nothing at the other width.
 */
export function Actions({
  children,
  more = "More actions",
  moreIcon,
  when,
  ...rest
}: ActionsProps): null | ReactElement {
  const page = usePage();
  const [entries, fold] = useFolded();

  if (!shown(when, page.narrow)) return null;

  return (
    <FoldContext value={fold}>
      <Row {...rest}>
        {children}
        {entries.length > 0 && (
          <More
            entries={entries}
            trigger={
              <Trigger icon={moreIcon} label={more} size={buttonSizeOf(page)} variant="outline" />
            }
          />
        )}
      </Row>
    </FoldContext>
  );
}
