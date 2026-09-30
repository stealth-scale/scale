# @stealthscale/component-navigation

React components for moving between pages and between sections of a page: `Link`, `Breadcrumb`,
`NavList`, `NavigationMenu`, `Pagination` and `Toc`. Each component renders through a recipe, so a
theme restyles it by extending the recipe. The preset under `./theme` registers the recipes with an
application's compiler.

Every value a theme can change is a recipe axis, and a caller sets it as a prop. A caller changes
the rendered element with `as`.

## Install

```bash
pnpm add @stealthscale/component-navigation
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks`,
`@stealthscale/component-actions`, `@stealthscale/component-disclosure` and
`@stealthscale/component-primitives`. Add the preset under `./theme` to the presets the
application's compiler installs.

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

| Part            | Element  | What it renders                                    |
| --------------- | -------- | -------------------------------------------------- |
| `Root`          | `ul`     | The list, which receives the variants              |
| `Item`          | `li`     | One row                                            |
| `Link`          | `a`      | A row's link                                       |
| `Action`        | `button` | A control at the end of a row                      |
| `Badge`         | `span`   | A count at the end of a row                        |
| `Branch`        | `li`     | A row that expands, and its state                  |
| `Trigger`       | `button` | The row that expands and collapses                 |
| `Indicator`     | `span`   | The icon that rotates as a branch opens            |
| `Content`       | `ul`     | The nested list of a branch                        |
| `Skeleton`      | `li`     | A placeholder row while the list loads             |
| `PropsProvider` | none     | The default `iconic` and `size` of the lists below |

Set `aria-current="page"` on the link to the current page. A screen reader announces the attribute
and `highlight` styles it, so the two cannot disagree. A row is `fg.muted`, and the current row is
`fg` and semibold. A row's label, inline inset and gap are two sizes below the row's size: 12.6px,
8px and 4px at `md`.

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

`NavList.PropsProvider` sets `iconic` and `size` once for every list below it, and a list's own
props apply over it. The screen package's sidebar renders one. On an iconic list, a link with
`tooltip` shows those words in a tooltip beside its icon on hover and on focus. The tooltip is
portalled to the document, because a scrolling column clips what overflows it.

Inside a filter scope from `@stealthscale/hooks`, such as a sidebar's search, an `Item` or a
`Branch` whose words do not contain the query is hidden, and a branch is open while the scope has a
query. While the query is active, a press on a branch's trigger leaves the branch open. A cleared
query returns each branch to the state it had before the query, so the branch of the current page is
open again.

`reveal="hover"` hides each control until its row is hovered. The control on the current row stays
visible. The others also appear while any element in their row has focus and under a coarse pointer,
so a keyboard and a touch screen both reach them.

Set `variant="dock"` for a few links across the foot of a screen. Each link takes an equal share of
the row and shows its icon over its label. The bottom padding includes the safe area a device
reserves for a home indicator. Do not put a branch in a dock, because it has no room to open.

The list sizes an `svg` that is a direct child of a link or a trigger. In a list, the icon takes the
icon size one smaller than the row's size. In a dock, it takes `icon.lg`. Pass the icon without a
size.

Nested rows use the same `Item` and `Link`. `Content` sets `fg.subtle`, and the nested rows inherit
it. A line runs down the start of a nested list. When the trigger leads with an icon, the line is
aligned with the icon's centre. `guide` sets the line's style, and `none` removes it.

Set `aria-busy` on the root while `NavList.Skeleton` rows render in place of the loading rows, and
put the feedback package's `Skeleton` inside each one.

## NavigationMenu

Renders a site's navigation landmark: a bar of links and of buttons that open panels of links.
Compose it as `NavigationMenu.Root` around a `NavigationMenu.List` of items. An item contains a
trigger and its panel, or a link.

```tsx
import { NavigationMenu } from "@stealthscale/component-navigation";

<NavigationMenu.Root aria-label="Site">
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>
        Products
        <ChevronDownIcon />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/payments">
          <CreditCardIcon />
          <Strong weight="medium">Payments</Strong>
          <Span tone="muted">Accept cards and bank debits in one checkout.</Span>
        </NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="pricing">
      <NavigationMenu.Link current href="/pricing">
        Pricing
      </NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Indicator />
  </NavigationMenu.List>
  <NavigationMenu.ViewportPositioner align="start">
    <NavigationMenu.Viewport />
  </NavigationMenu.ViewportPositioner>
</NavigationMenu.Root>;
```

