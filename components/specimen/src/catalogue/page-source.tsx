/**
 * Draws a scene's source at the foot of its stage: a control at the right end of the card's footer
 * that shows and hides the source under it.
 */

import { type ReactElement, useId, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";

import { CodeGlyph } from "#catalogue/code-glyph.tsx";
import { Code } from "#catalogue/code.tsx";

/**
 * Describes what a scene's source takes.
 */
export interface SourceProps {
  /**
   * The scene's source, or `null` where the index cut none for it.
   */
  readonly code: null | string;

  /**
   * The scene's title, which heads the block.
   */
  readonly title: string;
}

/**
 * Draws the card's footer holding the control, and the source in the library's code block under
 * it while the control is on; or the footer saying the index cut no source for the scene.
 *
 * @remarks
 *   Draw it inside `Card.Root` after the content, because the footer and the block are parts of
 *   the card. The control is a disclosure: it states `aria-expanded` and the id of the block it
 *   controls, and the block is drawn only while it is on, so a closed source costs the page
 *   nothing. The words stay `Source` in both states, because the state is what `aria-expanded`
 *   announces.
 */
export function Source({ code, title }: SourceProps): ReactElement {
  const { t } = useTranslation("specimen");
  const [open, setOpen] = useState(false);
  const id = useId();

  if (code === null) {
    return (
      <Card.Footer>
        <Text size="sm" tone="muted">
          {t("code.none")}
        </Text>
      </Card.Footer>
    );
  }

  return (
    <>
      <Card.Footer>
        <Button
          aria-controls={id}
          aria-expanded={open}
          onClick={() => {
            setOpen((shown) => !shown);
          }}
          size="sm"
          status="neutral"
          variant="ghost"
        >
          <CodeGlyph />
          {t("code.source")}
        </Button>
      </Card.Footer>
      {open ? (
        <Card.Content id={id}>
          <Code code={code} title={title} />
        </Card.Content>
      ) : null}
    </>
  );
}
