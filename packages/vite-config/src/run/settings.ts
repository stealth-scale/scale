/**
 * Describes the shapes the task-runner block of a Vite configuration accepts.
 */

import { type UserConfig } from "vite";

/**
 * The cache, the task table and the script lifecycle a workspace root declares
 * for the runner.
 */
export type Running = NonNullable<UserConfig["run"]>;

/**
 * One task, written as its command alone or as a record naming that command
 * with its cache.
 *
 * @remarks
 *   The files and variables a fingerprint reads are declared under `cache`, so a
 *   task declared uncached has nowhere to name them. A task that names none is
 *   cached on the files the runner sees it read and write.
 */
export type Doing = NonNullable<Running["tasks"]>[string];