| Axis      | Values                                                             | Default   |
| --------- | ------------------------------------------------------------------ | --------- |
| `size`    | `sm`, `md`, `lg`                                                   | `md`      |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | `primary` |

| Part                 | Element  | What it renders                                         |
| -------------------- | -------- | ------------------------------------------------------- |
| `Root`               | `nav`    | The landmark, which starts the machine                  |
| `List`               | `ul`     | The bar of items                                        |
| `Item`               | `li`     | A trigger and its panel, or a link                      |
| `Trigger`            | `button` | The button that opens its item's panel                  |
| `Content`            | `div`    | The panel of an item, `hidden` while the item is closed |
| `Link`               | `a`      | A link in the bar or in a panel                         |
| `Indicator`          | `li`     | The `aria-hidden` bar under the open trigger            |
| `ViewportPositioner` | `div`    | The box that places the viewport under the bar          |
| `Viewport`           | `div`    | The surface every panel shows in                        |

Each trigger follows the WAI-ARIA disclosure navigation pattern: a `button` with `aria-expanded` and
`aria-controls`, and no `menu` role. A mouse over a trigger opens its panel after `openDelay`, 200ms
by default, and a press toggles it. A mouse that leaves the trigger and the panel closes it after
`closeDelay`, 300ms by default. The arrow keys move along the bar, Home and End move to its ends,
and ArrowDown moves into an open panel, or ArrowRight in a vertical menu. The arrow keys move
between a panel's links. Escape and a press outside close the panel and return focus to its trigger.

`NavigationMenu.Root` takes the machine's options: `value` or `defaultValue`, `onValueChange`,
`openDelay`, `closeDelay`, `orientation`, `dir`, `disableHoverTrigger`, `disableClickTrigger` and
`disablePointerLeaveClose`. Name the landmark with `aria-label`. The machine's `translations` are
not accepted. `disablePointerLeaveClose` keeps a panel open when the pointer leaves the panel or the
viewport. The root sets the machine's value to an item open at mount after the first commit, because
the machine measures a trigger and tracks Escape and presses outside only when its value changes.
`onValueChange` receives each change the menu makes, and never the value the menu mounts with.

Without a viewport, each panel opens one gap under its trigger. A panel is as wide as its content,
at most `sizes.2xl` and 20px narrower than the window. With `ViewportPositioner` and `Viewport`,
every panel shows inside the viewport, which moves to the open trigger and resizes to the panel. The
panel that closes fades over the panel that opens. `align` on the positioner lines the viewport up
with the open trigger: `start` joins their start edges, `center` their centres and `end` their end
edges. The default is `center`. The machine keeps the viewport 10px inside the window. Render the
viewport on the first render, because the machine looks for it once, as it starts.

A closed panel is in the document with `hidden`, so a crawler reads its links. While the menu
renders a viewport, the machine renders a visually hidden proxy after each open trigger, and an
element whose `aria-owns` references the panel. The proxy is focusable and `aria-hidden`. Tab on the
trigger focuses the proxy, which moves focus to the panel's first link, and Tab on the panel's last
link moves focus past the proxy to the next item. axe reports `aria-hidden-focus` for the proxy
while a panel is open.

`NavigationMenu.Link` takes `current`, which sets `aria-current="page"`, and `closeOnClick`, true by
default. `onSelect` runs on a press before the menu closes, and a call to `preventDefault` on its
event keeps the menu open. A press with the meta key keeps the menu open, because the link opens in
another tab. Pass a router's link through `as`.

A panel link places a leading icon in a column of its own and every other child in the column beside
it, so a title and a description start at one edge. Pass `Strong` and `Span tone="muted"` from the
typography package for the two. The recipe sizes the icon from the icon scale at the menu's size. A
trigger's trailing icon is one size smaller and turns over while the panel is open.

