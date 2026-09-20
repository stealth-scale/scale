/**
 * Draws the control at the foot of a scene's card that audits it for accessibility.
 */

import { type ReactElement } from "react";

import { AccessibilityIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * Describes what the control takes.
 */
export interface ChecksProps {
  /**
   * The id of the panel it opens, which it points `aria-controls` at once there is one.
   */
  readonly id: string;

  /**
   * Told when a reader presses it.
   */
  readonly onPress: () => void;

  /**
   * Whether the panel it opens is open.
   */
  readonly open: boolean;

  /**
   * Whether an audit has run, which is what gives it a panel to control.
   */
  readonly ran: boolean;

  /**
   * Whether an audit is under way, which holds it off.
   */
  readonly running: boolean;
}

/**
 * Runs a scene's accessibility audit and opens what it found.
 *
 * @remarks
 *   It is a disclosure only once there is something to disclose. Until the first run there is no
 *   panel, so it states neither `aria-expanded` nor a panel to control and announces itself as the
 *   plain control it is.
 *   The words say what it is doing while it runs. An audit of a large scene takes long enough for a
 *   reader to press again, and a control that looked unchanged would be pressed twice.
 * @param props - The panel it opens, its state, and what to tell on a press.
 * @returns The control.
 */
export function Checks({ id, onPress, open, ran, running }: ChecksProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Button
      disabled={running}
      onClick={onPress}
      size="sm"
      status="neutral"
      variant="ghost"
      {...(ran ? { "aria-controls": id, "aria-expanded": open } : {})}
    >
      <AccessibilityIcon aria-hidden size="1em" />
      {t(running ? "audit.running" : "audit.check")}
    </Button>
  );
}
