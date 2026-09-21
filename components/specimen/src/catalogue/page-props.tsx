/**
 * Draws what every part of a page accepts, as one section per part, and says once what the reader
 * resolved and no table draws.
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
 * Describes what the props take.
 */
export interface PropsBodyProps {
  /**
   * Why the parts could not be read, or nothing where they were or are still loading.
   */
  readonly failure?: Error | undefined;

  /**
   * Every part of the page, or nothing until they have loaded.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * Counts what the reader resolved and no table draws, across every part.
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
 * Draws a section per part, or one line while there is nothing to draw.
 *
 * @remarks
 *   A page whose components the reader found nothing for says so rather than drawing an empty
 *   panel. The cases read differently: nothing loaded yet is a wait, nothing found is an answer,
 *   and a load that failed is a failure, said with its reason and the one thing a reader can do.
 *   The parts are held apart by the room a table already leaves inside itself, and no more. Each
 *   one is a panel with an edge of its own, so the edge is what parts them and a wider gap only
 *   pushes the next heading off the screen.
 *   What the reader dropped is counted once at the foot of the band rather than under every part.
 *   One root resolves to over a thousand properties of which a handful are its own, so a reader who
 *   cannot see that number reads a short table as the whole truth. Written per part it was a line
 *   between every pair of tables saying much the same thing.
 * @param props - The parts to draw, or the failure to say.
 * @returns The sections, or the line that stands in for them.
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
