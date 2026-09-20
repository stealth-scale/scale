/**
 * Draws what an accessibility audit found: one line saying what it came to, and a block per rule
 * the scene broke.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import { type Audit } from "#catalogue/audited.ts";
import { Found } from "#catalogue/page-finding.tsx";

/**
 * Describes what the findings take.
 */
export interface FindingsProps {
  /**
   * The audit to draw.
   */
  readonly audit: Audit;
}

/**
 * Draws the rules an audit found a scene breaking.
 *
 * @remarks
 *   The rules are drawn worst first, so the worst thing is the first thing read. How many there are
 *   is reported in the footer above rather than repeated at the head of the panel, and a clean
 *   audit opens no panel at all.
 * @param props - The audit to draw.
 * @returns A block per rule broken.
 */
export function Findings({ audit }: FindingsProps): ReactElement {
  return (
    <Stack gap="lg">
      {audit.findings.map((finding) => (
        <Found finding={finding} key={finding.rule} />
      ))}
    </Stack>
  );
}
