/**
 * Renders the end of a scene's footer: the control that shows and hides the scene's source, or a
 * line saying the scene has none.
 */

import { type ReactElement } from "react";

import { CodeXmlIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Text } from "@stealthscale/component-typography";

import { useWords } from "#words.ts";

/**
 * Describes the props of `Opens`.
 */
export interface OpensProps {
  /**
   * The source snippet, or `null` when the scene has none.
   */
  readonly code: null | string;

  /**
   * The id of the source panel, referenced by `aria-controls`.
   */
  readonly id: string;

  /**
   * Called when the control is pressed.
   */
  readonly onPress: () => void;

  /**
   * Whether the source panel is open.
   */
  readonly open: boolean;
}

/**
 * Renders the source disclosure control, or a line saying the scene has no source.
 *
 * @remarks
 *   The control is a disclosure. It sets `aria-expanded` and `aria-controls`, and its label does
 *   not change with its state, because `aria-expanded` announces the state. A hand-written scene
 *   without a sample has no source, so the footer renders a line of text instead of a control that
 *   opens an empty panel.
 * @param props - The snippet, the panel id, the open state and the press handler.
 * @returns The control, or the line of text in its place.
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
      palette="neutral"
      size="sm"
      variant="ghost"
    >
      <CodeXmlIcon aria-hidden size="1em" />
      {t("code.source")}
    </Button>
  );
}
