/**
 * Provides the role the track takes: the progress bar's, or the meter's inside `Meter.Root`.
 *
 * @remarks
 *   A progress bar reports work under way and a meter reports a measurement, and a screen reader
 *   names the two apart. They share every part, so the root states the role and the track reads it.
 */

import { createContext } from "react";

/**
 * Describes the role the track takes.
 */
export type TrackRole = "meter" | "progressbar";

/**
 * Context with the track's role: `meter` inside `Meter.Root`, and `progressbar` elsewhere.
 */
export const RoleContext = createContext<TrackRole>("progressbar");
