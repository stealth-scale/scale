/**
 * Draws the footer of a scene's card: the control that shows its source, the control that audits
 * it, and whichever of the two a reader has open.
 */

import { type ReactElement, type RefObject, useId } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Code } from "#catalogue/code.tsx";
import { Findings } from "#catalogue/page-audit.tsx";
import { Checks } from "#catalogue/page-checks.tsx";
import { Opens } from "#catalogue/page-opens.tsx";
import { Rated } from "#catalogue/page-rated.tsx";
import { usePanels } from "#catalogue/use-panels.ts";

/**
 * Describes what the footer takes.
 */
export interface ToolsProps {
  /**
   * The scene's source, or `null` where the index cut none for it.
   */
  readonly code: null | string;

  /**
   * The element the scene was drawn into, which is what the audit reads.
   */
  readonly stage: RefObject<HTMLElement | null>;

  /**
   * The scene's title, which heads the source.
   */
  readonly title: string;
}

/**
 * Draws the footer and whichever panel is open under it.
 *
 * @remarks
 *   Draw it inside `Card.Root` after the content, because the footer and the panels are parts of
 *   the card. The footer already lays its children along a line, so the two controls need nothing
 *   round them.
 *   Both panels carry the one id, because only one of them is ever drawn and both controls point
 *   at it. A panel is drawn only while it is open, so a closed panel costs the page nothing.
 *   What the audit came to is reported at the start of the footer and the panel is opened only
 *   where the scene broke a rule. A clean audit has one thing to say, and a panel that opened to
 *   say it pushed the next scene off the screen to report that nothing was wrong. The audit control
 *   is a disclosure on the same terms: with nothing to disclose it states no panel.
 *   The report is cleared while a run is under way, so a reader pressing the control a second time
 *   does not read the last run's answer as this one's.
 * @param props - The source, the element to audit, and the scene's title.
 * @returns The footer, and the open panel.
 */
export function Tools({ code, stage, title }: ToolsProps): ReactElement {
  const { t } = useTranslation("specimen");
  const { audit, open, running, toggleAudit, toggleSource } = usePanels(stage);
  const id = useId();

  return (
    <>
      <Card.Footer>
        <Rated audit={running ? undefined : audit} />
        {code === null ? (
          <Text size="sm" tone="muted">
            {t("code.none")}
          </Text>
        ) : (
          <Opens id={id} onPress={toggleSource} open={open === "source"} />
        )}
        <Checks
          id={id}
          onPress={toggleAudit}
          open={open === "audit"}
          ran={audit !== undefined && audit.findings.length > 0}
          running={running}
        />
      </Card.Footer>
      {open === "source" && code !== null ? (
        <Card.Content id={id}>
          <Code code={code} title={title} />
        </Card.Content>
      ) : null}
      {open === "audit" && audit !== undefined ? (
        <Card.Content id={id}>
          <Findings audit={audit} />
        </Card.Content>
      ) : null}
    </>
  );
}
