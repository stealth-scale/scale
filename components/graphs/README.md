# @stealthscale/component-graphs

`@stealthscale/component-graphs` renders node graphs over React Flow. `Graph` renders a figure
around a canvas of cards with named ports, edges a person can remove, a toolbar that zooms and fits
the view, an overview map and a caption. An editable canvas reports each finished edit as the graph
after it, and `Graph.PaletteItem` adds a node by a drag onto the canvas or by a press.
`DirectedGraph` renders a directed graph from the caller's own nodes and edges: a focused node
traces what feeds it and what it feeds, and a branch opens and closes with the count of what it
hides. `NetworkGraph` renders a network of discs sized by weight, where a focused node lights the
nodes it connects to. `diffGraphs` compares two versions of a graph, and a canvas marks the changes
on its cards and edges. `layoutGraph` places a graph's nodes in ranks with dagre, so its edges run
down the canvas or across it, and `layoutForce` places them with d3-force. The preset under
`./theme` registers the recipe with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-graphs
```

The package depends on `@xyflow/react` 12.12.0, `@dagrejs/dagre` 3.1.1 and `d3-force` 3.0.0, each
pinned exactly, because the recipe restyles the classes React Flow writes and the layouts' pictures
depend on the engines' arithmetic. It depends on `@stealthscale/component-a11y` for the toolbar's
roving focus, `@stealthscale/component-actions` for its buttons and `@stealthscale/component-data`
for a node's status and relation. It peers on `react`, `react-dom`, `@stealthscale/theme`,
`@stealthscale/hooks` and `@stealthscale/provider-locale`. The package does not import a stylesheet.

## Graph

```tsx
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Graph, layoutGraph } from "@stealthscale/component-graphs";

const nodes = layoutGraph(steps, links, { ranksep: 64 });

<Graph.Root>
  <Graph.Controls label="Pipeline view">
    <Graph.Control action="zoomIn" label="Zoom in">
      <PlusIcon />
    </Graph.Control>
    <Graph.Control action="zoomOut" label="Zoom out">
      <MinusIcon />
    </Graph.Control>
    <Graph.Control action="fit" label="Fit the graph in view">
      <MaximizeIcon />
    </Graph.Control>
    <Graph.ZoomLevel />
  </Graph.Controls>
  <Graph.Canvas edges={links} label="Nightly pipeline" nodes={nodes} readOnly />
  <Graph.Caption>The churn model failed after the join of orders and customers.</Graph.Caption>
</Graph.Root>;
```

| Part          | Element      | What it renders                                                                        |
| ------------- | ------------ | -------------------------------------------------------------------------------------- |
| `Root`        | `figure`     | The figure inside React Flow's provider. It takes `direction` and the ratio            |
| `Canvas`      | `div`        | React Flow in a panel as tall as the ratio, with the kit's nodes and edges             |
| `Controls`    | `div`        | A toolbar above the canvas, one tab stop whose arrow keys move between its controls    |
| `Control`     | `button`     | Zooms in, zooms out or fits the graph in view, by `action`, with the caller's glyph    |
| `ZoomLevel`   | `output`     | The canvas's zoom as a percentage in `locale`, else the provider's, else the runtime's |
| `MiniMap`     | `div`        | React Flow's minimap below the canvas at the row's end, which pans and zooms the view  |
| `Summary`     | `div`        | A row below the canvas for what the selection means, which wraps at a narrow width     |
| `Empty`       | `div`        | A message in the canvas's place at the canvas's ratio, in a box with a dashed edge     |
| `Caption`     | `figcaption` | The finding in words, which is the figure's accessible name                            |
| `PaletteItem` | `button`     | A button that adds one kind of node, by a drag onto the canvas or by a press           |
| `Node`        | `div`        | A card for a custom node type: its header, body, problem line, tag, branch and ports   |
| `LabelNode`   | `div`        | The kit's card for React Flow's `default`, `input` and `output` types, from the data   |
| `Edge`        | `g`          | React Flow's bezier between two ports and, on an editable canvas, its remove control   |

`Graph.nodeTypes` and `Graph.edgeTypes` map React Flow's built-in types to `LabelNode` and `Edge`. A
caller that adds a type spreads them into its own map, so the built-in types keep the kit's look.

| Axis    | Values                                                                    | Default |
| ------- | ------------------------------------------------------------------------- | ------- |
| `ratio` | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide` | `video` |

