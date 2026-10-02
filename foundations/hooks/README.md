# @stealthscale/hooks

`@stealthscale/hooks` publishes the React hooks a component uses to read the page it draws into.
Some measure the document. Some keep a value across renders without causing another render. One
writes a message to a screen reader, and one keeps an element in the document while it animates out.

## Install

```bash
pnpm add @stealthscale/hooks
```

The package peers on `react`. It depends on `@zag-js/presence` and `@zag-js/react`, which
`usePresence` runs, and on `@zag-js/highlight-word`, which `useHighlight` runs.

## useConst

Builds a value on the first render and returns that same value on every render after it.

Use it when the identity of a value matters and building it costs something: a collator, an
observer, an object used as a map key. `useMemo` is a cache the runtime may drop and rebuild, so a
caller that compares by identity cannot use it. The factory runs on the first render only. To hold a
value that is itself a function, return it from the factory.

```tsx
const collator = useConst(() => new Intl.Collator(locale, { sensitivity: "base" }));

const sorted = useMemo(() => [...names].sort(collator.compare), [collator, names]);
```

## useLiveRef

Points a ref at the value this render was given, and returns the ref.

Use it when a callback or an effect has to read the current value without listing it as a
dependency. A resize handler that listed the width it compares against would detach and reattach its
observer on every render. The ref is written during the render rather than in an effect, so code
that runs before the effects reads this render's value.

```tsx
const latest = useLiveRef(onResize);

useEffect(() => {
  const observer = new ResizeObserver(() => latest.current(element));

  observer.observe(element);

  return () => observer.disconnect();
}, [element, latest]);
```

## useCallbackRef

Returns a stable function that calls whichever callback the latest render passed.

Use it when you are about to put a handler in a dependency array. A handler written inline is a new
closure on every render, so the effect re-runs on every render. List the function this hook returns
instead, and the effect re-runs only when its other dependencies change. To make the returned
function change identity, pass those dependencies as the second argument.

```tsx
export function useDismiss(onDismiss?: () => void) {
  const dismiss = useCallbackRef(onDismiss);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    document.addEventListener("keydown", escape);

    return () => document.removeEventListener("keydown", escape);
  }, [dismiss]);
}
```

## useSafeLayoutEffect

Measures and writes before the browser paints, and does nothing on a server.

Use it instead of `useLayoutEffect` in any component that renders on a server. A layout effect runs
before the paint, so a component that positions itself is never drawn in the wrong place first. A
server has nothing to measure and nothing to paint, and React logs a warning for `useLayoutEffect`
there rather than skipping the call. This hook falls back to `useEffect` on a server, and React runs
no effects there.

```tsx
useSafeLayoutEffect(() => {
  const { height } = content.current.getBoundingClientRect();

  panel.current.style.setProperty("--panel-height", `${String(height)}px`);
}, []);
```

## useControllableState

Returns the value and a setter, and takes the value from the caller when the caller passes one.

Use it for any piece of state a caller might want to own: an open flag, a selected value, a search
term. One component then serves a caller that sets the value and a caller that leaves the component
to hold it. Passing `value` is what makes the state controlled, so a caller that passes `undefined`
leaves the component in control. The hook re-reads `value` on every render, so a caller that starts
setting it partway through takes over from that render.

```tsx
export function Disclosure(props: DisclosureProps) {
  const [open, setOpen] = useControllableState({
    defaultValue: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
    value: props.open,
  });

  return <button onClick={() => setOpen((was) => !was)}>{open ? "Hide" : "Show"}</button>;
}
```

`onChange` is called whenever the value changes, controlled or not. A set to the value already held
is dropped, so a caller listening for changes receives only changes.

## useMediaQuery

Reads whether each query matches, and re-reads them whenever any of them changes.

Use it when a decision depends on the page rather than on a prop. CSS cannot express a decision that
changes what is rendered rather than how it looks. Every query is read from one window, and the
results come back in the order the queries were written, so a caller can index the result by its own
query. A change re-reads every query, because one match changing can change another.

```tsx
const [wide, dark] = useMediaQuery(["(min-width: 60rem)", "(prefers-color-scheme: dark)"]);

return wide ? <Sidebar /> : <Drawer />;
```

The first render returns the fallback rather than reading the window, so a server's markup and the
client's first paint agree. Pass `ssr: false` to read the window on that first render. Pass
`fallback` to set what each query returns until the window has been read.

## useCoarsePointer

Reads whether the reader's main pointer is a finger rather than a mouse or a pen.

