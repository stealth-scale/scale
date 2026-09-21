/**
 * Runs one command for the trust scripts and reports its exit code and both its streams.
 *
 * @remarks
 *   Every call the scripts make to pnpm and npm goes through this one function, so a specification
 *   passes a stand-in that answers offline.
 */

import { execFile } from "node:child_process";

/**
 * Describes how a command ended.
 */
export interface Ran {
  /**
   * Gives the exit code, or -1 where the command could not be started at all.
   */
  readonly code: number;

  /**
   * Gives the command's error stream, as text.
   */
  readonly stderr: string;

  /**
   * Gives the command's output stream, as text.
   */
  readonly stdout: string;
}

/**
 * Runs a command with its arguments from a directory, and resolves with how it ended.
 */
export type Runner = (command: string, args: readonly string[], cwd?: string) => Promise<Ran>;

/**
 * Runs a command found on the search path, and resolves rather than rejects when it fails or
 * cannot be started.
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
