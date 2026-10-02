/**
 * Tracks the session a flag source evaluates for, and the variants of experiments the session's
 * subject was served.
 */

import { type FlagSource, type ResolvedFlag, type Session } from "@stealthscale/sdk-core";
import { type HostReport } from "@stealthscale/sdk-plugin";

/**
 * Describes the variants of experiments the session's subject was served.
 */
export interface Exposures {
  /**
   * Queues `flag-exposed` the first time the subject is served a variant of an experiment.
   */
  readonly expose: (flag: ResolvedFlag, value: boolean | string) => void;

  /**
   * Forgets every variant served, where the subject is another than the last one.
   */
  readonly reset: (subject: string | undefined) => void;

  /**
   * Records a variant a server render reported as served, where the render's subject is the
   * session's, so the variant is not reported again.
   */
  readonly serve: (
    subject: string | undefined,
    flag: ResolvedFlag,
    value: boolean | string,
  ) => void;
}

/**
 * Describes whom the flag source evaluates for.
 */
export interface Identity {
  /**
   * Tells the source whom the next evaluations are for. Resolves with true once the source
   * identified the session, and with false where `identify` rejected or a later call overtook it.
   */
  readonly identify: (session: Session) => Promise<boolean>;

  /**
   * Ignores an identification in flight.
   */
  readonly stop: () => void;

  /**
   * Returns the source while it evaluates for the session it identified last, else undefined.
   */
  readonly trusted: () => FlagSource | undefined;
}

/**
 * Returns the record of the variants served, for no subject yet.
 *
 * @param queue - Receives `flag-exposed` for each variant the subject is served first.
 */
export function exposuresOf(queue: (entry: HostReport) => void): Exposures {
  const served = new Set<string>();
  let current: string | undefined;

  return {
    expose: (flag, value) => {
      if (typeof value !== "string") return;

      const key = JSON.stringify([flag.id, value]);

      if (served.has(key)) return;

      served.add(key);
      queue({ flag: flag.id, kind: "flag-exposed", variant: value });
    },
    reset: (subject) => {
      if (subject === current) return;

      current = subject;
      served.clear();
    },
    serve: (subject, flag, value) => {
      if (subject === current) served.add(JSON.stringify([flag.id, value]));
    },
  };
}

/**
 * Returns whom the flag source evaluates for: every session for a source without `identify`, and no
 * session until the first `identify` resolves for a source with it.
 *
 * @param source - The product's flag source.
 * @param failed - Receives the error of an `identify` that rejected and was not overtaken.
 */
export function identityOf(
  source: FlagSource | undefined,
  failed: (error: unknown) => void,
): Identity {
  let identified = source?.identify === undefined;
  let generation = 0;

  return {
    identify: async (session) => {
      if (source?.identify === undefined) return true;

      generation += 1;
      identified = false;

      const started = generation;

      try {
        await source.identify(session);
      } catch (error) {
        if (started === generation) failed(error);

        return false;
      }

      if (started !== generation) return false;

      identified = true;

      return true;
    },
    stop: () => {
      generation += 1;
    },
    trusted: () => (identified ? source : undefined),
  };
}