React Flow renders nothing in a box without a height. The ratio gives the canvas its height before
React Flow measures it. `Graph.Empty` takes the same ratio and keeps a figure's height while it has
no node.

### The canvas

| Prop               | Takes                                                                        | Default                             |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------- |
| `label`            | The canvas's accessible name                                                 | Required                            |
| `nodes`, `edges`   | The graph React Flow renders, controlled                                     | None                                |
| `readOnly`         | Whether the graph is read and not edited                                     | `false`                             |
| `onGraphChange`    | Called with the graph after each finished edit and the step that names it    | None                                |
| `onDropItem`       | Called with a palette item's id and the point a person dropped it at         | None                                |
| `removeGlyph`      | The glyph of every edge's remove control                                     | None                                |
| `removeName`       | Writes the name of an edge's remove control from the names of its ends       | `Remove the connection from A to B` |
| `background`       | Whether the dotted background renders                                        | `true`                              |
| `edgeName`         | Writes an edge's name from the names of its ends                             | `Source to Target`                  |
| `nodeDescription`  | The instruction every node of an editable canvas is described by             | The keys it takes                   |
| `edgeDescription`  | The instruction every edge of an editable canvas is described by             | The keys it takes                   |
| `moveAnnouncement` | Writes the announcement of a move the arrow keys make                        | The direction                       |
| `changes`          | A comparison whose changes the canvas marks, such as `diffGraphs`'s result   | None                                |
| `addedLabel`       | The word of an added node or edge                                            | `Added`                             |
| `changedLabel`     | The word of a changed node                                                   | `Changed`                           |
| `removedLabel`     | The word of a removed node or edge                                           | `Removed`                           |
| `children`         | Elements React Flow renders over the canvas, such as a panel of the caller's | None                                |

- The canvas passes every other prop to React Flow. A caller's prop applies over the canvas's own
  switches.
- The canvas is controlled. React Flow reports each change a person makes through `onNodesChange`,
  `onEdgesChange` and `onConnect`, and the caller applies it with `applyNodeChanges`,
  `applyEdgeChanges` and `addEdge`, or keeps the graph in `useNodesState` and `useEdgesState`.
- Delete and Backspace remove the selection.
- `readOnly` keeps panning, zooming and each node's tab stop. It turns off selecting, dragging,
  connecting, the keys that move and remove, the edges' tab stops and the remove controls.

The view fits the graph on the first render at most at its own size and down to 10%. The fit keeps
24px clear at either side and 32px at the top and the bottom: the top for a tag above a card, and
the bottom for React Flow's attribution. The toolbar's fit control frames it the same way.

### Editing

```tsx
import { type XYPosition, useEdgesState, useNodesState } from "@xyflow/react";

import { Graph } from "@stealthscale/component-graphs";

const [nodes, setNodes, onNodesChange] = useNodesState(steps);
const [edges, setEdges, onEdgesChange] = useEdgesState(links);

function add(kind: string, position: XYPosition) {
  const node = { data: { label: names[kind] }, id: nextId(kind), origin: [0.5, 0.5], position };

  setNodes([...nodes, node]);
}

<Graph.Root>
  <Graph.PaletteItem item="fraud" onAdd={add}>
    Add a fraud check
  </Graph.PaletteItem>
  <Graph.Canvas
    edges={edges}
    label="Order workflow"
    nodes={nodes}
    onDropItem={add}
    onEdgesChange={onEdgesChange}
    onGraphChange={(graph, step) => {
      remember(graph, step);
      setNodes(graph.nodes);
      setEdges(graph.edges);
    }}
    onNodesChange={onNodesChange}
  />
</Graph.Root>;
```

