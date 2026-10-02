/**
 * Groups a transcript into days, and each day into turns: the runs of messages one author sent
 * close together.
 *
 * @remarks
 *   A turn renders one avatar and one header over its messages, so two messages an hour apart
 *   start two turns: their header would otherwise date the second message wrongly. A new day always
 *   starts a new turn, because a divider between the messages of one turn would separate them from
 *   their avatar. A day starts at midnight in `timeZone`, or in the runtime's time zone, the
 *   reader's own calendar in a browser. A caller that formats its times in a zone passes that zone,
 *   so a day's label and its messages' times name one calendar.
 */

/**
 * Describes the fields of a message that the grouping reads.
 */
export interface TurnMessage {
  /**
   * Identifier of the person or the assistant that sent the message.
   */
  readonly author: string;

  /**
   * Identifier of the message, unique in the transcript.
   */
  readonly id: string;

  /**
   * Instant the message was sent: a `Date`, the milliseconds since the epoch, or a string `Date`
   * parses. A message without one, or with one `Date` cannot read, joins the turn and the day
   * before it.
   */
  readonly sentAt?: Date | number | string | undefined;
}

/**
 * Describes one turn: the messages one author sent in a row.
 *
 * @typeParam Message - The caller's message type.
 */
export interface Turn<Message extends TurnMessage> {
  /**
   * Identifier of the author every message of the turn shares.
   */
  readonly author: string;

  /**
   * The message that opens the turn, whose `id` keys the turn and whose `sentAt` its header shows.
   */
  readonly first: Message;

  /**
   * The latest message of the turn, whose status and actions its footer shows.
   */
  readonly last: Message;

  /**
   * Every message of the turn, oldest first, never empty.
   */
  readonly messages: readonly Message[];

  /**
   * Whether `author` is the reader, the `self` option.
   */
  readonly own: boolean;
}

/**
 * Describes one day of the transcript: the turns under one divider.
 *
 * @typeParam Message - The caller's message type.
 */
export interface TurnDay<Message extends TurnMessage> {
  /**
   * Midnight at the start of the day, the day's first instant where a daylight saving change skips
   * midnight, or undefined for messages without a readable `sentAt`.
   */
  readonly day: Date | undefined;

  /**
   * Identifier of the first message of the day, unique across the days.
   */
  readonly key: string;

  /**
   * The turns of the day, oldest first.
   */
  readonly turns: ReadonlyArray<Turn<Message>>;
}

/**
 * Describes the options of the grouping.
 */
export interface GroupTurnsOptions {
  /**
   * Identifier of the reader, whose turns are `own`.
   */
  readonly self?: string | undefined;

  /**
   * IANA time zone a day starts at midnight in, such as `UTC` or `Europe/Amsterdam`. The runtime's
   * zone unless stated.
   */
  readonly timeZone?: string | undefined;

  /**
   * Longest gap in milliseconds between two messages of one turn, 5 minutes unless stated.
   */
  readonly window?: number | undefined;
}

/**
 * Describes a turn while messages join it.
 */
interface Building<Message extends TurnMessage> {
  /**
   * Identifier of the turn's author.
   */
  readonly author: string;

  /**
   * The message that opens the turn.
   */
  readonly first: Message;

  /**
   * The latest message so far.
   */
  last: Message;

  /**
   * The messages so far.
   */
  readonly messages: Message[];

  /**
   * Whether the author is the reader.
   */
  readonly own: boolean;
}

/**
 * Describes a day while turns join it.
 */
interface Dated<Message extends TurnMessage> {
  /**
   * Midnight at the start of the day.
   */
  readonly day: Date | undefined;

  /**
   * Identifier of the day's first message.
   */
  readonly key: string;

  /**
   * The turns so far.
   */
  readonly turns: Array<Building<Message>>;
}

/**
 * Longest gap between two messages of one turn when the caller states none: 5 minutes.
 */
const WINDOW = 300_000;

/**
 * Returns the milliseconds since the epoch of an instant, or undefined for none or one `Date`
 * cannot read.
 */
function instantOf(sentAt: TurnMessage["sentAt"]): number | undefined {
  const time = sentAt === undefined ? Number.NaN : new Date(sentAt).getTime();

  return Number.isNaN(time) ? undefined : time;
}

