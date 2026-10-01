/**
 * Reads the events of a server-sent event stream.
 */

/**
 * Describes one event of a stream.
 */
export interface StreamEvent {
  /**
   * The event's data: its data lines, joined by line feeds.
   */
  readonly data: string;

  /**
   * The event's name, `message` where the stream states none.
   */
  readonly event: string;
}

/**
 * Describes the event a reader builds from the lines it has read since the last blank line.
 */
interface Building {
  /**
   * The data lines read so far.
   */
  data: string[];

  /**
   * The name the stream stated, or an empty string.
   */
  event: string;
}

/**
 * Reads one line of the stream into the event being built.
 *
 * @remarks
 *   A line that opens with a colon is a comment. A field's value drops the one space after the
 *   colon. The reader keeps the `event` and `data` fields and ignores `id` and `retry`, which only
 *   a reconnecting `EventSource` reads.
 * @param line - The line, without its line ending.
 * @param building - The event being built, which the line changes.
 */
function read(line: string, building: Building): void {
  if (line.startsWith(":")) return;

  const colon = line.indexOf(":");
  const field = colon === -1 ? line : line.slice(0, colon);
  const raw = colon === -1 ? "" : line.slice(colon + 1);
  const value = raw.startsWith(" ") ? raw.slice(1) : raw;

  if (field === "event") building.event = value;
  else if (field === "data") building.data.push(value);
}

/**
 * Returns the event a blank line dispatches, and resets the event being built.
 *
 * @param building - The event built since the last blank line.
 * @returns The event, or nothing where no data line was read.
 */
function dispatched(building: Building): StreamEvent | undefined {
  const { data, event } = building;

  building.data = [];
  building.event = "";

  if (data.length === 0) return undefined;

  return { data: data.join("\n"), event: event === "" ? "message" : event };
}

/**
 * Reads complete lines into the event being built, and returns each event a blank line dispatches.
 *
 * @param lines - The lines, without their line feeds.
 * @param building - The event being built, which the lines change.
 * @returns The dispatched events, in order.
 */
function* dispatchedIn(lines: readonly string[], building: Building): Generator<StreamEvent> {
  for (const line of lines) {
    const bare = line.endsWith("\r") ? line.slice(0, -1) : line;

    if (bare === "") {
      const event = dispatched(building);

      if (event !== undefined) yield event;
    } else {
      read(bare, building);
    }
  }
}

/**
 * Reads the events of a server-sent event stream, one at a time, until the stream ends.
 *
 * @remarks
 *   Lines end with a line feed, and a carriage return before it is dropped. A stream that ends
 *   lines with a carriage return alone is not read, because the gateway writes line feeds. An
 *   event the stream did not finish with a blank line is not dispatched.
 * @param body - The response body.
 * @returns The events, in the order the stream sent them.
 */
export async function* eventsOf(
  body: ReadableStream<Uint8Array<ArrayBuffer>>,
): AsyncGenerator<StreamEvent> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  const building: Building = { data: [], event: "" };
  let pending = "";

  try {
    for (;;) {
      // eslint-disable-next-line no-await-in-loop -- a stream's chunks arrive in order, so each read waits for the one before it
      const { done, value } = await reader.read();

      if (done) return;

      const text = pending + value;
      const end = text.lastIndexOf("\n");

      pending = text.slice(end + 1);

      yield* dispatchedIn(end === -1 ? [] : text.slice(0, end).split("\n"), building);
    }
  } finally {
    await reader.cancel();
  }
}
