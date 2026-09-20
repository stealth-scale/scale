# @stealthscale/component-navigation

Draws the ways a person moves between places: the link, the trail of crumbs from the front of a
site, the list of destinations a page is reached from, and the rail of headings a page is moved
through. Every component binds a recipe and draws nothing of its own, so a theme restyles all of
them by extending the recipe. The preset under `./theme` registers the recipes with an application's
compiler.

Every value a theme can change on a component is an axis of its recipe, so a caller sets it as a
prop and writes no style. A caller changes the element a component draws with `as`.

## Install

```bash
pnpm add @stealthscale/component-navigation
```

The package peers on `react` and `@stealthscale/theme`. An application lists the preset under
`./theme` among the presets its compiler installs.

## Link

Draws words a person follows to somewhere else. The ink, the visited ink, the cursor and the focus
ring come from the theme, so a theme decides what a link looks like once for every link.

```tsx
import { Link } from "@stealthscale/component-navigation";

<Link href="/invoices">Invoices</Link>;
<Link href="/terms" variant="underline">
  Terms
</Link>;
<Link as={RouterLink} to="/invoices">
  Invoices
</Link>;
```

| Axis      | Values               | Default |
| --------- | -------------------- | ------- |
| `inherit` | `true`               | off     |
| `variant` | `plain`, `underline` | `plain` |

Both looks underline under a pointer. The axis decides whether the underline is there at rest as
well. A link inside a paragraph is found by its underline as much as by its colour, so a reader who
cannot tell the two inks apart has nothing else to go on.

Set `inherit` on a link that takes the ink of the words around it: the title of a card or the brand
in a bar, where the surface already says it is pressed. The underline under a pointer and the focus
ring stay.

The element is `a` and takes an `href`. A link with no address is not a link to anything, and a
browser gives it no focus, no Enter and no offer to open elsewhere, so a control that acts rather
than navigates is a button. A router's own link goes in through `as`, which keeps the routing and
leaves the drawing here.

## Breadcrumb

Draws the path from the front of a site to the page a person is on, composed as `Breadcrumb.Root`
holding a list of crumbs.

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

The size sets the text on the root and the gap on the list, so every part reads at one size by
inheriting it. It stops at `xl` because it reads the body role, a trail being read at the size of
the page around it rather than as a heading.

The last crumb is `Breadcrumb.CurrentLink` and not a link. It draws a `span` carrying
`aria-current="page"`, which is what tells a screen reader which crumb is where the reader is, and a
link to the page already open would be a control that does nothing. It is the one crumb at full
strength and the crumbs above it are muted, because the crumb naming where you are is the one worth
reading first.

The trail does four more things for accessibility:

- **The landmark is named.** The root is a `nav` carrying `aria-label="Breadcrumb"` by default,
  because a page usually holds more than one navigation landmark and an unnamed one is announced
  with nothing to tell it from the others. State your own to override it.
- **The list keeps its role.** The list is an `ol` stating `role="list"`, because a list drawn with
  no marker loses its role in Safari and a reader is then told neither how many crumbs there are nor
  which one they are on.
- **The separator is a row, not a crumb.** It sits between two items as a row of the list rather
  than inside one, so a screen reader counting the list counts the crumbs.
- **The separator is silent.** It carries `aria-hidden` and a presentation role, because the list
  already carries the order and a mark read out between every pair adds nothing.

The separator turns around where the line runs right to left, so a chevron pointing forwards keeps
pointing forwards.

## NavList

Draws the destinations a page is reached from: rows one under another, and branches that open onto
rows of their own.

```tsx
import { NavList } from "@stealthscale/component-navigation";

<NavList.Root aria-label="Main" as="nav" iconic={collapsed}>
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
</NavList.Root>;
```

| Axis        | Values                   | Default  |
| ----------- | ------------------------ | -------- |
| `size`      | `sm`, `md`, `lg`         | `md`     |
| `variant`   | `list`, `dock`           | `list`   |
| `highlight` | `tint`, `fill`, `bar`    | `tint`   |
| `radius`    | `l1`, `l2`, `l3`, `full` | `l2`     |
| `iconic`    | `true`                   | off      |
| `reveal`    | `always`, `hover`        | `always` |

