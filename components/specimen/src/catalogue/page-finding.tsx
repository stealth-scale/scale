/**
 * Renders one axe finding: its impact, its rule, the rule's message, the elements it matched and a
 * link to the rule's documentation.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Code, Text } from "@stealthscale/component-typography";

import { type Finding, type Impact } from "#catalogue/audited.ts";
import { useWords } from "#words.ts";

/**
 * Maps each axe impact to the palette of its badge.
 *
 * @remarks
 *   `critical` and `serious` read the error palette, and `moderate` and `minor` read the warning
 *   palette. A finding without an impact reads the neutral palette, so the catalogue adds no rating
 *   of its own.
 */
const PALETTE: Readonly<Record<Impact, "error" | "warning">> = {
  critical: "error",
  minor: "warning",
  moderate: "warning",
  serious: "error",
};

/**
 * Describes the props of Found.
 */
export interface FindingProps {
  /**
   * The axe finding.
   */
  readonly finding: Finding;
}

/**
 * Renders one finding.
 *
 * @remarks
 *   The rule ID renders as code, because a developer searches for it or disables it by that ID. The
 *   matched elements render as selectors that paste into the browser console. The link opens in a
 *   new tab, because a navigation discards the audit.
 */
export function Found({ finding }: FindingProps): ReactElement {
  const { t } = useWords();
  const { impact, on, rule, says, url } = finding;

  return (
    <Stack gap="xs">
      <Stack align="baseline" direction="row" gap="sm" wrap>
        <Badge palette={impact === undefined ? "neutral" : PALETTE[impact]} size="sm">
          {impact ?? t("audit.unrated")}
        </Badge>
        <Code size="sm">{rule}</Code>
        <Text size="sm">{says}</Text>
      </Stack>
      <Stack as="ul" gap="xs">
        {on.map((broken) => (
          <Text as="li" key={broken.selector} size="sm" tone="muted">
            <Code size="sm">{broken.selector}</Code>
          </Text>
        ))}
      </Stack>
      <Text size="sm">
        <Link href={url} rel="noreferrer" target="_blank">
          {t("audit.rule", { rule })}
        </Link>
      </Text>
    </Stack>
  );
}