`onGraphChange(graph, step)` reports each finished edit once. `graph` is `{ nodes, edges }` after
the edit, and `step` is `{ type, nodes, edges }` with the ids of the nodes and edges the edit
touched:

| `type`    | Reported when                                                      | `nodes` and `edges`                  |
| --------- | ------------------------------------------------------------------ | ------------------------------------ |
| `connect` | A connection adds an edge                                          | The new edge                         |
| `move`    | A drag ends, or an arrow key moves the selected nodes              | The moved nodes                      |
| `remove`  | Delete, Backspace or an edge's remove control removes the elements | The removed nodes and the edges gone |

- A drag reports its step when it ends. A selection or a measurement is not an edit.
- The canvas does not report a connection that repeats an edge the graph has already.
- A removed node takes its edges with it, and the step lists them.
- The canvas calls the caller's `onConnect`, `onDelete` and `onNodesChange` before it reports, so a
  caller that applies React Flow's changes keeps doing so.
- `graph` is the canvas's `nodes` and `edges` with the edit applied.

`Graph.PaletteItem` is the actions `Button` in the outline look, for one kind of node:

- A drag writes the item's id into the drag's data. The canvas's `onDropItem(item, position)`
  reports the point where the pointer released it, in the graph's coordinates through React Flow's
  pan and zoom. A drop without a palette item, such as a file, is left to the browser.
- A press, Enter or Space calls `onAdd(item, position)` with the middle of what the canvas shows, so
  a person without a pointer adds a node too. The item renders inside `Graph.Root`.
- The caller adds the node. A node whose `origin` is `[0.5, 0.5]` is centred on the point.

### Nodes

`LabelNode` renders a node's data:

| Data field | Takes                                                      | Default                             |
| ---------- | ---------------------------------------------------------- | ----------------------------------- |
| `label`    | The title, which is also the node's accessible name        | Required                            |
| `subtitle` | A line under the title, such as the kind of step           | None                                |
| `detail`   | A line in the card's body                                  | None                                |
| `icon`     | A glyph before the title, hidden from assistive technology | None                                |
| `status`   | `{ label, palette }`: a dot in one of the eight palettes   | None                                |
| `invalid`  | Whether the card is edged in the error ink                 | `false`                             |
| `problem`  | The fault of an invalid node in one line under the body    | None                                |
| `inputs`   | `{ id, label, disabled, unused }` per port edges enter     | `In`, and none on an `input` node   |
| `outputs`  | `{ id, label, disabled, unused }` per port edges leave     | `Out`, and none on an `output` node |

A caller's own node type renders `Graph.Node` with the same props: `title`, `subtitle`, `icon`,
`status`, `actions`, `children` for the body, `invalid`, `problem`, `dimmed`, `tag`, `branch`,
`inputs`, `outputs` and its own `direction`.

```tsx
function Step({ data }: NodeProps<StepNode>) {
  return (
    <Graph.Node actions={<StepMenu step={data.step} />} subtitle={data.kind} title={data.label}>
      {data.summary}
    </Graph.Node>
  );
}

const nodeTypes = { ...Graph.nodeTypes, step: Step };
```

- The card is 256px wide. A status is the data package's `Status`, a dot beside its word, so a color
  is never the only signal. `dimmed` recedes the card by a dashed edge and a muted title.
- The actions are outside React Flow's drag surface, so a press on one does not move the node.
- `tag` renders above the card's top edge at its end, so a tag that comes and goes never changes the
  card's size. `branch` straddles the middle of the card's bottom edge, and the card keeps half a
  small control's height free under its last line.
- Inputs are on the side edges enter, the top while the graph runs down and the left while it runs
  right, and outputs are on the opposite side. The ports of one side are spread evenly along it.
- A side with two or more ports writes each port's name beside its handle. A side with one port
  hides its name visually and keeps it for a screen reader.
- A port starts and ends new connections while the canvas lets nodes connect and the port is not
  `disabled`. An edge refers to its ports through `sourceHandle` and `targetHandle`.
