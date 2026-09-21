/**
 * Shows the status matrix: every size, a grid with every crossing measured, the same grid with one
 * column never run, a grid a reader picks from, and a grid drawn without sections or with nothing
 * in it at all.
 *
 * @remarks
 *   Every scene draws the same six services against the same three regions, so a reader comparing
 *   two scenes is reading one change rather than two grids.
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

import {
  Board,
  Matrix,
  Sample,
  type Scene,
  specimen,
  useWords,
  valuesOf,
} from "@stealthscale/specimen";

import {
  type MatrixCell,
  type MatrixHeading,
  type MatrixState,
  StatusMatrix,
} from "#status-matrix/index.ts";
import { recipe } from "#status-matrix/recipe.ts";

/**
 * The services every grid draws, each under the team that runs it.
 */
const SERVICES = [
  ["checkout-api", "payments"],
  ["ledger", "payments"],
  ["search-api", "discovery"],
  ["ranking", "discovery"],
] as const;

/**
 * The regions every grid draws across the top.
 */
const REGIONS = ["EU", "US", "APAC"];

/**
 * Every crossing the grids read, written as a row, a column and a state.
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
 * Reads the rows in the reader's language, each gathered under the team that runs it.
 */
function useServices(): readonly MatrixHeading[] {
  const { t } = useWords("status-matrix");

  return SERVICES.map(([id, group]) => ({ group: t(group), id, label: id }));
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
   * Whether the rows are drawn straight through rather than gathered into sections.
   */
  readonly flat?: boolean | undefined;

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
  flat = false,
  rows,
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
      columns={REGIONS.map((region) => ({ id: region, label: region }))}
      corner={t("corner")}
      empty={t("nothing")}
      legend={t("legend")}
      rollup={t("worst")}
      rows={flat ? held.map(({ group: _group, ...row }) => row) : held}
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
 * Draws the grid at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix direction="column" knob="size" of={valuesOf(recipe, "size")}>
      {(size) => <Health size={size} />}
    </Matrix>
  );
}

/**
 * Draws the grid with every crossing measured.
 */
function Measured(): ReactElement {
  return <Health />;
}

/**
 * Draws the same grid twice, the second with one region never run.
 */
function Gapped(): ReactElement {
  const { t } = useWords("status-matrix");

  return (
    <Board>
      <Sample of={t("gap.every")}>
        <Health />
      </Sample>
      <Sample of={t("gap.short")}>
        <Health cells={MEASURED.filter((cell) => cell.column !== "APAC")} />
      </Sample>
    </Board>
  );
}

/**
 * Draws a grid a reader picks crossings from, and says what they picked.
 */
function Picking(): ReactElement {
  const { t } = useWords("status-matrix");
  const states = useStates();
  const [picked, setPicked] = useState<null | string>(null);

  return (
    <Board columns="1">
      <Health
        onSelectCell={(row, column, cell) => {
          const state = cell === undefined ? undefined : states[cell.state];

          setPicked(t("picked", { column, row, state: state?.label ?? t("unmeasured") }));
        }}
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

  return (
    <Board>
      <Sample of={t("plain.through")}>
        <Health flat />
      </Sample>
      <Sample of={t("plain.none")}>
        <Health cells={[]} rows={[]} />
      </Sample>
    </Board>
  );
}

/**
 * Every size.
 */
export const looks: Scene = {
  about: "status-matrix.looks.about",
  draw: Looks,
  title: "status-matrix.looks.title",
};

/**
 * Every crossing measured.
 */
export const measured: Scene = {
  about: "status-matrix.measured.about",
  draw: Measured,
  title: "status-matrix.measured.title",
};

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
  group: "Collections",
  id: "collections/status-matrix",
  imports: 'import { StatusMatrix } from "@stealthscale/component-collections";',
  scenes: [looks, measured, gapped, picking, plain],
  title: "status-matrix.title",
});
