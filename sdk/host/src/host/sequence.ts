/**
 * Runs the host's side of a change of session: the `host/sessionChanged` event, the reset of the
 * previous subject's data and decisions, and the flag source's identification.
 */

import { type QueryClient, resetData } from "@stealthscale/provider-data";
import { HOST, hostContract, type Session, subjectOf } from "@stealthscale/sdk-core";
import { type EventBus, type SessionState, type Store } from "@stealthscale/sdk-plugin";

import { type HostAccessStore } from "#stores/access.ts";
import { type HostFlagStore } from "#stores/flags.ts";

/**
 * Lists what the sequence reads and changes.
 */
export interface SequenceOptions {
  /**
   * The access store, cleared on a change of subject.
   */
  readonly access: Pick<HostAccessStore, "clear">;

  /**
   * The data client, reset on a change of subject.
   */
  readonly data: QueryClient;

  /**
   * The bus `host/sessionChanged` is emitted on.
   */
  readonly events: EventBus;

  /**
   * The flag store, which identifies each session to the flag source.
   */
  readonly flags: Pick<HostFlagStore, "identify">;

  /**
   * The session store the sequence follows.
   */
  readonly session: Store<SessionState>;
}

/**
 * Describes a sequence that follows the session.
 */
export interface Sequence {
  /**
   * Resolves once the flag source identified the session the host started with.
   */
  readonly identified: Promise<void>;

  /**
   * Stops following the session.
   */
  readonly stop: () => void;
}

/**
 * Emits the session as the sticky `host/sessionChanged` now and after every change, and identifies
 * each session to the flag source.
 *
 * @remarks
 *   The switch and placement stores move to a new subject's keys before the event, because they
 *   subscribed to the session first. A change of subject then resets the data client and clears
 *   the access store, so a subject renders no data and no decision of the subject before it. The
 *   flags keep their values while the flag source identifies the new session.
 */
export function followSession({ access, data, events, flags, session }: SequenceOptions): Sequence {
  let subject = subjectOf(session.get().session);

  /**
   * Emits the session as the host.
   */
  const announce = (current: Session): void => {
    events.emit(HOST, hostContract.events.sessionChanged.id, current);
  };

  announce(session.get().session);

  const identified = flags.identify(session.get().session);
  const stop = session.subscribe(() => {
    const current = session.get().session;
    const next = subjectOf(current);

    announce(current);

    if (next !== subject) {
      subject = next;
      void resetData(data);
      access.clear();
    }

    void flags.identify(current);
  });

  return { identified, stop };
}
