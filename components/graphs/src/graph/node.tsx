/**
 * Renders a node's card: a header of an icon, a title, a subtitle, a status and actions, a body, a
 * problem line, and the node's ports on the sides the graph runs between.
 *
 * @remarks
 *   A custom node type renders `Graph.Node` and passes what differs: its body, its ports, its
 *   status. The card is 256px wide, the width `layoutGraph` places a node by. A status is the data
 *   package's `Status`, a dot in its palette beside its word, so a color is never the only signal.
 *   `invalid` edges the card in the error ink, and `problem` writes the fault on the card's last
 *   line. `dimmed` recedes the card by a dashed edge and a muted title. The actions are outside
 *   React Flow's drag surface, so a press on one does not move the node. `tag` renders above the
 *   card's top edge at its end, so a tag that comes and goes never changes the card's size.
 *   `branch` straddles the middle of the card's bottom edge, over the handle edges leave by while
 *   the graph runs down, and the card keeps half the control's height free under its last line. On
 *   a canvas that marks changes, a card that was added, changed or removed takes the change as its
 *   tag, a data `Badge` with a mark and the word, unless it states its own tag. A card the
 *   comparison lists as unchanged recedes, unless it states `dimmed`.
 */

import { type ReactElement, type ReactNode } from "react";

import { Badge, Status } from "@stealthscale/component-data";
import { type Palette } from "@stealthscale/theme/authoring";

import { withContext } from "#graph/context.ts";
import { type NodeChange, useNodeChange } from "#graph/diffed.ts";
import { type GraphPort, Ports } from "#graph/ports.tsx";
import { useGraphDirection } from "#graph/state.ts";
import { type GraphDirection } from "#layout/rank.ts";

/**
 * Renders the card with the recipe's node class.
 */
const Card = withContext("div", "node");

/**
 * Renders the header row with the recipe's node header class.
 */
const Header = withContext("div", "nodeHeader");

/**
 * Renders the icon's box with the recipe's node icon class.
 */
const Icon = withContext("span", "nodeIcon");

/**
 * Renders the title and the subtitle's column with the recipe's node text class.
 */
const Text = withContext("span", "nodeText");

/**
 * Renders the title with the recipe's node title class.
 */
const Title = withContext("span", "nodeTitle");

/**
 * Renders the subtitle with the recipe's node subtitle class.
 */
const Subtitle = withContext("span", "nodeSubtitle");

/**
 * Renders the actions' row with the recipe's node actions class.
 */
const Actions = withContext("span", "nodeActions");

/**
 * Renders the body with the recipe's node body class.
 */
const Body = withContext("div", "nodeBody");

/**
 * Renders the problem line with the recipe's node problem class.
 */
const Problem = withContext("div", "nodeProblem");

/**
 * Renders the tag's box with the recipe's node tag class.
 */
const Tag = withContext("span", "nodeTag");

/**
 * Renders the branch control's box with the recipe's node branch class.
 */
const Branch = withContext("span", "nodeBranch");

/**
 * Palette of each change's tag.
 */
const PALETTES: Record<NodeChange["change"], Palette> = {
  added: "success",
  changed: "warning",
  removed: "error",
  unchanged: "neutral",
};

/**
 * Mark of each change's tag, before its word, so a color is never the only signal.
 */
const MARKS: Record<NodeChange["change"], string> = {
  added: "+",
  changed: "~",
  removed: "−",
  unchanged: "",
};

/**
 * Describes a node's status: the palette of its dot and its word.
 */
export interface GraphStatus {
  /**
   * Word of the status, such as `Running`.
   */
  readonly label: string;

  /**
   * Palette of the status's dot.
   */
  readonly palette: Palette;
}

/**
 * Describes the props of a node's card.
 */
export interface NodeProps {
  /**
   * Controls in the header, such as a menu, outside the drag surface.
   */
  readonly actions?: ReactNode | undefined;