- React Flow measures a node's handles when it measures the node, and never measures a handle that
  mounts later. A node whose edges come and go keeps its ports and marks a port without an edge
  `unused`, which renders it invisible.

### Edges

On an editable canvas with `removeGlyph`, every edge renders the actions `IconButton` at its middle,
unless the edge states `deletable: false`. The control is named by the edge data's `removeLabel`,
else by the canvas's `removeName` over the names of the edge's ends, so an edge a person connects
has a control too:

```tsx
<Graph.Canvas
  edges={edges}
  label="Alert routing"
  nodes={nodes}
  removeGlyph={<XIcon />}
  removeName={({ source, target }) => t("remove", { source, target })}
/>
```

Without `removeName`, the control is named `Remove the connection from Webhook to Enrich customer`.
A press removes the edge through React Flow, which calls `onEdgesDelete` and `onEdgesChange` as the
Delete key does. The control leaves with its edge, so focus then moves to the node the edge left,
unless `onBeforeDelete` refused the removal.

An edge whose element has `data-trace="on"` renders in the ink twice as wide, and one with
`data-trace="off"` fades to the theme's backdrop opacity. `DirectedGraph` marks its edges this way
while a trace shows relations.

### Accessibility

- The figure is named by its caption, and React Flow's application element by `label`.
- Each node is a `group` named by its data's `label`, and each edge is named by the names of its
  ends, unless the node or the edge states its own `ariaLabel`.
- On an editable canvas every node and edge is described by the keys it takes: Enter and Space
  select, the arrow keys move a selected node, Delete removes and Escape clears the selection. A
  read-only canvas describes no keys, because its nodes can only be read.
- React Flow announces a move before it applies it, so the position it passes to `moveAnnouncement`
  is the one the node left. The default announcement states the direction.
- A focused node takes the focus ring around its card, and a focused or selected edge the focus ink
  twice as wide.
- Under forced colors the edges and the handles render in `CanvasText`, and a selected edge and a
  handle that takes connections in `Highlight`.

## DirectedGraph

```tsx
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

import { DirectedGraph, Graph } from "@stealthscale/component-graphs";

<DirectedGraph
  caption="Customer dimensions feed the executive overview and the churn features."
  controls={
    <Graph.Controls label="Lineage controls">
      <Graph.Control action="zoomIn" label="Zoom in">
        <PlusIcon />
      </Graph.Control>
      <Graph.Control action="zoomOut" label="Zoom out">
        <MinusIcon />
      </Graph.Control>
      <Graph.Control action="fit" label="Fit the graph in view">
        <MaximizeIcon />
      </Graph.Control>
      <Graph.ZoomLevel />
    </Graph.Controls>
  }
  defaultFocus="dim_customer"
  direction="right"
  edges={lineage}
  label="Revenue lineage"
  nodes={datasets}
  overview={<Graph.MiniMap label="Overview of the revenue lineage" />}
/>;
```

The graph is the caller's own shape. A node is `{ id, label, kind, icon, status, detail }` and an
edge is `{ id, source, target }`, whose id defaults to the ids of its ends joined by a hyphen.

| Prop                | Takes                                                                    | Default     |
| ------------------- | ------------------------------------------------------------------------ | ----------- |
| `nodes`, `edges`    | The graph, in any order                                                  | Required    |
| `label`             | The canvas's accessible name                                             | Required    |
| `focus`             | The focused node's id, controlled, or `null` for none                    | None        |
| `defaultFocus`      | The node focused on the first render                                     | None        |
| `onFocusChange`     | Called with the focused id, or `null` when the focus is dropped          | None        |
| `trace`             | `highlight`, `isolate` or `off`, what a focus does to the other nodes    | `highlight` |
| `depth`             | The number of hops each way a trace follows                              | Every hop   |
| `collapsible`       | Whether a node whose branch a press changes renders a control            | `false`     |
| `collapsed`         | The ids of the closed branches, controlled                               | None        |
| `defaultCollapsed`  | The ids of the branches closed on the first render                       | None        |
| `onCollapsedChange` | Called with the ids of the closed branches                               | None        |
| `controls`          | A toolbar above the canvas, such as `Graph.Controls`                     | None        |
| `overview`          | An overview map at the end of the readout's row, such as `Graph.MiniMap` | None        |
| `caption`           | The finding in words, which names the figure                             | None        |
| `direction`         | `down` or `right`, the way the edges run                                 | `down`      |
| `ratio`             | The canvas's ratio, one of the kit's ratios                              | `video`     |