Use it where an interaction assumes a fine pointer. A finger cannot rest on an element, so anything
that appears on hover alone never appears. A finger cannot aim at a hairline, so a small target has
to grow.

```tsx
const touch = useCoarsePointer();

return (
  <Row data-density={touch ? "comfortable" : "compact"}>
    {touch ? <MoreButton /> : <HoverActions />}
  </Row>
);
```

## useIsOverflowing

Watches an element and returns whether the content inside it is cut off.

Use it when text that does not fit is what decides whether to draw something else. A tooltip
carrying the full label, a read-more control and a fade at the edge all need that result. CSS
truncates the text and reports nothing.

The element is measured again on four occasions:

- It changes size.
- Its content changes.
- Its parent changes size.
- The fonts finish loading.

```tsx
const ref = useRef<HTMLSpanElement>(null);
const { overflows } = useIsOverflowing(ref);

return (
  <Tooltip content={overflows ? children : undefined}>
    <span ref={ref}>{children}</span>
  </Tooltip>
);
```

The returned object keeps one identity while the result stands, so the component renders again only
when the element crosses between fitting and not.

## useCrowded

Returns whether the children of an element need more room than the element has at their natural
width, and the ref callback that attaches the element.

Use it for a component that switches to a narrower layout while its children do not fit, such as a
row of steps that moves its titles below the discs. Set `data-crowded` on the element from the
result. The recipe styles the narrow layout under `[data-crowded]`.

```tsx
const [crowded, ref] = useCrowded();

return <ol data-crowded={crowded ? "" : undefined} ref={ref} />;
```

A measurement lays the children out at their natural width: the hook takes `data-crowded` off the
element and sets `data-measuring` for one synchronous read. Both attributes are restored before the
browser paints. A recipe that changes the natural layout under `[data-crowded]` restores it under
`[data-measuring]`. The hook measures again whenever the element's size changes. The result is
`false` until the first measurement.

## revealSideways

Scrolls the sideways scroller around an element until the element is inside it, and leaves the page
where it is.

Use it when focus or a selection moves to an element that a sideways scroll area can hide, such as a
tab in a long strip or a cell of a wide grid. The element's own `scrollIntoView` scrolls the page
too, and Firefox 155 ignores its `container: "nearest"` option.

```ts
revealSideways(tab, list);
```

- The scroller is the first element inside `frame` that contains the element and scrolls sideways:
  its `overflow-x` is `auto` or `scroll`, and its content is wider than its box. A row that fits
  scrolls nothing.
- The scroller moves by the least distance that brings the element inside its box.
- An element under a sticky part of the scroller is revealed up to the scroller's edge only.

## usePresence

Keeps an element in the document while its exit animation runs, and returns whether to render it,
the props it spreads and the ref callback that attaches it.

Use it for content that opens and closes with an animation, such as a popover's panel. Without it,
closed content is hidden the moment it closes and its exit animation never plays.

```tsx
const { props, setNode, unmounted } = usePresence({
  lazyMount: true,
  present: open,
  unmountOnExit: true,
});

return unmounted ? null : <div ref={setNode} {...props} />;
```

| Option                 | What it does                                                          |
| ---------------------- | --------------------------------------------------------------------- |
| `present`              | Whether the element shows                                             |
| `lazyMount`            | Renders nothing until the element first shows                         |
| `unmountOnExit`        | Renders nothing once the element's exit animation ends                |
| `skipAnimationOnMount` | Leaves `data-state` unset until `present` changes, so no entry motion |
| `onExitComplete`       | Runs once the element's exit animation ends                           |

`props` sets `data-state` to `open` or `closed`, which a recipe's entry and exit animations read,
and `hidden` once the element has left. When `present` turns false, the hook reads the element's
computed `animationName` one frame later. An element with no animation, a `0s` duration or
`display: none` leaves at once. An element with an animation stays until its `animationend` or
`animationcancel`. Destructure the result: React's lint reads `setNode` as a callback only when it
is a binding of its own.

## useStickyOffsets

Sets a custom property on each sticky band holding the height of the bands before it, and one on the
column holding the height of all of them.

Use it when more than one band sticks in the same scroll container. A page header above a toolbar
above a table head is three of them. The second band has to sit below the first, and
`position: sticky` gives it no way to read how tall the first is.

```tsx
useStickyOffsets(column, stuck, {
  bands: "[data-band]",
  offset: "--band-offset",
  total: "--stuck-height",
});
```

```css
[data-band] {
  position: sticky;
  top: var(--band-offset, 0);
}
```

A band rendered later is measured when the column next changes size rather than on a size change of
its own.

## useMatrixCrosshair