`NavigationMenu.Indicator` is a bar along the open trigger's bottom edge. In a list with an
indicator the items are not positioned, because the machine measures a trigger against its
positioned ancestor and the indicator reads that place against the list. A panel in place then opens
under the trigger's measured place, and a panel that closes while another opens hides at once.
`palette` colors the indicator and a link to the current page. Under forced colors the indicator
paints `CanvasText` and an open trigger fills with `Highlight`.

The bar wraps onto a second row when its items do not fit. The recipe offers no `Arrow` part,
because the indicator is a bar, and no item indicator, because the trigger turns its own trailing
icon.

## Pagination

Renders a navigation landmark of page buttons between the buttons that move a page back and forward.
Compose it as `Pagination.Root` around the triggers and `Pagination.Items`, or around the triggers
and `Pagination.PageText` for a row without page buttons.

```tsx
import { Pagination } from "@stealthscale/component-navigation";

<Pagination.Root count={240} onPageChange={({ page }) => setPage(page)} page={page} pageSize={10}>
  <Pagination.PrevTrigger>
    <ChevronLeftIcon />
  </Pagination.PrevTrigger>
  <Pagination.Items />
  <Pagination.NextTrigger>
    <ChevronRightIcon />
  </Pagination.NextTrigger>
</Pagination.Root>;
```

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

| Part           | Element         | What it renders                                           |
| -------------- | --------------- | --------------------------------------------------------- |
| `Root`         | `nav`           | The landmark, which starts the machine                    |
| `Items`        | none            | A page per page shown, a mark per run left out, a summary |
| `Item`         | `button` or `a` | One page                                                  |
| `Ellipsis`     | `span`          | The `aria-hidden` mark for a run of pages left out        |
| `PrevTrigger`  | `button` or `a` | The button that moves one page back                       |
| `NextTrigger`  | `button` or `a` | The button that moves one page forward                    |
| `FirstTrigger` | `button` or `a` | The button that moves to the first page                   |
| `LastTrigger`  | `button` or `a` | The button that moves to the last page                    |
| `PageText`     | `output`        | The current page in words                                 |

Every page and trigger is the actions package's square `Button`. The root passes `size`, `variant`
and `palette` to every button inside it. `variant` takes any look of the button and defaults to
`ghost`, and `palette` takes any palette. The current page takes `aria-current="page"`, which every
look of the button marks as on.

`Pagination.Root` takes the machine's options: `count`, `page` or `defaultPage`, `pageSize` or
`defaultPageSize`, `siblingCount` and `boundaryCount` (both 1 by default), `onPageChange`,
`onPageSizeChange`, `type` and `getPageUrl`. Its `aria-label` defaults to `Pagination`. The
machine's `translations` are not accepted, because every word is a prop with an English default. A
page is named `Page N` unless `Items` takes a `label` function, and each trigger takes `label` in
place of `Previous page`, `Next page`, `First page` or `Last page`. Pass each trigger's glyph as its
child.

A trigger at an end sets `aria-disabled` in place of `disabled`, so a press that moves to the last
page leaves focus on the trigger. The machine ignores a press on a trigger at an end.

While its children overflow its row at their natural width, the root sets `data-crowded`. The recipe
then hides the pages and the marks and shows a summary of the current page between the triggers,
such as `Page 12 of 24`. `summary` on `Items` sets its format. The summary is an `output`, so a
screen reader reads the new page after a press while the summary shows. The root takes no `ref`,
because it attaches its own.

`PageText` shows the current page in the format `format` names: `compact` renders `Page 12 of 24`,
`short` renders `12 / 24`, and `long` renders the range of items, `111–120 of 240`. A function
receives `count`, `page`, `pageRange` and `totalPages` and returns the words in any language.
`summary` takes the same values.

With `type="link"`, every page and trigger is a link to the address `getPageUrl` returns, so a
reader can open a page in a new tab. A press follows the link and leaves the page unchanged: pass
`page` from the address, as an application reads it from its router. A trigger at an end has no
address, so it takes the link role and a tab stop and keeps focus.

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
the viewport height. A longer list scrolls in the primitives package's scroll area inside the root,
whose viewport takes no tab stop. The root is at least 11rem wide and never wider than its
container. `palette` sets the indicator and the focus ring. Under forced colors the indicator paints
`CanvasText`.

## Licence

MIT. See [LICENSE](LICENSE).