Every other prop goes to the figure.

### Focus and trace

- A press on a node, Enter or Space focuses it. Escape, a press on the canvas's background or the
  readout's control clears the focus. One node at most is focused, because a modifier key does not
  add a second node and Shift does not start a selection box.
- `highlight` dims the nodes the trace leaves out and fades the edges off the traced path. `isolate`
  renders the focused node and the nodes it traced alone, laid out again. `off` keeps the focus as a
  selection and states no relation.
- Each related card states its relation, `Upstream`, `Downstream` or `Focus`, in a badge above its
  top edge, because both directions share a color. The node's accessible name ends with the same
  word. A node that is both upstream and downstream, which happens only in a cycle, is downstream.
- The readout below the canvas states the trace in the caller's words in an `output`, which a screen
  reader reads when it changes, and the prompt while nothing is focused. Its clear control is always
  rendered and is `aria-disabled` while nothing is focused, so a press that clears the focus keeps
  the keyboard focus on it.
- Nodes cannot be dragged, connected or removed, and edges are no tab stops.

### Branches

`collapsible` gives a node a control on its bottom edge while a press on it would hide or show
nodes. The control states the number of nodes a press changes and has `aria-expanded`. A press on it
leaves the focus where it is.

A closed node remains shown and hides every node that only routes through it lead to. A node shows
while a route from a root leads to it without passing a closed node, and a root is a node no edge
enters. This is an org chart's rule for a tree, and it applies to a graph where a node has more than
one parent. A cycle that no root leads to is shown whole.

`treeEdges(items, parentOf)` turns a flat list whose items state their parent's id into edges, and
leaves out a parent that is not an item:

```tsx
import { DirectedGraph, treeEdges } from "@stealthscale/component-graphs";

const edges = treeEdges(people, (person) => person.managerId);

<DirectedGraph
  collapsible
  edges={edges}
  label="Organisation chart"
  nodes={people.map((person) => ({ id: person.id, kind: person.title, label: person.name }))}
  trace="off"
/>;
```

### Layout

The canvas renders every node once, hidden, until React Flow has measured every node. It then lays
the nodes out with `layoutGraph` by their measured sizes and shows them once React Flow's store has
every node where the layout put it. A later change of what shows does not need a second measurement.
The view fits the layout whenever the layout moves a node. A change that moves no node, such as a
new focus, keeps the view where a person panned and zoomed it. A graph without a node renders its
message in the canvas's place, without the controls, the readout and the overview.

### Words

| Prop              | Writes                                                               | Default                             |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------- |
| `upstreamLabel`   | The word for a node that feeds the focus, and the name of each input | `Upstream`                          |
| `downstreamLabel` | The word for a node the focus feeds, and the name of each output     | `Downstream`                        |
| `focusLabel`      | The word for the focused node                                        | `Focus`                             |
| `summary`         | The readout from `{ name, upstream, downstream }`                    | `Revenue: 3 upstream, 2 downstream` |
| `promptLabel`     | The readout while nothing is focused                                 | A prompt to select a node           |
| `clearLabel`      | The readout's control                                                | `Clear focus`                       |
| `collapseLabel`   | A branch control from the number of nodes a press hides              | `Hide 5`                            |
| `expandLabel`     | A branch control from the number of nodes a press shows              | `Show 5`                            |
| `emptyLabel`      | The message while the graph has no node                              | `No nodes to show.`                 |
| `edgeName`        | An edge's name from the names of its ends                            | `Orders to Revenue`                 |
| `nodeDescription` | The instruction every node is described by                           | Enter, Space and Escape             |

