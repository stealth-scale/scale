/**
 * Renders one tile of a treemap, which recharts clones with the tile's row and geometry: its
 * rectangle in its fill, its name, and its value and share under the name.
 *
 * @remarks
 *   A word clipped at a tile's edge reads as another word, so a line of words shows only where it
 *   fits whole. A painted tile writes its name where the tile is one line tall and the line under
 *   it where it is two, then measures each line after layout and marks one that is wider than the
 *   tile with `data-overflow`, which the recipe hides. The line under the name hides with the name.
 *   The tooltip writes every tile's name. The words take the kit's share class: the ink inside a
 *   halo in the panel's color, which reads on a tile of any color and lets the pointer through. The
 *   tile's group has `data-walk` with its place in the keyboard walk, and the tile at the chart's
 *   initial place opens the tooltip at itself. Recharts spreads the treemap's own props into every
 *   tile's, so the tile passes none of them on.
 */

import { type ReactElement, type RefObject, useRef } from "react";

import { Rectangle, Text } from "recharts";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { OVERFLOW, SHARE, TILE } from "#chart/recipe.ts";
import { useOpened } from "#chart/walk.ts";

/**
 * Space between a tile's edge and its words, in pixels.
 */
const INSET = 6;

/**
 * Height of a line of the tile's words, in pixels.
 */
const LINE = 16;

/**
 * Radius of a tile's corners, in pixels.
 */
const RADIUS = 2;

/**
 * Describes what a tile receives: the geometry and the row recharts passes, and the writer the
 * chart passes.
 */
export interface TileProps {
  /**
   * Depth of the tile: 0 for the root recharts adds, 1 for a top-level node.
   */
  readonly depth?: number | undefined;

  /**
   * Writes the line under the name from the tile's size, such as its value and its share. No line
   * renders without it.
   */
  readonly detail?: ((size: number) => string) | undefined;

  /**
   * CSS value of the tile's fill, transparent for a parent, which writes no words.
   */
  readonly fill?: string | undefined;

  /**
   * Height of the tile, in pixels.
   */
  readonly height?: number | undefined;

  /**
   * Place in the walk of the tile the tooltip opens at when the chart first renders, if any.
   */
  readonly initial?: number | undefined;

  /**
   * CSS value of the tile's opacity: its family's, which the legend fades.
   */
  readonly opacity?: string | undefined;

  /**
   * Words written on the tile.
   */
  readonly title?: string | undefined;

  /**
   * Size of the node the tile is.
   */
  readonly value?: number | undefined;

  /**
   * Place of the tile in the keyboard walk.
   */
  readonly walk?: number | undefined;

  /**
   * Width of the tile, in pixels.
   */
  readonly width?: number | undefined;

  /**
   * Position of the tile's left edge, in pixels.
   */
  readonly x?: number | undefined;

  /**
   * Position of the tile's top edge, in pixels.
   */
  readonly y?: number | undefined;
}

/**
 * Describes a tile as it renders: recharts' geometry and row, 0 or empty where recharts passes
 * none.
 */
interface Resolved {
  /**
   * CSS value of the tile's fill.
   */
  readonly fill: string;

  /**
   * Height of the tile, in pixels.
   */
  readonly height: number;

  /**
   * CSS value of the tile's opacity.
   */
  readonly opacity: string;

  /**
   * Words written on the tile.
   */
  readonly title: string;

  /**
   * Size of the node the tile is.
   */
  readonly value: number;

  /**
   * Width of the tile, in pixels.
   */
  readonly width: number;

  /**
   * Position of the tile's left edge, in pixels.
   */
  readonly x: number;

  /**
   * Position of the tile's top edge, in pixels.
   */
  readonly y: number;
}

/**
 * Describes the lines a tile writes: its name where it is one line tall, and the line under it
 * where it is two.
 */
interface Words {
  /**
   * Line under the name.
   */
  readonly detail?: string;

  /**
   * Name of the tile.
   */
  readonly name?: string;
}

/**
 * Describes the elements of a tile's two lines, which the tile measures after layout.
 */
interface Lines {
  /**
   * Line under the name.
   */
  readonly detail: RefObject<null | SVGTextElement>;

  /**
   * Name of the tile.
   */
  readonly name: RefObject<null | SVGTextElement>;
}

/**
 * Returns the tile as it renders, with 0, an empty title, a transparent fill and a whole opacity
 * where recharts passes none.
 */
function resolve(props: TileProps): Resolved {
  return {
    fill: props.fill ?? "transparent",
    height: props.height ?? 0,
    opacity: props.opacity ?? "1",
    title: props.title ?? "",
    value: props.value ?? 0,
    width: props.width ?? 0,
    x: props.x ?? 0,
    y: props.y ?? 0,
  };
}

/**
 * Returns the lines a tile writes: none on a parent, the name on a tile one line tall, and the line
 * under it on a tile two lines tall.
 *
 * @param tile - The tile as it renders.
 * @param line - The line under the name, empty for none.
 */
function wordsOf(tile: Resolved, line: string): Words {
  if (tile.fill === "transparent" || tile.height < INSET * 2 + LINE) return {};

  return line !== "" && tile.height >= INSET * 2 + LINE * 2
    ? { detail: line, name: tile.title }
    : { name: tile.title };
}

/**
 * Returns the elements of a tile's two lines, and after each layout that changes the tile's width
 * or words marks a line wider than the tile with `data-overflow`, and the line under the name when
 * the name is marked.
 *
 * @param width - The tile's width, in pixels.
 * @param words - The lines the tile writes.
 */
function useFitted(width: number, words: Words): Lines {
  const name = useRef<SVGTextElement>(null);
  const detail = useRef<SVGTextElement>(null);

  useSafeLayoutEffect(() => {
    /**
     * Returns whether a line fits across the tile, or no line is written.
     */
    const fits = (element: null | SVGTextElement): boolean =>
      element === null || element.getComputedTextLength() + INSET * 2 <= width;
    const named = fits(name.current);

    name.current?.toggleAttribute(OVERFLOW, !named);
    detail.current?.toggleAttribute(OVERFLOW, !named || !fits(detail.current));
  }, [width, words.name, words.detail]);

  return { detail, name };
}

/**
 * Renders the tile's rectangle, and its words where they fit, or nothing for recharts' root.
 *
 * @param props - The tile's geometry and row, and the chart's writer.
 */
export function Tile(props: TileProps): null | ReactElement {
  const tile = resolve(props);
  const words = wordsOf(tile, props.detail?.(tile.value) ?? "");
  const { detail, name } = useFitted(tile.width, words);
  const group = useRef<SVGGElement>(null);
  const { x, y } = tile;

  useOpened(group, props.walk !== undefined && props.walk === props.initial);

  if ((props.depth ?? 0) === 0) return null;

  return (
    <g className={TILE} data-walk={props.walk} opacity={tile.opacity} ref={group}>
      <Rectangle
        fill={tile.fill}
        height={tile.height}
        radius={RADIUS}
        width={tile.width}
        x={x}
        y={y}
      />
      {words.name === undefined ? null : (
        <Text className={SHARE} ref={name} verticalAnchor="start" x={x + INSET} y={y + INSET}>
          {words.name}
        </Text>
      )}
      {words.detail === undefined ? null : (
        <Text
          className={SHARE}
          ref={detail}
          verticalAnchor="start"
          x={x + INSET}
          y={y + INSET + LINE}
        >
          {words.detail}
        </Text>
      )}
    </g>
  );
}