| Part        | Element  | What it draws                    |
| ----------- | -------- | -------------------------------- |
| `Root`      | `ul`     | The list, and the variants       |
| `Item`      | `li`     | One row                          |
| `Link`      | `a`      | The destination a reader presses |
| `Action`    | `span`   | A control at the end of a row    |
| `Badge`     | `span`   | A count at the end of a row      |
| `Branch`    | `li`     | A row that opens, and its state  |
| `Trigger`   | `button` | The row that opens a branch      |
| `Indicator` | `span`   | The mark that turns as it opens  |
| `Content`   | `ul`     | The rows beneath a branch        |
| `Skeleton`  | `li`     | The room a row on its way takes  |

State `aria-current="page"` on the row naming the page being read. That attribute is what a screen
reader announces and what `highlight` draws, so the two cannot disagree.

The list carries no landmark. A page holds more than one of these, so name the set on whatever holds
it, or state `as="nav"` and an `aria-label` on the root.

`NavList.Branch` takes `open`, `defaultOpen`, `onOpenChange` and `id`. Pass `open` to keep the
branch holding the current page open across a navigation. The trigger says what it controls and
whether that list is expanded, so state neither yourself.

Set `iconic` for a list collapsed to a rail. The rows become squares, the actions and the chevrons
go, and the words stay in the document out of sight, so a screen reader still names every row. Pass
it from whatever collapses. The list measures nothing itself.

Set `reveal="hover"` for a control that appears with the pointer. It stays drawn under a coarse
pointer and while anything in the row holds focus, so a keyboard and a finger both reach it.

Set `variant="dock"` for a bar of destinations across the foot of a screen. It keeps clear of the
room a device reserves for a home indicator.

Nested rows are the same `Item` and `Link`. `Content` mutes the ink and they inherit it.

Say that a list is loading. State `aria-busy` on the root around a set of `NavList.Skeleton` rows,
and put the feedback package's skeleton inside each one.

## Toc

Lists the headings on a page and marks the ones on screen. Composed as `Toc.Root` holding a title, a
list of one row per heading, and the mark that slides down the list.

```tsx
import { Toc } from "@stealthscale/component-navigation";

const items = [
  { depth: 2, value: "install" },
  { depth: 3, value: "peers" },
  { depth: 2, value: "usage" },
];

<Toc.Root items={items}>
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

| Axis   | Values           | Default |
| ------ | ---------------- | ------- |
| `size` | `sm`, `md`, `lg` | `md`    |

| Part        | Element | Draws                                               |
| ----------- | ------- | --------------------------------------------------- |
| `Root`      | `nav`   | The landmark, named by the title                    |
| `Title`     | `div`   | The words the landmark is named by                  |
| `List`      | `ul`    | One row per heading                                 |
| `Item`      | `li`    | One row, indented by its heading's depth            |
| `Link`      | `a`     | The link to one heading                             |
| `Indicator` | `li`    | The mark beside the rows whose heading is on screen |

Each item names a heading by its `value`, which is the id of the heading's element in the document,
and its `depth`, which is the heading's level. The root watches those elements and marks the rows
whose element is on screen, with `aria-current="location"` on their links. A press on a link scrolls
the page to the heading. Where the page scrolls inside an element rather than the window, pass
`scrollEl` so the root watches and scrolls that element.

`Toc.Root` takes the machine's own settings beside the items: `rootMargin` and `threshold` for the
band a heading counts as on screen in, `autoScroll` for keeping the marked row in view in a rail
that scrolls itself, `scrollBehavior`, `onActiveChange`, and `activeIds` or `defaultActiveIds` to
drive which rows are marked. Draw `Toc.Indicator` as the list's first child, because the machine
measures the marked rows against the list.

## Licence

MIT. See [LICENSE](LICENSE).