### Functions

The graph traces and folds with these functions, which work without a canvas too, such as in a
deploy check that asks what a change breaks.

| Function                          | Returns                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `traceGraph(edges, id, depth)`    | `{ upstream, downstream }`, the ids each way within `depth` hops |
| `relationOf(id, focus, trace)`    | `focus`, `upstream`, `downstream` or `unrelated`                 |
| `descendantsOf(edges, id)`        | The ids of every node a node leads to                            |
| `hiddenBy(ids, edges, collapsed)` | The ids the closed branches hide                                 |
| `treeEdges(items, parentOf)`      | An edge from each item's parent to the item                      |

The focused node is in neither set of a trace, so a cycle that leads back to it does not make it its
own ancestor. Every walk stops at a node it visited before, so a cycle never hangs it.

## Comparing two versions

```tsx
import { diffGraphs, Graph } from "@stealthscale/component-graphs";

const diff = diffGraphs(before, after);

<Graph.Root>
  <Graph.Canvas
    changes={diff}
    edges={before.edges}
    label="Version 3"
    nodes={before.nodes}
    readOnly
  />
</Graph.Root>;
<Graph.Root>
  <Graph.Canvas changes={diff} edges={after.edges} label="Version 4" nodes={after.nodes} readOnly />
</Graph.Root>;
```

`diffGraphs(before, after, edgeName)` returns `{ nodes, edges }` with one entry for each node and
each edge of either version: `{ change, fields, id, label }`, where `change` is `added`, `changed`,
`removed` or `unchanged`.

- A node is the same node in both versions while its id is the same. It is changed while a field of
  its `data` differs, and `fields` names those fields in order.
- Each field is compared by its JSON with object keys sorted, so a node that only moved, or whose
  data lists its keys in another order, is unchanged. A React element in the data, such as an icon,
  is compared by its component and its props.
- An edge is the same edge in both versions while it joins the same ports of the same nodes, so an
  edge is added or removed, never changed. Its `id` is the edge's own, from the version it is in.
- A node's `label` is its data's string `label`, else its id. An edge's `label` comes from
  `edgeName` and the names of its ends in its version, `Source to Target` unless stated.
- The entries follow the later version's order, and the removed ones follow in the earlier version's
  order.

A canvas given `changes` marks every node and edge the comparison lists, so two canvases side by
side show what each version has that the other lacks:

- A card that was added, changed or removed takes the change as its tag: the data package's `Badge`
  in the success, warning or error palette with a mark, `+`, `~` or `−`, before the word. A card
  that states its own `tag` keeps it.
- An unchanged card recedes as `dimmed` does, unless it states `dimmed`.
- An added edge is the success ink twice as wide, a removed edge the error ink dashed and twice as
  wide, and an unchanged edge fades. Under forced colors every edge is `CanvasText`, and the dash
  still tells a removed edge apart.
- The name of an added, changed or removed node or edge ends with the change's word, because the tag
  and the ink are hidden from a screen reader.

The comparison is data, so a list of the changes composes from the collections `DataList` and the
data package's `Badge`, as the catalogue's change list does.

## NetworkGraph

```tsx
import { ServerIcon } from "lucide-react";

import { Graph, NetworkGraph } from "@stealthscale/component-graphs";

<NetworkGraph
  caption="Checkout writes to Kafka and Postgres, which the ledger reads."
  defaultFocus="checkout-api"
  label="Service topology"
  links={[
    { source: "api-gateway", strength: 2, target: "checkout-api" },
    { source: "checkout-api", strength: 2, target: "kafka-events" },
  ]}
  nodes={[
    { icon: <ServerIcon />, id: "api-gateway", label: "api-gateway", weight: 9 },
    { icon: <ServerIcon />, id: "checkout-api", label: "checkout-api", weight: 8 },
    { icon: <ServerIcon />, id: "kafka-events", label: "kafka-events", weight: 7 },
  ]}
  overview={<Graph.MiniMap label="Overview of the service topology" />}
/>;
```

