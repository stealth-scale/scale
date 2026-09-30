/**
 * Renders a node's ports: a React Flow handle per port on the side its edges enter or leave.
 *
 * @remarks
 *   Inputs are on the side edges enter, the top while the graph runs down and the left while it
 *   runs right, and outputs are on the opposite side. The ports of one side are spread evenly along
 *   it through `--graph-port-along`, so two ports are at a third and two thirds of it. Each handle
 *   contains its port's name, written beside the handle once a side has two or more ports, and read
 *   to a screen reader alone while it has one. A port starts and ends new connections while the
 *   canvas lets nodes connect and the port is not disabled. React Flow measures a node's handles
 *   when it measures the node, and a handle that mounts later is never measured, so a node whose
 *   edges come and go keeps its ports and marks the one no edge meets `unused`.
 */

import { type ReactElement } from "react";

import { Handle, Position, useStore } from "@xyflow/react";

import { withContext } from "#graph/context.ts";
import { type GraphDirection } from "#layout/rank.ts";

/**
 * Renders the port's name with the recipe's port name class.
 */
const Name = withContext("span", "portName");

/**
 * Describes one port of a node: its identity, its name, and whether it takes new connections.
 */
export interface GraphPort {
  /**
   * Whether the port refuses new connections. It still renders.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Identity an edge's `sourceHandle` or `targetHandle` names the port by.
   */
  readonly id: string;

  /**
   * Name of the port, such as `Pass` beside `Fail`.
   */
  readonly label: string;

  /**
   * Whether no edge meets the port. An unused port is still rendered and measured, and is
   * invisible, so an edge that meets it later finds it.
   */
  readonly unused?: boolean | undefined;
}

/**
 * Describes the props of a node's ports: the side's direction, the kind and the ports.
 */
export interface PortsProps {
  /**
   * Way the graph's edges run, which decides the side the ports are on.
   */
  readonly direction: GraphDirection;

  /**
   * `target` for the ports edges enter, `source` for the ports they leave.
   */
  readonly kind: "source" | "target";

  /**
   * Ports of the side, in order along it.
   */
  readonly ports: readonly GraphPort[];
}

/**
 * Returns the side of the node the ports of a kind are on.
 */
function sideOf(direction: GraphDirection, kind: "source" | "target"): Position {
  if (direction === "right") return kind === "target" ? Position.Left : Position.Right;

  return kind === "target" ? Position.Top : Position.Bottom;
}

/**
 * Renders a handle per port, spread along the side, each containing its name.
 *
 * @param props - The direction, the kind and the ports.
 */
export function Ports({ direction, kind, ports }: PortsProps): ReactElement {
  const connectable = useStore((state) => state.nodesConnectable);
  const side = sideOf(direction, kind);
  const shown = ports.length > 1;

  return (
    <>
      {ports.map((port, index) => {
        const open = connectable && port.disabled !== true;
        const along: Record<string, string> = {
          "--graph-port-along": `${String(((index + 1) / (ports.length + 1)) * 100)}%`,
        };

        return (
          <Handle
            data-unused={port.unused === true ? "" : undefined}
            id={port.id}
            isConnectable={open}
            isConnectableStart={open}
            key={port.id}
            position={side}
            style={along}
            type={kind}
          >
            <Name data-hidden={shown ? undefined : ""}>{port.label}</Name>
          </Handle>
        );
      })}
    </>
  );
}
