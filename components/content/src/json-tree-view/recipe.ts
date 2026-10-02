/**
 * Defines the recipe that renders a JSON value as a tree of keys and values in the code text style,
 * over the rows of the tree view.
 *
 * @remarks
 *   The root and the tree are the tree view's own elements, so the recipe selects the tree view's
 *   parts by the classes that recipe writes. The utilities mark a value's spans with `data-type`
 *   and its punctuation with `data-kind`, and each kind reads an ink of the theme's `code` family,
 *   which the theme raises to the text ratio on `bg` and `bg.panel`. The selector of a stack line
 *   matches its type and its kind, and the selector of a non-enumerable key matches its kind and
 *   its flag, so each applies over the string ink or the key ink. An open branch hides its preview
 *   and the preview's last brace, and the group after it renders that brace on a row of its own, at
 *   the start of the branch's text. A leaf's value wraps at any character, so a long string or a
 *   stack is read in full. A branch's preview stays on one line. The tree view offers the palette
 *   and the effect.
 */

import {
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers, the steps of the code text style.
 */
const SIZES = ["sm", "md"] as const;

/**
 * Class name of the tree view recipe, whose parts the recipe selects.
 */
export const TREE_VIEW = "tree-view";

/**
 * Selects a branch's row while the branch is open.
 */
const OPEN = `& .${TREE_VIEW}__branchControl[data-state=open]`;

/**
 * Selects the group after a branch's row, which renders the closing brace.
 */
const GROUP = `.${TREE_VIEW}__branchContent::after`;

/**
 * Inset of a branch's text: the tree view's row inset, plus one mark and one gap per level of the
 * `--depth` the machine writes on the branch.
 */
const TEXT_START =
  "calc(var(--tree-view-inset) + var(--depth) * (var(--tree-view-mark) + var(--tree-view-gap)))";

/**
 * Height of a row per size, which is the tree view's row height at the same size.
 */
const ROWS = { md: "control.xs", sm: "tag.md" };

/**
 * Styles the closing brace an open branch's group renders after its rows.
 *
 * @remarks
 *   The brace's alternative text is empty, so a screen reader reading the page skips it.
 */
const CLOSER = {
  alignItems: "center",
  color: "fg",
  display: "flex",
  paddingInlineStart: TEXT_START,
};

/**
 * Selects every span of a selected row.
 *
 * @remarks
 *   Under forced colors the tree view fills a selected row with `Highlight` and opts the row out of
 *   the forced colors, which its spans inherit, so each span restates the row's `HighlightText`.
 */
const SELECTED =
  "& [role=treeitem][aria-selected=true] [data-kind], & [role=treeitem][aria-selected=true] [data-type]";

/**
 * Maps each kind of span to its ink.
 */
const INKS: SystemStyleObject = {
  "& [data-kind=brace]": { color: "fg" },
  "& [data-kind=colon], & [data-kind=operator], & [data-kind=preview-text]": { color: "fg.muted" },
  "& [data-kind=constructor]": { color: "code.type" },
  "& [data-kind=function-type]": { color: "code.keyword" },
  "& [data-kind=key]": { color: "code.attr" },
  "& [data-kind=key][data-non-enumerable]": { color: "code.comment" },
  "& [data-type][data-kind=error-stack]": { color: "code.comment", display: "block" },
  "& [data-type=bigint], & [data-type=date], & [data-type=number]": { color: "code.number" },
  "& [data-type=boolean], & [data-type=null], & [data-type=symbol], & [data-type=undefined]": {
    color: "code.keyword",
  },
  "& [data-type=error]": { color: "fg.error" },
  "& [data-type=function]": { color: "code.function" },
  "& [data-type=regex], & [data-type=string]": { color: "code.string" },
};

/**
 * Defines the JSON tree view recipe at size `sm` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    /**
     * The inks, the open branch's brace, the leaf's wrapping and the link's underline, each over
     * the tree view's parts.
     */
    root: {
      ...INKS,
      [`& .${TREE_VIEW}__branchControl[data-close="]"] + ${GROUP}`]: {
        ...CLOSER,
        content: '"]" / ""',
      },
      [`& .${TREE_VIEW}__branchControl[data-close="}"] + ${GROUP}`]: {
        ...CLOSER,
        content: '"}" / ""',
      },
      [`& .${TREE_VIEW}__itemText`]: {
        overflow: "visible",
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      },
      [`& a.${TREE_VIEW}__item [data-kind=preview]`]: {
        color: "fg.link",
        textDecoration: "underline",
        textUnderlineOffset: "normal",
      },
      [`${OPEN} [data-kind=preview-text]`]: { display: "none" },
      [`${OPEN} > .${TREE_VIEW}__branchText > [data-kind=preview] > [data-kind=brace]:last-child`]:
        {
          display: "none",
        },
      [SELECTED]: { _highContrast: { color: "HighlightText" } },
    },
    tree: {},
  },
  className: "json-tree-view",
  defaultVariants: { size: "sm" },
  jsx: [/^JsonTreeView(\.\w+)?$/u],
  slots: ["root", "tree"],
  variants: {
    /**
     * Code text style of the tree, and the height of the closing brace's row.
     *
     * @remarks
     *   The root passes the size on to the tree view. The tree view's rows measure 24 and 32px at
     *   `sm` and `md`, and so does the brace's row.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({ [`& ${GROUP}`]: { minBlockSize: dense(`{sizes.${ROWS[size]}}`) } }),
        SIZES,
      ),
      tree: sizeVariants((size) => ({ textStyle: `code.${size}` }), SIZES),
    }),
  },
});