A node is `{ id, label, weight, icon }` and a link `{ id, source, target, strength }`, in the
caller's own shape, and a link reads the same either way round. A link's id defaults to the ids of
its ends joined by a hyphen. A link whose end is not a node, or that joins a node to itself, is
neither rendered nor counted.

| Prop            | Takes                                                                    | Default  |
| --------------- | ------------------------------------------------------------------------ | -------- |
| `nodes`         | The graph's nodes, in any order                                          | Required |
| `links`         | The links between the nodes                                              | Required |
| `label`         | The canvas's accessible name                                             | Required |
| `focus`         | The focused node's id, controlled, or `null` for none                    | None     |
| `defaultFocus`  | The node focused on the first render                                     | None     |
| `onFocusChange` | Called with the focused id, or `null` when the focus is dropped          | None     |
| `depth`         | The number of hops from the focused node within which a node is lit      | `1`      |
| `draggable`     | Whether a person can move a node by dragging it or by the arrow keys     | `true`   |
| `seed`          | The number the layout starts from                                        | `1`      |
| `iterations`    | The number of the layout's steps                                         | `300`    |
| `controls`      | A toolbar above the canvas, such as `Graph.Controls`                     | None     |
| `overview`      | An overview map at the end of the readout's row, such as `Graph.MiniMap` | None     |
| `caption`       | The finding in words, which names the figure                             | None     |
| `ratio`         | The canvas's ratio, one of the kit's ratios                              | `video`  |

Every other prop goes to the figure.

### Discs and links

- A disc is 36px across for no weight and 68px for the heaviest node. Its area grows with the
  weight, so its diameter grows with the weight's square root. A node without a weight weighs the
  number of its links, and a weight under zero counts as zero.
- The icon renders inside the disc and is hidden from assistive technology. The name renders on a
  pill under the disc in the panel's color, so a link under it does not cross the letters.
- A link is a straight line between two disc centres, as many hairlines wide as its strength from 1
  to 2.

### Focus

- A press on a disc, Enter or Space focuses the node. Escape, a press on the canvas's background or
  the readout's control clears the focus. One node at most is focused.
- A focus lights the nodes within `depth` hops and dims the rest by a dashed disc and a muted name.
  A link between two lit nodes renders twice as wide, and every other link fades. The accessible
  name of the focused node ends with `focusLabel`, and that of each lit node with `neighborLabel`.
- The readout below the canvas states the focus in the caller's words in an `output`, and the prompt
  while nothing is focused. Its clear control is always rendered and is `aria-disabled` while
  nothing is focused.
- A person moves a node by dragging it, or moves the focused node with the arrow keys. A moved node
  keeps its position until the layout changes, such as for new data or a new seed, and a move leaves
  the view where it is. `draggable={false}` pins every node. Nodes cannot be connected or removed.
  Links are no tab stops.

### Layout

The same graph and seed give the same picture in every browser and theme, because the preset lays
the graph out with `layoutForce` from the data alone and ignores the sizes React Flow measures. Each
node is a box as wide as its disc or its name, whichever is wider, and as tall as the disc and the
name's line. A name is taken as 8.5px a character plus 8px of padding. Its line is taken as 26px.

- A name in a script with wider letters, such as Chinese or Japanese, can overlap a neighbouring
  name. For 79 Latin names in the ten themes in Firefox and Chromium, the circle the layout keeps
  clear around each box contains the rendered node to within 0.1px.
- A link is a straight line, even where it passes a disc it does not end at. Another `seed` gives
  another picture, which may have no such link.
- React Flow's viewport is hidden until React Flow has measured every node and its store has the
  layout. The view fits the layout then, and again whenever the layout moves a node. A focus moves
  no node and keeps the view where a person panned and zoomed it.

### Words

