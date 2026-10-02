/**
 * Builds the response bodies the event reader's and the gateway's specifications read.
 */

/**
 * Builds a response body that sends each chunk in turn, then ends.
 *
 * @param chunks - The text of each chunk.
 * @returns The body.
 */
export function streamOf(...chunks: readonly string[]): ReadableStream<Uint8Array<ArrayBuffer>> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));

      controller.close();
    },
  });
}
