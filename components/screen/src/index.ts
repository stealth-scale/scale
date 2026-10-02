/**
 * Publishes what lays an application out on whatever screen it is opened on: the shell, the page,
 * the toolbar, the sidebar and the action bar, each folding on its own as the screen narrows, the
 * splitter, whose panels a person resizes, and the floating panel, a window a person moves and
 * resizes over the page. Each component binds a recipe a theme can extend and renders no style of
 * its own. The recipes reach an application's compiler through the preset under `./theme`, and the
 * components reach its bundle through here.
 *
 * @packageDocumentation
 */

export * as ActionBar from "#action-bar/index.ts";
export * as AppShell from "#app-shell/index.ts";
export * as FloatingPanel from "#floating-panel/index.ts";
export * as Page from "#page/index.ts";
export * as Section from "#section/index.ts";
export * as Sidebar from "#sidebar/index.ts";
export * as Splitter from "#splitter/index.ts";
export * as Switcher from "#switcher/index.ts";
export * as Toolbar from "#toolbar/index.ts";
