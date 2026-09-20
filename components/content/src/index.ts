/**
 * Publishes a body of something for reading: a passage of code, and in time markdown, a diff, a
 * document, a record about a thing. Each component binds a recipe a theme can extend and draws
 * nothing of its own. The recipes reach an application's compiler through the preset under
 * `./theme`, and the components reach its bundle through here. A component with parts is
 * published as a namespace, `CodeBlock.Root`.
 *
 * @packageDocumentation
 */

export * as CodeBlock from "#code-block/index.ts";
