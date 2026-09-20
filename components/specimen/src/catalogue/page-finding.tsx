/**
 * Draws one rule a scene broke: how bad it is, what it asks for, where it is written out, and
 * every element it was broken on.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Code, Text } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";

import { type Finding, type Impact } from "#catalogue/audited.ts";

/**
 * Lists the palette each impact is drawn in.
 *
 * @remarks
 *   The two that break a control for somebody take the error palette and the two that make it
 *   harder take the warning one. A finding axe left unrated takes the neutral palette rather than
 *   a guess, because a rating the catalogue invented would be read as axe's.
 */
const TONE: Readonly<Record<Impact, "error" | "warning">> = {
  critical: "error",
  minor: "warning",
  moderate: "warning",
  serious: "error",
};

/**
 * Describes what one finding takes.
 */
export interface FindingProps {
  /**
   * The finding.
   */
  readonly finding: Finding;
}

/**
 * Draws one finding.
 *
 * @remarks
 *   The rule's own identifier is drawn as code, because it is what a reader turns off in a
 *   configuration or searches the rule set for. The elements are listed under it as selectors, so
 *   a reader can put one into the console and look at what the audit was looking at. The link
 *   opens the rule in a new tab, since the audit it belongs to is lost on a navigation.
 * @param props - The finding.
 * @returns The finding, drawn.
 */
export function Found({ finding }: FindingProps): ReactElement {
  const { t } = useTranslation("specimen");
  const { impact, on, rule, says, url } = finding;

  return (
    <Stack gap="xs">
      <Stack align="baseline" direction="row" gap="sm" wrap>
        <Badge size="sm" status={impact === undefined ? "neutral" : TONE[impact]}>
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
