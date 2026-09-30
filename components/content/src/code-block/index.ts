/**
 * Publishes the code block's parts. Nest a header with a title and controls, then content with the
 * code or a diff, under `CodeBlock.Root`.
 */

export { type DiffCounts, type DiffKind } from "#code-block/changes.ts";
export { Code, type CodeProps } from "#code-block/code.tsx";
export { Content, type ContentProps } from "#code-block/content.ts";
export { Control, type ControlProps } from "#code-block/control.ts";
export { Copy, type CopyProps } from "#code-block/copy.tsx";
export { DiffStat, type DiffStatProps } from "#code-block/diff-stat.tsx";
export { type DiffWords } from "#code-block/diff-words.ts";
export { Diff, type DiffProps } from "#code-block/diff.tsx";
export { Header, type HeaderProps } from "#code-block/header.ts";
export { type CodeBlockMode, Root, type RootProps } from "#code-block/root.tsx";
export { Title, type TitleProps } from "#code-block/title.ts";
