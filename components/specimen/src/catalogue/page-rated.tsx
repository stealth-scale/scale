/**
 * Draws what an audit came to, as one line at the foot of the scene it audited.
 */

import { type ReactElement } from "react";

import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";

import { type Audit } from "#catalogue/audited.ts";
import { useWords } from "#words.ts";

/**
 * Describes what the line takes.
 */
export interface RatedProps {
  /**
   * The audit to report, or nothing until one has run.
   */
  readonly audit: Audit | undefined;
}

/**
 * Reports what one audit came to.
 *
 * @remarks
 *   A clean audit says how many rules it held the scene to, because `No problems` alone leaves a
 *   reader unsure whether anything ran. A broken one says how many rules the scene broke, and the
 *   panel under the card says which.
 *   The line takes the ink of what it reports and a mark beside it, so a reader running down a page
 *   of scenes reads the result without reading the words. Neither is the only carrier: the words
 *   say the same thing, which is what a reader who cannot tell the two inks apart reads.
 *   It is announced as it arrives. The audit runs on a press and answers a moment later, so a
 *   reader on a screen reader would otherwise press the control and hear nothing.
 *   The ink is the paragraph's and the mark sits inside it, so the mark is drawn in the same ink.
 *   An ink written as a rule on a box around the two is compiled from what stands at the tag, and
 *   one picked by a condition compiled to nothing and left the mark black beside green words. The
 *   `tone` axis is the recipe's own and is read as the component draws, which is what a condition
 *   can be written into.
 *   The row is a stack and states no alignment. A stack running across centres its children
 *   already, and `baseline` set over that stood the mark a mark's height above the words: an inline
 *   drawing takes its bottom edge as its baseline.
 * @param props - The audit to report.
 * @returns The line, or nothing until an audit has run.
 */
export function Rated({ audit }: RatedProps): null | ReactElement {
  const { t } = useWords();

  if (audit === undefined) return null;

  const clean = audit.findings.length === 0;

  return (
    <Text
      aria-live="polite"
      marginInlineEnd="auto"
      size="sm"
      tone={clean ? "success" : "error"}
      weight="medium"
    >
      <Stack as="span" direction="row" gap="xs">
        {clean ? (
          <CircleCheckIcon aria-hidden size="1em" />
        ) : (
          <CircleAlertIcon aria-hidden size="1em" />
        )}
        {clean
          ? t("audit.clean", { count: audit.passed })
          : t("audit.broken", { count: audit.findings.length })}
      </Stack>
    </Text>
  );
}