Returns the ref to put on a grid and the two handlers that mark the row and the column under the
pointer.

Use it in a grid wide enough that "row 14, column 9" is a counting exercise. Column headers in such
a grid carry short names, because rotated text is unreadable and most magnifiers cannot show it.
This hook turns a short name back into a row somebody can read. The marks are written through the
DOM rather than through state, because a matrix of a few hundred items either way is tens of
thousands of cells.

Mark the cells and the headers of a row with `data-row` and those of a column with `data-column`.
The hook sets `data-lit` on both sets while the pointer is over them.

```tsx
const { clear, ref, track } = useMatrixCrosshair<HTMLTableElement>();

return (
  <table ref={ref} onPointerMove={track} onPointerLeave={clear}>
    <td data-row={rowId} data-column={columnId} />
  </table>
);
```

```css
td[data-lit] {
  background: var(--colors-bg-muted);
}
```

An element may carry both attributes, which is what lets a matrix of one set against itself mark the
row a hovered column stands for.

## useAnnounce

Returns a function that announces a message to a screen reader.

Use it when something changes that the page shows without words: "5 results", "copied", "row
removed". The change is plain on screen and silent to anything reading the page aloud. `polite`
waits for a gap and suits nearly everything. `assertive` interrupts whatever is being read mid-word,
which suits an error that invalidates what somebody is doing and nothing else.

```tsx
const announce = useAnnounce();

const copy = async () => {
  await navigator.clipboard.writeText(value);
  announce("Copied");
};

const onFail = (error: Error) => {
  announce(`Could not save. ${error.message}`, "assertive");
};
```

Messages queued in one frame are joined into a single utterance, because a live region announces one
thing per change. One component announcing twice is correcting itself, so its later message replaces
its earlier one. Where two components announce, both messages are read. The same message twice is
announced twice, because "copied" pressed twice is two events somebody wants confirmed.

## speakable

Joins a frame's messages into the one string the region announces.

`useAnnounce` calls this itself. Call it directly only when you write into a live region of your own
and want the same joining rule. A full stop is added only where the message before it ends in none,
and a message repeated in the same frame appears once.

```ts
speakable(["Saved", "3 rows selected", "Saved"]);
```

That returns `Saved. 3 rows selected`.

## createRequiredContext

Makes a context a reader has to be inside, and the two hooks that read it.

Use it for a component drawn in parts, where every part needs something the root holds. React
returns the default value for a missing provider, so a part drawn outside its root draws wrongly,
reports nothing, and fails somewhere else. This throws where the part was written instead, and names
the component so the message says which root is missing.

```tsx
const [ApiProvider, useCollapsible] = createRequiredContext<CollapsibleApi>("Collapsible");

function Root({ children }: RootProps): ReactElement {
  const api = collapsible.connect(useMachine(collapsible.machine, { id: useId() }), normalizeProps);

  return <ApiProvider value={api}>{children}</ApiProvider>;
}

function Trigger(props: TriggerProps): ReactElement {
  const api = useCollapsible();

  return <Styled {...mergeProps(api.getTriggerProps(), props)} />;
}
```

A trigger drawn with no root above it throws
`A part of Collapsible was drawn outside the root that holds it together.` A reader under two
providers gets the value of the nearer one. Each call makes a context of its own, so two components
never read each other's.

The third member of the tuple reads the same context and returns `undefined` where no provider
stands above it. A root that nests inside another of its own kind reads that hook to find out
whether it is the outermost.

## createLabelling

Creates the provider a root renders and the hook its label part calls, so the root knows whether a
label is mounted.

Use it for a component whose root points `aria-labelledby` at an optional label part. An ID
reference to an element that does not exist is invalid, so the root sets the attribute only while
the label is mounted.

```tsx
const [LabellingProvider, useLabelled] = createLabelling("TreeView");

function Root({ children }: RootProps): ReactElement {
  const [labelled, setLabelled] = useState(false);

  return (
    <LabellingProvider value={setLabelled}>
      <div aria-labelledby={labelled ? labelId : undefined}>{children}</div>
    </LabellingProvider>
  );
}

function Label(props: LabelProps): ReactElement {
  useLabelled();

  return <span id={labelId} {...props} />;
}
```

A mounted label calls the setter with `true`, and with `false` when it unmounts. A label rendered
outside its root throws with the component's name.

## omitUndefined

Returns a copy of an object without the entries whose value is `undefined`, typed without
`undefined`.

