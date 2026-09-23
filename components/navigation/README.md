# @stealthscale/component-navigation

React components for moving between pages and between sections of a page: `Link`, `Breadcrumb`,
`NavList` and `Toc`. Each component renders through a recipe, so a theme restyles it by extending
the recipe. The preset under `./theme` registers the recipes with an application's compiler.

Every value a theme can change is a recipe axis, and a caller sets it as a prop. A caller changes
the rendered element with `as`.

## Install

```bash
pnpm add @stealthscale/component-navigation
```

The package peers on `react` and `@stealthscale/theme`. Add the preset under `./theme` to the
presets the application's compiler installs.

## Link

Renders an anchor in the theme's link ink. `fg.link`, the visited ink, the cursor and the focus ring
come from the theme's `link()` fragment, so a theme sets them once for every link.

```tsx
import { Link } from "@stealthscale/component-navigation";

<Link href="/invoices">Invoices</Link>;
<Link href="/terms" variant="plain">
  Terms
</Link>;
<Link as={RouterLink} to="/invoices">
  Invoices
</Link>;
```

| Axis      | Values                                                             | Default     |
| --------- | ------------------------------------------------------------------ | ----------- |
| `variant` | `plain`, `underline`                                               | `underline` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `fg.link`   |
| `inherit` | `true`                                                             | off         |

Both looks underline on hover, and `underline` also underlines at rest. Keep the default for a link
in running text. Without an underline the link differs from the text only by ink, and the link ink
measured 1.64:1 against body text on the ink theme. Use `plain` where the context marks the link: a
card title, a navigation row, a brand name.

`palette` sets the ink from the palette's `fg` role and the focus ring from its `focusRing` role.
Without a palette the link reads `fg.link`. The recipe lists every palette in `staticCss`, so a
value set through `LinkPropsProvider` has a rule.

`inherit` makes the link take the text color of its parent, visited state included. The hover
underline and the focus ring still apply. A `palette` on the same link takes precedence.

The element is `a` and needs an `href`. A browser gives an anchor without an `href` no focus and no
Enter key, so use a button for a control that runs an action. Pass a router's link component through
`as` to keep its routing and take the recipe's classes.

## Breadcrumb

Renders an ordered list of links from the site root to the current page. Compose it as
`Breadcrumb.Root` around a `Breadcrumb.List` of items.

```tsx
import { Breadcrumb } from "@stealthscale/component-navigation";

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/invoices">Invoices</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.CurrentLink>April</Breadcrumb.CurrentLink>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>;
```

| Axis      | Values                       | Default |
| --------- | ---------------------------- | ------- |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl` | `md`    |
| `variant` | `plain`, `underline`         | `plain` |

| Part          | Element | What it renders                                    |
| ------------- | ------- | -------------------------------------------------- |
| `Root`        | `nav`   | The landmark, which receives the variants          |
| `List`        | `ol`    | The crumbs in order, with `role="list"`            |
| `Item`        | `li`    | One crumb                                          |
| `Link`        | `a`     | The link of a crumb above the current page         |
| `CurrentLink` | `span`  | The current page, with `aria-current="page"`       |
| `Separator`   | `li`    | The `aria-hidden` mark between two crumbs          |
| `Ellipsis`    | `li`    | The labelled row that replaces the crumbs left out |

`size` sets the body text style on the root and the gap on the list, and every part inherits the
text size. The links are muted and darken on hover. The current page renders in the default ink. The
recipe has no `palette` axis, because a trail has no color of its own.

The root's `aria-label` defaults to `Breadcrumb`, because a page with a site navigation and a
breadcrumb has two navigation landmarks. Pass a translated label through `aria-label`.

The list sets `role="list"`, because Safari drops the list role from a list with `list-style: none`.
The separator is a list row between two items, with `aria-hidden` and `role="presentation"`, so a
screen reader counts only the crumbs. The recipe rotates the separator by 180 degrees in a
right-to-left document.

For a long trail, keep the first crumb and the current page and render `Breadcrumb.Ellipsis` in
place of the crumbs between them. Give it an `aria-label` with the number of crumbs it replaces,
such as `4 more steps`, so a screen reader announces the full depth.

## NavList

Renders a list of links a page is reached from: rows in a column, and branches that expand a nested
list.

```tsx
import { NavList } from "@stealthscale/component-navigation";

<nav aria-label="Main">
  <NavList.Root iconic={collapsed} palette="primary">
    <NavList.Item>
      <NavList.Link aria-current="page" href="/">
        Overview
      </NavList.Link>
      <NavList.Badge>3</NavList.Badge>
    </NavList.Item>
    <NavList.Branch defaultOpen>
      <NavList.Trigger>
        Settings
        <NavList.Indicator>
          <ChevronIcon />
        </NavList.Indicator>
      </NavList.Trigger>
      <NavList.Content>
        <NavList.Item>
          <NavList.Link href="/settings/team">Team</NavList.Link>
        </NavList.Item>
      </NavList.Content>
    </NavList.Branch>
  </NavList.Root>
