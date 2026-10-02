/**
 * Renders one section per part of a page, and the counts of what the reader resolved and no table
 * lists.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";

import { Failed } from "#catalogue/failed.tsx";
import { PartSection } from "#catalogue/page-part.tsx";
import { type Part } from "#catalogue/parted.ts";
import { slugOf } from "#catalogue/slug.ts";
import { type Dropped } from "#catalogue/types.ts";
import { useWords } from "#words.ts";

/**
 * Describes the props {@link PropsBody} accepts.
 */
export interface PropsBodyProps {
  /**
   * The error the props loader rejected with. Undefined while the loader is pending and after it
   * resolves.
   */
  readonly failure?: Error | undefined;

  /**
   * Every part of the page. Undefined until the loader resolves.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * Sums the conditions and the foreign properties every part dropped.
 */
function dropped(parts: readonly Part[]): Dropped {
  return parts.reduce(
    (held, part) => ({
      conditions: held.conditions + part.dropped.conditions,
      foreign: held.foreign + part.dropped.foreign,
    }),
    { conditions: 0, foreign: 0 },
  );
}

/**
 * Renders a section per part, or one line of text when there are no parts to render.
 *
 * @remarks
 *   Undefined parts, an empty array and a failure are three different results: a pending load, a
 *   page the reader found nothing for, and a load that failed. The dropped counts are summed once
 *   at the foot of the band and not under every part, because a root component resolves to over a
 *   thousand properties of which a handful are its own and a short table reads as the whole list
 *   without that number.
 * @param props - The parts to render, or the error that stopped them loading.
 * @returns The sections, or the single line of text that stands in for them.
 */
export function PropsBody({ failure, parts }: PropsBodyProps): ReactElement {
  const { t } = useWords();

  if (failure !== undefined) return <Failed failure={failure} said="props.failed" />;
  if (parts === undefined) return <Text tone="muted">{t("props.loading")}</Text>;
  if (parts.length === 0) return <Text tone="muted">{t("props.none")}</Text>;

  return (
    <Stack gap="xl">
      {parts.map((part) => (
        <PartSection id={slugOf(part.name)} key={part.name} part={part} />
      ))}
      <Text size="sm" tone="subtle">
        {t("props.dropped", {
          conditions: dropped(parts).conditions,
          foreign: dropped(parts).foreign,
        })}
      </Text>
    </Stack>
  );
}
