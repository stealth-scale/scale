import { describe, expect, it, vi } from "vitest";

import { groupTurns, type TurnMessage } from "#turns/group-turns.ts";

/**
 * Builds a message from an author, an identifier and an instant in UTC.
 */
function said(author: string, id: string, sentAt?: string): TurnMessage {
  return sentAt === undefined ? { author, id } : { author, id, sentAt };
}

/**
 * Returns the identifiers of each turn's messages, day by day.
 */
function shape(messages: readonly TurnMessage[], window?: number): string[][][] {
  return groupTurns(messages, { window }).map((day) =>
    day.turns.map((turn) => turn.messages.map((message) => message.id)),
  );
}

describe("groupTurns", () => {
  it("returns no day for no messages", () => {
    expect(groupTurns([])).toStrictEqual([]);
  });

  it("joins consecutive messages of one author into one turn", () => {
    expect(
      shape([said("ada", "1", "2026-09-30T09:00:00Z"), said("ada", "2", "2026-09-30T09:01:00Z")]),
    ).toStrictEqual([[["1", "2"]]]);
  });

  it("starts a turn when the author changes", () => {
    expect(
      shape([said("ada", "1", "2026-09-30T09:00:00Z"), said("ben", "2", "2026-09-30T09:00:30Z")]),
    ).toStrictEqual([[["1"], ["2"]]]);
  });

  it("keeps a message sent 5 minutes after the one before it in the turn", () => {
    expect(
      shape([said("ada", "1", "2026-09-30T09:00:00Z"), said("ada", "2", "2026-09-30T09:05:00Z")]),
    ).toStrictEqual([[["1", "2"]]]);
  });

  it("starts a turn when more than 5 minutes pass between two messages", () => {
    expect(
      shape([
        said("ada", "1", "2026-09-30T09:00:00Z"),
        said("ada", "2", "2026-09-30T09:05:00.001Z"),
      ]),
    ).toStrictEqual([[["1"], ["2"]]]);
  });

  it("measures the gap from the message before rather than the turn's first", () => {
    expect(
      shape([
        said("ada", "1", "2026-09-30T09:00:00Z"),
        said("ada", "2", "2026-09-30T09:04:00Z"),
        said("ada", "3", "2026-09-30T09:08:00Z"),
      ]),
    ).toStrictEqual([[["1", "2", "3"]]]);
  });

  it("takes the longest gap from window", () => {
    expect(
      shape(
        [said("ada", "1", "2026-09-30T09:00:00Z"), said("ada", "2", "2026-09-30T09:01:00Z")],
        30_000,
      ),
    ).toStrictEqual([[["1"], ["2"]]]);
  });

  it("starts a day and a turn at midnight in the runtime's time zone", () => {
    vi.stubEnv("TZ", "UTC");

    expect(
      shape([said("ada", "1", "2026-09-30T23:59:00Z"), said("ada", "2", "2026-10-01T00:01:00Z")]),
    ).toStrictEqual([[["1"]], [["2"]]]);
  });

  it("returns midnight at the start of each day as day", () => {
    vi.stubEnv("TZ", "Europe/Amsterdam");

    const [day] = groupTurns([said("ada", "1", "2026-09-30T23:30:00Z")]);

    expect(day?.day?.toISOString()).toBe("2026-09-30T22:00:00.000Z");
  });

  it("starts a day at midnight in timeZone rather than the runtime's", () => {
    vi.stubEnv("TZ", "Europe/Amsterdam");

    expect(
      groupTurns(
        [said("ada", "1", "2026-09-29T22:30:00Z"), said("ben", "2", "2026-09-30T00:30:00Z")],
        { timeZone: "UTC" },
      ).map((day) => day.day?.toISOString()),
    ).toStrictEqual(["2026-09-29T00:00:00.000Z", "2026-09-30T00:00:00.000Z"]);
  });

  it("returns midnight in a zone behind UTC as day", () => {
    const [day] = groupTurns([said("ada", "1", "2026-09-30T00:30:00Z")], {
      timeZone: "America/New_York",
    });

    expect(day?.day?.toISOString()).toBe("2026-09-29T04:00:00.000Z");
  });

  it("returns the midnight a daylight saving change moves as day", () => {
    const [day] = groupTurns([said("ada", "1", "2026-03-29T12:00:00Z")], {
      timeZone: "Europe/Amsterdam",
    });

    expect(day?.day?.toISOString()).toBe("2026-03-28T23:00:00.000Z");
  });

  it("returns the first instant after a skipped midnight as day", () => {
    const [day] = groupTurns([said("ada", "1", "2026-03-08T17:00:00Z")], {
      timeZone: "America/Havana",
    });

    expect(day?.day?.toISOString()).toBe("2026-03-08T05:00:00.000Z");
  });

  it("keeps a message without an instant in the day and the turn before it", () => {
    expect(shape([said("ada", "1", "2026-09-30T09:00:00Z"), said("ada", "2")])).toStrictEqual([
      [["1", "2"]],
    ]);
  });

  it("measures the gap after an undated message from the latest dated one", () => {
    expect(
      shape([
        said("ada", "1", "2026-09-30T09:00:00Z"),
        said("ada", "2"),
        said("ada", "3", "2026-09-30T09:30:00Z"),
      ]),
    ).toStrictEqual([[["1", "2"], ["3"]]]);
  });

  it("returns an undated day for messages before the first instant", () => {
    const days = groupTurns([said("ada", "1"), said("ada", "2", "2026-09-30T09:00:00Z")]);

    expect(days.map((day) => day.day === undefined)).toStrictEqual([true, false]);
  });

  it("reads an instant that Date cannot parse as none", () => {
    expect(
      shape([said("ada", "1", "2026-09-30T09:00:00Z"), said("ada", "2", "yesterday")]),
    ).toStrictEqual([[["1", "2"]]]);
  });

  it("reads an instant given as a Date or as milliseconds", () => {
    const at = Date.UTC(2026, 8, 30, 9);

    expect(
      groupTurns([
        { author: "ada", id: "1", sentAt: new Date(at) },
        { author: "ada", id: "2", sentAt: at + 60_000 },
      ]).map((day) => day.turns.length),
    ).toStrictEqual([1]);
  });

  it("keys each day by its first message", () => {
    vi.stubEnv("TZ", "UTC");

    expect(
      groupTurns([
        said("ada", "1", "2026-09-30T09:00:00Z"),
        said("ben", "2", "2026-09-30T09:01:00Z"),
        said("ada", "3", "2026-10-01T09:00:00Z"),
      ]).map((day) => day.key),
    ).toStrictEqual(["1", "3"]);
  });

  it("returns the first and the last message of a turn", () => {
    const messages = [
      said("ada", "1", "2026-09-30T09:00:00Z"),
      said("ada", "2", "2026-09-30T09:01:00Z"),
      said("ada", "3", "2026-09-30T09:02:00Z"),
    ];
    const turn = groupTurns(messages)[0]?.turns[0];

    expect([turn?.first.id, turn?.last.id, turn?.author]).toStrictEqual(["1", "3", "ada"]);
  });

  it("marks the turns of self as own", () => {
    const turns = groupTurns(
      [said("ada", "1", "2026-09-30T09:00:00Z"), said("me", "2", "2026-09-30T09:01:00Z")],
      { self: "me" },
    )[0]?.turns;

    expect(turns?.map((turn) => turn.own)).toStrictEqual([false, true]);
  });

  it("marks no turn as own without self", () => {
    const turns = groupTurns([said("me", "1", "2026-09-30T09:00:00Z")])[0]?.turns;

    expect(turns?.map((turn) => turn.own)).toStrictEqual([false]);
  });

  it("returns each message as the caller passed it", () => {
    const message = { author: "ada", id: "1", text: "Hello" };

    expect(groupTurns([message])[0]?.turns[0]?.first).toBe(message);
  });
});
