/**
 * Draws the end of a scene's footer: the control that shows and hides its source, or the line that
 * says it carries none.
 */

import { type ReactElement } from "react";

import { CodeXmlIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Text } from "@stealthscale/component-typography";

import { useWords } from "#words.ts";

/**
 * Describes what the end of the footer takes.
 */
export interface OpensProps {
  /**
   * The line a reader copies, or `null` where the scene has none.
   */
  readonly code: null | string;

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
 * Shows and hides a scene's source, or says there is none.
 *
 * @remarks
 *   A disclosure. It states `aria-expanded` and the id of the panel it controls, and the words on
 *   it do not change with its state, because the state is what `aria-expanded` announces.
 *   A scene written by hand without a sample carries no line to copy. The footer says so in place
 *   of the control rather than drawing a control that opens on nothing.
 * @param props - The line to show, the panel it opens, whether that panel is open, and what to
 *   tell on a press.
 * @returns The control, or the line that stands in for it.
 */
export function Opens({ code, id, onPress, open }: OpensProps): ReactElement {
  const { t } = useWords();

  if (code === null) {
    return (
      <Text size="sm" tone="muted">
        {t("code.none")}
      </Text>
    );
  }

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
