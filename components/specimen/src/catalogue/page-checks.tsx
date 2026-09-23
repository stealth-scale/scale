/**
 * Renders the control at the foot of a scene's card that runs an accessibility audit of the scene.
 */

import { type ReactElement } from "react";

import { AccessibilityIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";

import { useWords } from "#words.ts";

/**
 * Describes the props of `Checks`.
 */
export interface ChecksProps {
  /**
   * The id of the results panel, referenced by `aria-controls` once an audit has run.
   */
  readonly id: string;

  /**
   * Called when the control is pressed.
   */
  readonly onPress: () => void;

  /**
   * Whether the results panel is open.
   */
  readonly open: boolean;

  /**
   * Whether an audit has run, which creates the panel the control discloses.
   */
  readonly ran: boolean;

  /**
   * Whether an audit is running, which disables the control.
   */
  readonly running: boolean;
}

/**
 * Runs a scene's accessibility audit and discloses the results.
 *
 * @remarks
 *   The control becomes a disclosure only after the first run. Before that there is no panel, so
 *   it sets neither `aria-expanded` nor `aria-controls`. Its label never changes. While an audit
 *   runs, the control is disabled and sets `aria-busy` from the first frame, which blocks a second
 *   press and is what a screen reader announces. A label that changed during a run switched back
 *   within one frame on most scenes.
 * @param props - The panel id, the audit state and the press handler.
 * @returns The control.
 */
export function Checks({ id, onPress, open, ran, running }: ChecksProps): ReactElement {
  const { t } = useWords();

  return (
    <Button
      aria-busy={running}
      disabled={running}
      onClick={onPress}
      palette="neutral"
      size="sm"
      variant="ghost"
      {...(ran ? { "aria-controls": id, "aria-expanded": open } : {})}
    >
      <AccessibilityIcon aria-hidden size="1em" />
      {t("audit.check")}
    </Button>
  );
}