/**
 * Types the fields of a wall-clock time the format writes, each as a number.
 */
type Fields = Readonly<Record<"day" | "hour" | "minute" | "month" | "second" | "year", number>>;

/**
 * Returns the wall-clock time an instant reads in a zone, as milliseconds of a UTC clock.
 */
function wallOf(time: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
    minute: "numeric",
    month: "numeric",
    second: "numeric",
    timeZone,
    year: "numeric",
  })
    .formatToParts(time)
    .map((part) => [part.type, Number(part.value)] as const);
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the format writes every field it is asked for
  const fields = Object.fromEntries(parts) as Fields;

  return Date.UTC(
    fields.year,
    fields.month - 1,
    fields.day,
    fields.hour,
    fields.minute,
    fields.second,
  );
}

/**
 * Returns the first instant of the instant's day in a zone: midnight, or the first instant after
 * it where a daylight saving change skips midnight.
 *
 * @remarks
 *   The first estimate applies the zone's offset at midnight read as UTC, and the second the offset
 *   at the first estimate. Where a change skips midnight, as in Havana in March, the second falls
 *   on the evening before, and the first is the day's start.
 */
function zonedMidnightOf(time: number, timeZone: string): number {
  const wall = wallOf(time, timeZone);
  const day = wall - (wall % 86_400_000);
  const early = day - (wallOf(day, timeZone) - day);
  const late = day - (wallOf(early, timeZone) - early);

  return wallOf(late, timeZone) >= day ? late : early;
}

/**
 * Returns midnight at the start of the instant's day, in the zone stated or the runtime's.
 */
function midnightOf(time: number, timeZone: string | undefined): number {
  if (timeZone !== undefined) return zonedMidnightOf(time, timeZone);

  const date = new Date(time);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Returns the last day while the message belongs to it, and otherwise opens a day for the message.
 *
 * @param days - The days so far, which a new day joins.
 * @param day - Midnight at the start of the message's day.
 * @param same - Whether the message's day is the last day's.
 * @param id - Identifier of the message, which keys a new day.
 * @returns The day the message joins.
 */
function dayFor<Message extends TurnMessage>(
  days: Array<Dated<Message>>,
  day: number | undefined,
  same: boolean,
  id: string,
): Dated<Message> {
  const last = days.at(-1);

  if (last !== undefined && same) return last;

  const opened: Dated<Message> = {
    day: day === undefined ? undefined : new Date(day),
    key: id,
    turns: [],
  };

  days.push(opened);

  return opened;
}

/**
 * Adds a message to the last turn of its day while the author and the gap allow, and otherwise
 * opens a turn with it.
 *
 * @param turns - The turns of the message's day.
 * @param message - The next message of the transcript.
 * @param near - Whether the gap since the message before is inside the window.
 * @param self - Identifier of the reader.
 */
function join<Message extends TurnMessage>(
  turns: Array<Building<Message>>,
  message: Message,
  near: boolean,
  self: string | undefined,
): void {
  const turn = turns.at(-1);

  if (turn?.author === message.author && near) {
    turn.messages.push(message);
    turn.last = message;

    return;
  }

  turns.push({
    author: message.author,
    first: message,
    last: message,
    messages: [message],
    own: message.author === self,
  });
}

/**
 * Groups messages into days and turns.
 *
 * @typeParam Message - The caller's message type, which each turn returns as it was given.
 * @param messages - The transcript, oldest first.
 * @param options - The reader's identifier, the zone a day starts in and the longest gap inside
 *   one turn.
 * @returns The days in order, each with its turns in order.
 */
export function groupTurns<Message extends TurnMessage>(
  messages: readonly Message[],
  options: GroupTurnsOptions = {},
): ReadonlyArray<TurnDay<Message>> {
  const { self, timeZone, window = WINDOW } = options;
  const days: Array<Dated<Message>> = [];
  let midnight: number | undefined;
  let previous: number | undefined;

  for (const message of messages) {
    const time = instantOf(message.sentAt);
    const day = time === undefined ? midnight : midnightOf(time, timeZone);
    const near = previous === undefined || time === undefined || time - previous <= window;

    join(dayFor(days, day, day === midnight, message.id).turns, message, near, self);
    midnight = day;
    previous = time ?? previous;
  }

  return days;
}