Use it on the settings a root splits off for a Zag machine. Under `exactOptionalPropertyTypes`,
`useMachine` rejects `undefined` for every setting the machine defaults, while the machine's own
`Partial<Props>` allows it. The call changes the type and not the value: `useMachine` strips
`undefined` entries itself before it merges the machine's defaults.

```tsx
const [options, rest] = splitPopoverProps(props);
const service = useMachine(popover.machine, { ...omitUndefined(options), id: options.id ?? id });
```

`false`, `null`, `0` and the empty string are kept. The input object is not modified.

## Filter scopes

Filter the rows under a search by the words each row renders.

Use them when a search field filters a list the caller composes from parts, such as a sidebar's
navigation. A row registers the text its element renders after each render, so the caller repeats no
words in a prop.

- `useFilterScope()` creates a scope, and `FilterContext` provides it to the rows below.
- `scope.setQuery(query)` sets the query. A row matches when its words contain the query, without
  regard to case or surrounding spaces.
- `useFilteredRow()` registers a row and returns `hidden` and the `ref` for its element.
- `useFilterActive()` returns whether a scope around the caller has a query.
- `useFilterEmpty()` returns whether the query leaves zero rows in the scope.
- `scope.listed()` returns the number of rows registered in the scope, and `scope.matched()` the
  number the query keeps, so a block tells a query that matched none of its rows from a block with
  no rows.

```tsx
function Filtered({ children }: { children: ReactNode }): ReactElement {
  const scope = useFilterScope();

  return (
    <FilterContext value={scope}>
      <input aria-label="Filter" onChange={(event) => scope.setQuery(event.target.value)} />
      <ul>{children}</ul>
    </FilterContext>
  );
}

function Row({ children }: { children: ReactNode }): ReactElement {
  const { hidden, ref } = useFilteredRow<HTMLLIElement>();

  return (
    <li hidden={hidden} ref={ref}>
      {children}
    </li>
  );
}
```

A scope inside another registers its rows with the outer scope too, and keeps a row only when the
row's words contain both queries. Rows and empty messages read their scope through
`useSyncExternalStore`, so a query re-renders only the parts that read it.
`createFilterScope(around)` creates a scope outside React.

## useHighlight

Splits a text into the runs that match a search query and the runs between them.

Use it to show why a result matched where the caller renders the runs itself, such as the rows of a
combobox. The typography package's `Highlight` renders the runs of a string in marks.

```ts
useHighlight({ query: "pay", text: "Fees for payments" });
```

That returns
`[{ match: false, text: "Fees for " }, { match: true, text: "pay" }, { match: false, text: "ments" }]`.

- Every occurrence of every term matches, by substring, the way a filter scope matches its rows.
  Letter case is ignored unless `ignoreCase` is false.
- Each term is trimmed and an empty term is dropped, so a query of spaces marks nothing.
- Longer terms are tried first, so `["off", "offer"]` marks `offer` whole.
- A character a regular expression reads, such as `(`, matches as written.
- Accents count, as in a filter scope: `cafe` does not match `café`.

## Types

| Type                        | Declaration               | What it describes                                                           |
| --------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `Overflow`                  | `interface`               | Whether content is cut off across, down, or on either axis                  |
| `MatrixCrosshair`           | `interface`               | The ref and the two pointer handlers a grid attaches                        |
| `UseControllableStateProps` | `interface`               | The value, the default, and the callback run on every change                |
| `UseMediaQueryOptions`      | `interface`               | What each query returns before the window is read, and which window to read |
| `UseStickyOffsetsOptions`   | `interface`               | Which bands stick, and which custom properties carry their offsets          |
| `AnnouncePoliteness`        | `"assertive" \| "polite"` | How much a message is allowed to interrupt                                  |
| `ProvidedProps`             | `interface`               | The value a provider carries and the tree that reads it                     |
| `Labelling`                 | tuple                     | The provider a root renders and the hook its label calls                    |
| `OmitUndefined`             | mapped type               | The input type with every property optional and `undefined` excluded        |
| `FilterScope`               | `interface`               | A scope's query, its registered rows and the functions that read them       |
| `FilteredRow`               | `interface`               | Whether a row is hidden, and the ref for its element                        |
| `PresenceOptions`           | `interface`               | Whether an element shows, and whether it renders while it does not          |
| `Presence`                  | `interface`               | Whether to render the element, its props and its ref callback               |
| `PresenceProps`             | `interface`               | The element's `data-state` and `hidden`                                     |
| `HighlightChunk`            | `interface`               | One run of a text, and whether it matches the query                         |
| `UseHighlightOptions`       | `interface`               | The text, the query and whether letter case is ignored                      |

## Licence

MIT. See [LICENSE](LICENSE).
