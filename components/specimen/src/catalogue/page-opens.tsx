/**
 * Draws the control at the foot of a scene's card that shows and hides its source.
 */

import { type ReactElement } from "react";

import { CodeXmlIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * Describes what the control takes.
 */
export interface OpensProps {
  /**
   * The id of the panel it opens, which it points `aria-controls` at.
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
}

/**
 * Shows and hides a scene's source.
 *
 * @remarks
 *   A disclosure. It states `aria-expanded` and the id of the panel it controls, and the words on
 *   it do not change with its state, because the state is what `aria-expanded` announces.
 * @param props - The panel it opens, whether that panel is open, and what to tell on a press.
 * @returns The control.
 */
export function Opens({ id, onPress, open }: OpensProps): ReactElement {
  const { t } = useTranslation("specimen");

  return (
    <Button
      aria-controls={id}
      aria-expanded={open}
      onClick={onPress}
      size="sm"
      status="neutral"
      variant="ghost"
    >
      <CodeXmlIcon aria-hidden size="1em" />
      {t("code.source")}
    </Button>
  );
}