</nav>;
```

| Axis        | Values                                                             | Default   |
| ----------- | ------------------------------------------------------------------ | --------- |
| `size`      | `sm`, `md`, `lg`                                                   | `md`      |
| `variant`   | `list`, `dock`                                                     | `list`    |
| `highlight` | `tint`, `fill`, `bar`                                              | `tint`    |
| `palette`   | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | inherited |
| `radius`    | `l1`, `l2`, `l3`, `full`                                           | `l2`      |
| `guide`     | `solid`, `dashed`, `dotted`, `none`                                | `solid`   |
| `iconic`    | `true`                                                             | off       |
| `reveal`    | `always`, `hover`                                                  | `always`  |
| `effect`    | `glow`                                                             | none      |

| Part        | Element  | What it renders                         |
| ----------- | -------- | --------------------------------------- |
| `Root`      | `ul`     | The list, which receives the variants   |
| `Item`      | `li`     | One row                                 |
| `Link`      | `a`      | A row's link                            |
| `Action`    | `button` | A control at the end of a row           |
| `Badge`     | `span`   | A count at the end of a row             |
| `Branch`    | `li`     | A row that expands, and its state       |
| `Trigger`   | `button` | The row that expands and collapses      |
| `Indicator` | `span`   | The icon that rotates as a branch opens |
| `Content`   | `ul`     | The nested list of a branch             |
| `Skeleton`  | `li`     | A placeholder row while the list loads  |

Set `aria-current="page"` on the link to the current page. A screen reader announces the attribute
and `highlight` styles it, so the two cannot disagree.

The list does not set a landmark, because a page renders more than one list. Render a `nav` with an
`aria-label` around the list. Do not pass `as="nav"` to the root: the rows are `li` elements, and a
`nav` holding them directly is not read as a list.

`palette` sets the palette the highlight, the hover fill and the branch rows read. Without it the
list inherits the palette of the surrounding element. `effect="glow"` adds a glow around the current
row.

`NavList.Branch` takes `open`, `defaultOpen`, `onOpenChange` and `id`. Pass `open` to keep the
branch that contains the current page open across navigations. The machine sets `aria-expanded` and
`aria-controls` on the trigger, so do not set them yourself.

`NavList.Action` is a `button` with `type="button"`. Pass the icon as its child and an `aria-label`
that includes the row, such as `Rename Invoices`. A screen reader has no other text that ties the
control to its row.

Set `iconic` for a list collapsed to a rail. Each row becomes a square that contains its icon. The
counts, the controls, the indicators and the nested rows are hidden. The text stays in the
accessibility tree, so a screen reader still reads the name of every row. The rail centres its
squares, so render it in a container as wide as the rail. Pass `iconic` from the component that
collapses. The list does not measure anything itself.

`reveal="hover"` hides each control until its row is hovered. The control on the current row stays
visible. The others also appear while any element in their row has focus and under a coarse pointer,
so a keyboard and a touch screen both reach them.

Set `variant="dock"` for a few links across the foot of a screen. Each link takes an equal share of
the row and shows its icon over its label. The bottom padding includes the safe area a device
reserves for a home indicator. Do not put a branch in a dock, because it has no room to open.

The list sizes an `svg` that is a direct child of a link or a trigger. In a list, the icon takes the
icon size one smaller than the row's size. In a dock, it takes `icon.lg`. Pass the icon without a
size.

Nested rows use the same `Item` and `Link`. `Content` sets the muted ink, and the nested rows
inherit it. A line runs down the start of a nested list. When the trigger leads with an icon, the
line is aligned with the icon's centre. `guide` sets the line's style, and `none` removes it.

Set `aria-busy` on the root while `NavList.Skeleton` rows render in place of the loading rows, and
put the feedback package's `Skeleton` inside each one.

## Toc

Renders a list of links to the headings on a page and marks the headings in view. Compose it as
`Toc.Root` around a `Toc.Title` and a `Toc.List` whose first child is `Toc.Indicator`.

```tsx
import { Toc } from "@stealthscale/component-navigation";

const items = [
  { depth: 2, value: "install" },
  { depth: 3, value: "peers" },
  { depth: 2, value: "usage" },
];

<Toc.Root items={items} placement="aside" rootMargin="0px">
  <Toc.Title>On this page</Toc.Title>
  <Toc.List>
    <Toc.Indicator />
    {items.map((item) => (
      <Toc.Item item={item} key={item.value}>
        <Toc.Link href={`#${item.value}`} item={item}>
          {titles[item.value]}
        </Toc.Link>
      </Toc.Item>
    ))}
  </Toc.List>
</Toc.Root>;
```

| Axis        | Values                                                             | Default   |
| ----------- | ------------------------------------------------------------------ | --------- |
| `size`      | `sm`, `md`, `lg`                                                   | `md`      |
| `placement` | `inline`, `aside`                                                  | `inline`  |
| `palette`   | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

| Part        | Element | What it renders                                      |
| ----------- | ------- | ---------------------------------------------------- |
| `Root`      | `nav`   | The landmark, named by the title                     |
| `Title`     | `div`   | The text the landmark's `aria-labelledby` references |
| `List`      | `ul`    | One row per heading                                  |
| `Item`      | `li`    | One row, indented by its heading's depth             |
| `Link`      | `a`     | The link to one heading                              |
| `Indicator` | `li`    | The bar next to the rows whose heading is in view    |

Each item names a heading by `value`, the element ID of the heading, and `depth`, the heading level.
The root observes those elements with an `IntersectionObserver` and sets `aria-current="location"`
on the links of the headings in view. A click scrolls the page to the heading. When the page scrolls
inside an element, pass `scrollEl` so the root observes and scrolls that element.

`Toc.Root` takes the machine options next to `items`: `rootMargin` and `threshold` for the observer
band, `autoScroll` to keep the active row visible in a scrolling list, `scrollBehavior`,
`onActiveChange`, and `activeIds` or `defaultActiveIds`. The machine's default band excludes the
bottom of the viewport, so a short last section is never marked. Pass `rootMargin="0px"` for a page
of sections.

`placement="aside"` makes the root sticky below the application shell's pinned bars and caps it at
the viewport height. The root is at least 11rem wide and never wider than its container. `palette`
sets the indicator and the focus ring. Under forced colors the indicator paints `CanvasText`.

## Licence

MIT. See [LICENSE](LICENSE).
