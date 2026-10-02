/**
 * Turns a chord diagram's angles into pixels: the ring inside the plot's box, points on a circle,
 * the angles recharts' `Sector` takes, and the path of a ribbon.
 *
 * @remarks
 *   The names outside the ring take the larger of 48px and 32% of the plot's radius, and the ring
 *   is the larger of 8px and 6% of the radius thick. The ribbons end 2px inside the ring. A
 *   ribbon's path is d3-ribbon's: along its source's end, a
 *   curve through the centre to its target's end, along that end, and a curve back, so every
 *   ribbon narrows towards the centre.
 */

import { type ChordRibbon } from "#chord-diagram/layout.ts";

/**
 * Share of the plot's radius the names take outside the ring.
 */
const GUTTER = 0.32;

/**
 * Least room the names take outside the ring, in pixels.
 */
const LEAST_GUTTER = 48;

/**
 * Share of the plot's radius the ring is thick.
 */
const THICKNESS = 0.06;

/**
 * Least thickness of the ring, in pixels.
 */
const LEAST_THICKNESS = 8;

/**
 * Space between the ribbons' ends and the ring, in pixels.
 */
const GAP = 2;

/**
 * Describes a point of the plot, in pixels.
 */
export interface Point {
  /**
   * Distance from the plot's left edge.
   */
  readonly x: number;

  /**
   * Distance from the plot's top edge.
   */
  readonly y: number;
}

/**
 * Describes the plot's box as recharts reports it, in pixels.
 */
export interface Area extends Point {
  /**
   * Height of the box.
   */
  readonly height: number;

  /**
   * Width of the box.
   */
  readonly width: number;
}

/**
 * Describes the ring in pixels: its centre, its two radii and the radius the ribbons end at.
 */
export interface Ring {
  /**
   * Centre of the ring.
   */
  readonly centre: Point;

  /**
   * Radius the ribbons end at.
   */
  readonly ends: number;

  /**
   * Inner radius of the arcs.
   */
  readonly inner: number;

  /**
   * Outer radius of the arcs.
   */
  readonly outer: number;
}

/**
 * Returns the ring inside the plot's box: centred, with room for the names outside it.
 */
export function ringOf(area: Area): Ring {
  const radius = Math.min(area.width, area.height) / 2;
  const outer = Math.max(radius - Math.max(LEAST_GUTTER, radius * GUTTER), 0);
  const inner = Math.max(outer - Math.max(LEAST_THICKNESS, radius * THICKNESS), 0);

  return {
    centre: { x: area.x + area.width / 2, y: area.y + area.height / 2 },
    ends: Math.max(inner - GAP, 0),
    inner,
    outer,
  };
}

/**
 * Returns the point at an angle on a circle, from 12 o'clock, clockwise.
 *
 * @param angle - The angle, in radians.
 * @param radius - The circle's radius, in pixels.
 * @param centre - The circle's centre.
 */
export function pointOf(angle: number, radius: number, centre: Point): Point {
  return { x: centre.x + radius * Math.sin(angle), y: centre.y - radius * Math.cos(angle) };
}

/**
 * Returns the angle recharts' `Sector` takes for an angle from 12 o'clock, clockwise: degrees from
 * 3 o'clock, counter-clockwise.
 */
export function degreesOf(angle: number): number {
  return 90 - (angle * 180) / Math.PI;
}

/**
 * Returns the command that follows a circle clockwise from the point before it to an angle.
 *
 * @param angle - The angle the command ends at, in radians.
 * @param span - The angle the command turns through, in radians.
 * @param radius - The circle's radius, in pixels.
 * @param centre - The circle's centre.
 */
function arcTo(angle: number, span: number, radius: number, centre: Point): string {
  const to = pointOf(angle, radius, centre);

  return `A${String(radius)},${String(radius)} 0 ${span > Math.PI ? "1" : "0"} 1 ${String(to.x)},${String(to.y)}`;
}

/**
 * Returns a ribbon's path: along its source's end, through the centre to its target's end, along
 * that end and back through the centre, or a petal for a node's flow to itself.
 *
 * @param ribbon - The ribbon's two ends.
 * @param centre - The ring's centre.
 * @param radius - The radius the ribbon's ends are on, in pixels.
 */
export function ribbonPath(ribbon: ChordRibbon, centre: Point, radius: number): string {
  const { source, target } = ribbon;
  const start = pointOf(source.startAngle, radius, centre);
  const through = `Q${String(centre.x)},${String(centre.y)}`;
  const commands = [
    `M${String(start.x)},${String(start.y)}`,
    arcTo(source.endAngle, source.endAngle - source.startAngle, radius, centre),
  ];

  if (source.key !== target.key) {
    const far = pointOf(target.startAngle, radius, centre);

    commands.push(
      `${through} ${String(far.x)},${String(far.y)}`,
      arcTo(target.endAngle, target.endAngle - target.startAngle, radius, centre),
    );
  }

  commands.push(`${through} ${String(start.x)},${String(start.y)}`, "Z");

  return commands.join("");
}
