/**
 * Lists the nine published themes drawn from four colors stated outright, in the order the page
 * offers them after Ink.
 *
 * @remarks
 *   Kept apart from `published-themes.ts` because the house caps a file's dependencies at ten.
 */

import { admiral } from "@stealthscale/theme-admiral";
import { blush } from "@stealthscale/theme-blush";
import { carnival } from "@stealthscale/theme-carnival";
import { cinder } from "@stealthscale/theme-cinder";
import { dusk } from "@stealthscale/theme-dusk";
import { harbour } from "@stealthscale/theme-harbour";
import { neon } from "@stealthscale/theme-neon";
import { pine } from "@stealthscale/theme-pine";
import { regatta } from "@stealthscale/theme-regatta";

/**
 * The nine palette themes, from the quietest to the loudest.
 */
export const paletteThemes = [
  cinder,
  harbour,
  admiral,
  regatta,
  pine,
  carnival,
  dusk,
  neon,
  blush,
] as const;
