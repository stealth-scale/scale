/**
 * Shows the status matrix: every size, a grid with one column never run, a grid a reader picks
 * from, and a grid drawn without sections or with nothing in it at all.
 *
 * @remarks
 *   The size scene is generated from the recipe, so a step added to the theme reaches the page
 *   without this file changing. The other three are written by hand, because a column nobody ran, a
 *   grid a reader picks from and a grid holding nothing are what the component is handed rather
 *   than axes of the recipe.
 *   Each scene draws one thing, draws it once, and draws it over a set of its own. The page held a
 *   scene of the grid with every crossing measured, a second copy of it beside the gapped grid,
 *   and a third under the picking scene, on top of the three the size scene draws. Every one of
 *   them read the same four services against the same three regions, so a reader scrolling the
 *   page read one grid five times and had to hunt for the cell that told two of them apart.
 *   The measured grid is now the size scene's middle step and nothing else. The gap runs over
 *   three services of the platform and streaming teams, the picking grid over two queues at three
 *   sites, and the flat grid over four pieces of plumbing that belong to no team. The subject and
 *   the states stay the same, because the states are written for that subject.
 *   The words are keys under `status-matrix` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/status-matrix.json`.
 */

import { type ReactElement, useState } from "react";

import {
  CheckIcon,
  CircleDashedIcon,
  LoaderIcon,
  MinusIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { Board, Sample, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import {
  type MatrixCell,
  type MatrixHeading,
  type MatrixState,
  StatusMatrix,
} from "#status-matrix/index.ts";
import { recipe } from "#status-matrix/recipe.ts";

/**
 * The services the size scene draws, each under the team that runs it.
 */
const SERVICES = [
  ["checkout-api", "payments"],
  ["ledger", "payments"],
  ["search-api", "discovery"],
  ["ranking", "discovery"],
] as const;

/**
 * The services the gap scene draws, which is a different set from the size scene's.
 *
 * @remarks
 *   No scene draws another scene's grid. Every scene drew the same four services against the same
 *   three regions, and a reader scrolling the page read one grid over and over and had to hunt for
 *   the cell that told two of them apart. The subject stays the same, because the states are
 *   written for it, and the set under it changes.
 */
const DELIVERY = [
  ["auth", "platform"],
  ["billing", "platform"],
  ["media", "streaming"],
] as const;

/**
 * The two services the picking scene draws.
 */
const QUEUES = [
  ["notifications", "streaming"],
  ["webhooks", "streaming"],
] as const;

/**
 * The services the flat scene draws, which state no team at all.
 */
const PLUMBING = ["cdn", "dns", "mail", "object-store"] as const;

/**
 * The regions the size scene and the gap scene draw across the top.
 */
const REGIONS = ["EU", "US", "APAC"];

/**
 * The sites the picking scene and the flat scene draw across the top.
 */
const SITES = ["Dublin", "Reston", "Osaka"];

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  imports: 'import { StatusMatrix } from "@stealthscale/component-collections";',
  name: "StatusMatrix",
};

/**
 * Every crossing the size scene reads, written as a row, a column and a state.
 */
const MEASURED: readonly MatrixCell[] = [
  { column: "EU", row: "checkout-api", state: "fine" },
  { column: "US", row: "checkout-api", state: "down" },
  { column: "APAC", row: "checkout-api", state: "slow" },
  { column: "EU", row: "ledger", state: "fine" },
  { column: "US", row: "ledger", state: "fine" },
  { column: "APAC", row: "ledger", state: "fine" },
  { column: "EU", row: "search-api", state: "fine" },
  { column: "US", row: "search-api", state: "rolling" },
  { column: "APAC", row: "search-api", state: "fine" },
  { column: "EU", row: "ranking", state: "slow" },
  { column: "US", row: "ranking", state: "fine" },
  { column: "APAC", row: "ranking", state: "skipped" },
];

/**
 * What the gap scene read, which is every region but APAC.
 */
const PARTLY: readonly MatrixCell[] = [
  { column: "EU", row: "auth", state: "fine" },
  { column: "US", row: "auth", state: "fine" },
  { column: "EU", row: "billing", state: "slow" },
  { column: "US", row: "billing", state: "down" },
  { column: "EU", row: "media", state: "rolling" },
  { column: "US", row: "media", state: "fine" },
];

/**
 * What the picking scene read.
 */
const QUEUED: readonly MatrixCell[] = [
  { column: "Dublin", row: "notifications", state: "fine" },
  { column: "Reston", row: "notifications", state: "slow" },
  { column: "Osaka", row: "notifications", state: "fine" },
  { column: "Dublin", row: "webhooks", state: "down" },
  { column: "Reston", row: "webhooks", state: "fine" },
];

/**
 * What the flat scene read.
 */
const PIPED: readonly MatrixCell[] = [
  { column: "Dublin", row: "cdn", state: "fine" },
  { column: "Reston", row: "cdn", state: "fine" },
  { column: "Osaka", row: "cdn", state: "slow" },
  { column: "Dublin", row: "dns", state: "fine" },
  { column: "Reston", row: "dns", state: "fine" },
  { column: "Osaka", row: "dns", state: "fine" },
  { column: "Dublin", row: "mail", state: "skipped" },
  { column: "Reston", row: "mail", state: "rolling" },
  { column: "Osaka", row: "mail", state: "skipped" },
  { column: "Dublin", row: "object-store", state: "down" },
  { column: "Reston", row: "object-store", state: "fine" },
  { column: "Osaka", row: "object-store", state: "fine" },
];

/**
 * Reads the caller's vocabulary in the reader's language.
 */
function useStates(): Readonly<Record<string, MatrixState>> {
  const { t } = useWords("status-matrix");

  return {
    down: { label: t("down"), mark: <XIcon />, tone: "error" },
    fine: { label: t("fine"), mark: <CheckIcon />, tone: "success" },
    rolling: { label: t("rolling"), mark: <LoaderIcon />, tone: "info" },
    skipped: { label: t("skipped"), mark: <MinusIcon />, tone: "neutral" },
    slow: { label: t("slow"), mark: <TriangleAlertIcon />, tone: "warning" },
  };
}

/**
 * Reads a set of rows in the reader's language, each gathered under the team that runs it.
 */
function useServices(
  of: ReadonlyArray<readonly [string, string]> = SERVICES,
): readonly MatrixHeading[] {
  const { t } = useWords("status-matrix");

  return of.map(([id, group]) => ({ group: t(group), id, label: id }));
}

/**
 * Describes what a scene asks the shared grid to draw beyond its variants.
 */
interface HealthProps {
  /**
   * The crossings to read, which is every one unless a scene says otherwise.
   */
  readonly cells?: readonly MatrixCell[] | undefined;

  /**
   * Hears a crossing picked, which turns every crossing into a button.
   */
  readonly onSelectCell?:
    | ((row: string, column: string, cell: MatrixCell | undefined) => void)
    | undefined;

  /**
   * The rows to draw, which is every service unless a scene says otherwise.
   */
  readonly rows?: readonly MatrixHeading[] | undefined;

  /**
   * The columns to draw, which is the regions unless a scene says otherwise.
   */
  readonly sites?: readonly string[] | undefined;

  /**
   * The step the grid is read at.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;
}

/**
 * Draws the services against the regions, rolled up and explained.
 *
 * @param props - What the grid shows beyond its marks.
 * @returns The grid and its legend.
 */
function Health({
  cells = MEASURED,
  rows,
  sites = REGIONS,
  size,
  ...rest
}: HealthProps): ReactElement {
  const { t } = useWords("status-matrix");
  const services = useServices();
  const held = rows ?? services;

  return (
    <StatusMatrix
      caption={t("caption")}
      cellLabel={(state, row, column) =>
        t("crossing", { column: column.id, row: row.id, state: state.label })
      }
      cells={cells}
      columns={sites.map((site) => ({ id: site, label: site }))}
      corner={t("corner")}
      empty={t("nothing")}
      legend={t("legend")}
      rollup={t("worst")}
      rows={held}
      rules="all"
      states={useStates()}
      unmeasured={{ label: t("unmeasured"), mark: <CircleDashedIcon />, tone: "neutral" }}
      variant="surface"
      {...(size === undefined ? {} : { size })}
      {...rest}
    />
  );
}

/**
 * Draws the grid with one region never run.
 *
 * @remarks
 *   The scene draws the gapped grid alone. Drawn beside a grid with every crossing measured it was
 *   two grids a reader had to compare cell by cell, and the size scene above already holds three
 *   of the measured one.
 */
function Gapped(): ReactElement {
  return <Health cells={PARTLY} rows={useServices(DELIVERY)} />;
}

/**
 * Draws a grid a reader picks crossings from, and says what they picked.
 *
 * @remarks
 *   Two queues rather than every service. What the scene is about is what a press does, and a grid
 *   the size of the one the size scene draws reads as another copy of that grid rather than as a
 *   grid to press.
 *   A press on the crossing already picked clears it. The grid marks no crossing as picked, so the
 *   line under it is the only answer a reader gets, and pressing the same crossing twice wrote the
 *   same line twice and read as a grid that had stopped listening.
 */
function Picking(): ReactElement {
  const { t } = useWords("status-matrix");
  const states = useStates();
  const [picked, setPicked] = useState<null | string>(null);

  return (
    <Board columns="1">
      <Health
        cells={QUEUED}
        onSelectCell={(row, column, cell) => {
          const state = cell === undefined ? undefined : states[cell.state];
          const said = t("picked", { column, row, state: state?.label ?? t("unmeasured") });

          setPicked((held) => (held === said ? null : said));
        }}
        rows={useServices(QUEUES)}
        sites={SITES}
      />
      <p>{picked ?? t("nothingYet")}</p>
    </Board>
  );
}

/**
 * Draws the grid without sections, and a grid holding nothing at all.
 */
function Plain(): ReactElement {
  const { t } = useWords("status-matrix");
  const rows = PLUMBING.map((id) => ({ id, label: id }));

  return (
    <Board>
      <Sample of={t("plain.through")}>
        <Health cells={PIPED} rows={rows} sites={SITES} />
      </Sample>
      <Sample of={t("plain.none")}>
        <Health cells={[]} rows={[]} sites={SITES} />
      </Sample>
    </Board>
  );
}

/**
 * A region nobody ran.
 */
export const gapped: Scene = {
  about: "status-matrix.gap.about",
  draw: Gapped,
  title: "status-matrix.gap.title",
};

/**
 * A grid a reader picks from.
 */
export const picking: Scene = {
  about: "status-matrix.picking.about",
  draw: Picking,
  title: "status-matrix.picking.title",
};

/**
 * No sections, and nothing at all.
 */
export const plain: Scene = {
  about: "status-matrix.plain.about",
  draw: Plain,
  title: "status-matrix.plain.title",
};

export default specimen({
  about: "status-matrix.about",
  id: "components/collections/status-matrix",
  imports: 'import { StatusMatrix } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<HealthProps>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => <Health {...props} />,
      namespace: "status-matrix",
      sample: SAMPLE,
    }),
    gapped,
    picking,
    plain,
  ],
  title: "status-matrix.title",
});
