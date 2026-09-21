/**
 * Re-exports the parts of the code block, which a caller composes as a `CodeBlock.Root` around a
 * header carrying a title and controls, and content carrying the code.
 */

export { Code, type CodeProps } from "#code-block/code.tsx";
export { Content, type ContentProps } from "#code-block/content.ts";
export { Control, type ControlProps } from "#code-block/control.ts";
export { Copy, type CopyProps } from "#code-block/copy.tsx";
export { Header, type HeaderProps } from "#code-block/header.ts";
export { type CodeBlockMode, Root, type RootProps } from "#code-block/root.tsx";
export { Title, type TitleProps } from "#code-block/title.ts";