| Prop               | Writes                                                | Default                   |
| ------------------ | ----------------------------------------------------- | ------------------------- |
| `summary`          | The readout from `{ name, count }`                    | `Orders: 3 connections`   |
| `promptLabel`      | The readout while nothing is focused                  | A prompt to select a node |
| `clearLabel`       | The readout's control                                 | `Clear focus`             |
| `focusLabel`       | The word the focused node's accessible name ends with | `Focus`                   |
| `neighborLabel`    | The word a lit node's accessible name ends with       | `Connected`               |
| `emptyLabel`       | The message while the graph has no node               | `No nodes to show.`       |
| `edgeName`         | A link's name from the names of its ends              | `Orders and Billing`      |
| `nodeDescription`  | The instruction every node is described by            | The keys a node takes     |
| `moveAnnouncement` | The announcement of a move the arrow keys make        | The direction             |

`neighborsOf(links, id, depth)` returns the ids within `depth` hops of a node, following each link
both ways. It never counts the node it starts from, and stops at a node it visited before.

## Layouts

`layoutGraph(nodes, edges, options)` returns React Flow's nodes placed in ranks:

```ts
import { layoutGraph } from "@stealthscale/component-graphs";

const placed = layoutGraph(nodes, edges, { direction: "right" });
```

| Option      | Takes                                            | Default |
| ----------- | ------------------------------------------------ | ------- |
| `direction` | `down` or `right`, the way the edges run         | `down`  |
| `ranksep`   | The space between two ranks, in pixels           | `128`   |
| `nodesep`   | The space between two nodes of a rank, in pixels | `48`    |

- A node is placed by the size React Flow measured, else its `width` and `height`, else its
  `initialWidth` and `initialHeight`, else 256 by 44 pixels.
- Each node comes back with that size as its `initialWidth` and `initialHeight`, which React Flow
  applies until it measures the card and which the overview map sizes the node by. Each node also
  comes back with the sides its edges leave and enter: bottom and top when the edges run down, right
  and left when they run across.
- Dagre does not model ports. The targets of a node, and its sources, follow the order of their
  edges, so edges listed in their ports' order do not cross.
- An edge whose ends are not both nodes of the graph takes no part.

A caller that applies React Flow's measurements to its nodes lays them out again with the measured
sizes, for cards taller than 44 pixels. `DirectedGraph` does this for its own graph.

`layoutForce(nodes, links, options)` returns React Flow's nodes placed by a force simulation:

```ts
import { layoutForce } from "@stealthscale/component-graphs";

const placed = layoutForce(nodes, links, { seed: 6 });
```

| Option       | Takes                                   | Default |
| ------------ | --------------------------------------- | ------- |
| `seed`       | The number the start's order comes from | `1`     |
| `iterations` | The number of the simulation's steps    | `300`   |

- The simulation starts with each connected part as a tree around its most-linked node, one ring
  further out for each hop, in an order the seed shuffles. Linked nodes start close, so links seldom
  cross.
- A link pulls its ends 110px apart, and 55px apart at a `strength` of 2. Every node pushes the
  others away, and a collision keeps the circles around the nodes' boxes from overlapping.
- The pull to the middle is 3 times stronger up and down than across, so a picture is wider than
  tall, as a canvas is.
- A node is placed by its size as `layoutGraph` reads it, and comes back with that size as its
  initial size.
- The same graph and seed give the same positions. A link whose ends are not both nodes of the
  graph, or that joins a node to itself, takes no part.

## Not offered

- React Flow's own `Controls`, `MiniMap` over the canvas and `NodeToolbar`. `Graph.Controls` and
  `Graph.MiniMap` render beside the canvas, so no control covers a node.
- Labels on edges other than the remove control.
- Editing in `DirectedGraph`. Its nodes cannot be dragged, connected or removed.
- Connecting or removing in `NetworkGraph`, and curved links. A network's link is a straight line
  between two disc centres.
- An undo stack, a history list and a flow editor's inspector. `onGraphChange` gives a history each
  finished edit, and the list and its undo are the application's, as the catalogue's example shows.

## Licence

MIT. See [LICENSE](LICENSE).