  /**
   * Control on the middle of the card's bottom edge, such as one that opens and closes the node's
   * branch.
   */
  readonly branch?: ReactNode | undefined;

  /**
   * Body of the card, such as a configuration's summary.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Whether the card recedes, as a node outside a traced path does.
   */
  readonly dimmed?: boolean | undefined;

  /**
   * Way this node's edges run, where it differs from the graph's.
   */
  readonly direction?: GraphDirection | undefined;

  /**
   * Glyph before the title, from the caller. Hidden from assistive technology.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Ports edges enter, in order along their side.
   */
  readonly inputs?: readonly GraphPort[] | undefined;

  /**
   * Whether the node is misconfigured, which edges the card in the error ink.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Ports edges leave, in order along their side.
   */
  readonly outputs?: readonly GraphPort[] | undefined;

  /**
   * Fault of an invalid node in one line, shown under the body.
   */
  readonly problem?: ReactNode | undefined;

  /**
   * Status of the node, a dot in a palette beside a word.
   */
  readonly status?: GraphStatus | undefined;

  /**
   * Line under the title, such as the model or the condition.
   */
  readonly subtitle?: ReactNode | undefined;

  /**
   * Word above the card's top edge at its end, such as the node's relation to a traced node.
   */
  readonly tag?: ReactNode | undefined;

  /**
   * Title of the node.
   */
  readonly title: ReactNode;
}

/**
 * Returns the card's header: the icon, the title and the subtitle, the status and the actions.
 */
function headerOf({ actions, icon, status, subtitle, title }: NodeProps): ReactElement {
  return (
    <Header>
      {icon === undefined ? null : <Icon aria-hidden>{icon}</Icon>}
      <Text>
        <Title>{title}</Title>
        {subtitle === undefined ? null : <Subtitle>{subtitle}</Subtitle>}
      </Text>
      {status === undefined ? null : (
        <Status.Root palette={status.palette} size="sm">
          <Status.Indicator />
          {status.label}
        </Status.Root>
      )}
      {actions === undefined ? null : <Actions className="nodrag nopan">{actions}</Actions>}
    </Header>
  );
}

/**
 * Returns the card's body, its problem line while the node is invalid, and its tag.
 */
function contentOf({ children, invalid, problem, tag }: NodeProps): ReactElement {
  return (
    <>
      {children === undefined ? null : <Body>{children}</Body>}
      {invalid === true && problem !== undefined ? <Problem>{problem}</Problem> : null}
      {tag === undefined ? null : <Tag>{tag}</Tag>}
    </>
  );
}

/**
 * Returns the tag of a card's change: a badge with the change's mark and word, or nothing for an
 * unchanged node and for a node without a change.
 */
function changeTagOf(change: NodeChange | undefined): ReactNode {
  if (change?.word === undefined) return undefined;

  return (
    <Badge aria-hidden palette={PALETTES[change.change]} size="sm" variant="surface">
      {`${MARKS[change.change]} ${change.word}`}
    </Badge>
  );
}

/**
 * Renders the card with its ports, header, body, problem line, tag and branch control.
 *
 * @remarks
 *   The branch control renders after the ports, so it covers the handle of the side it is on.
 * @param props - The title, the details, the ports and the states.
 */
export function Node(props: NodeProps): ReactElement {
  const { branch, inputs = [], outputs = [] } = props;
  const flow = useGraphDirection();
  const change = useNodeChange();
  const direction = props.direction ?? flow;
  const dimmed = props.dimmed ?? change?.change === "unchanged";

  return (
    <Card
      data-dimmed={dimmed ? "" : undefined}
      data-invalid={props.invalid === true ? "" : undefined}
    >
      <Ports direction={direction} kind="target" ports={inputs} />
      {headerOf(props)}
      {contentOf({ ...props, tag: props.tag ?? changeTagOf(change) })}
      <Ports direction={direction} kind="source" ports={outputs} />
      {branch === undefined ? null : <Branch>{branch}</Branch>}
    </Card>
  );
}
