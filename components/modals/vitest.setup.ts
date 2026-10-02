/**
 * Declares the window's visual viewport as absent in the DOM the specifications run in, which
 * leaves the global undeclared.
 *
 * @remarks
 *   The tour machine reads `visualViewport` as a global when it measures the page, and reads the
 *   window's own size where the value is null. A browser declares the global. An undeclared global
 *   throws on the read, so every specification that starts a tour would fail without this.
 */

globalThis.visualViewport ??= null;
