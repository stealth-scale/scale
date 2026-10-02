/**
 * Runs one command for the trust scripts and reports how it ended.
 *
 * @remarks
 *   Every call the scripts make to pnpm and npm goes through a {@link Runner}, so a specification
 *   passes a stand-in that replies offline.
 */

import { execFile, spawn } from "node:child_process";

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

/**
 * Runs a command found on the search path on this terminal, and resolves with its exit code once
 * it ends.
 *
 * @remarks
 *   A publish and a trust run here, because npm asks for a one-time password, or prints a browser
 *   login, only on a terminal. The command writes to the terminal directly, so the result reports
 *   both streams as empty.
 */
export const attended: Runner = (command, args, cwd) =>
  new Promise((settle) => {
    const child = spawn(command, [...args], { cwd, stdio: "inherit" });

    child.on("error", () => {
      settle({ code: -1, stderr: "", stdout: "" });
    });
    child.on("close", (code) => {
      settle({ code: code ?? -1, stderr: "", stdout: "" });
    });
  });
