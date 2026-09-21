/**
 * Runs one command and hands back what it wrote and how it ended, for the trust scripts.
 *
 * @remarks
 *   The scripts talk to the registry through pnpm and npm, and every call goes through this one
 *   function so a specification hands in a stand-in that answers offline.
 */

import { execFile } from "node:child_process";

/**
 * Describes how a command ended.
 */
export interface Ran {
  /**
   * The exit code, or -1 where the command could not be started.
   */
  readonly code: number;

  /**
   * The command's error stream, as text.
   */
  readonly stderr: string;

  /**
   * The command's output stream, as text.
   */
  readonly stdout: string;
}

/**
 * Runs a command, given its arguments, from a directory.
 */
export type Runner = (command: string, args: readonly string[], cwd?: string) => Promise<Ran>;

/**
 * Runs a command through the shell's search path and never rejects: a command that fails, or
 * cannot be started, answers with its code and its streams.
 */
export const run: Runner = (command, args, cwd) =>
  new Promise((settle) => {
    execFile(
      command,
      [...args],
      { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      (error, stdout, stderr) => {
        const code = error === null ? 0 : typeof error.code === "number" ? error.code : -1;

        settle({ code, stderr, stdout });
      },
    );
  });
