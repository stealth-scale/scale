/**
 * Publishes the primitives every other component package builds on: the portal, which decides
 * where content renders, and the scroll area, which scrolls a region with the theme's bars. An
 * application's compiler reads the scroll area's recipe from the preset under `./theme`.
 *
 * @packageDocumentation
 */

export * from "#portal/index.ts";
export * as ScrollArea from "#scroll-area/index.ts";
