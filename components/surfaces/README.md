# @stealthscale/component-surfaces

Draws the surfaces a page is built from.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component draws with `as`. A component with parts is published as a
namespace, `Card.Root`.

## Install

```bash
pnpm add @stealthscale/component-surfaces
```

The package peers on `react` and `@stealthscale/theme`. List the preset under `./theme` among the
presets your compiler installs.

## Card

Draws a panel a reader takes in on its own: a picture, a header, the substance, and whatever they
act on.

```tsx
import { Card } from "@stealthscale/component-surfaces";

<Card.Root aria-labelledby="invoice-4821">
  <Card.Media>
    <img alt="" src="/invoice.png" />
  </Card.Media>
  <Card.Header>
    <Card.Indicator aria-hidden>●</Card.Indicator>
    <Card.Title id="invoice-4821">Invoice 4821</Card.Title>
    <Card.Description>Issued on 2 September</Card.Description>
    <Card.Aside>
      <IconButton aria-label="More" />
    </Card.Aside>
  </Card.Header>
  <Card.Content>Three lines, one unbilled.</Card.Content>
  <Card.Footer>
    <Button>Send</Button>
  </Card.Footer>
</Card.Root>;
```

| Axis          | Values                                                  | Default    |
| ------------- | ------------------------------------------------------- | ---------- |
| `variant`     | `elevated`, `outline`, `subtle`, `glass`                | `elevated` |
| `size`        | `sm`, `md`, `lg`, `xl`                                  | `md`       |
| `orientation` | `vertical`, `horizontal`                                | `vertical` |
| `radius`      | `l1`, `l2`, `l3`, `full`                                | `l2`       |
| `justify`     | `start`, `center`, `end`, `between`, `around`, `evenly` | `end`      |
| `status`      | `info`, `success`, `warning`, `error`                   | none       |
| `motion`      | `fade`, `rise`, `reveal`                                | none       |
| `divided`     | `true`                                                  | off        |
| `interactive` | `true`                                                  | off        |

| Part          | Element   | What it draws                                   |
| ------------- | --------- | ----------------------------------------------- |
| `Root`        | `article` | The panel, and the variants every band reads    |
| `Media`       | `div`     | A picture, bled to the card's edges             |
| `Header`      | `div`     | A grid of three columns                         |
| `Indicator`   | `div`     | A glyph or avatar, in the header's first column |
| `Title`       | `h3`      | What the card is called                         |
| `Description` | `p`       | The line under the title                        |
| `Aside`       | `div`     | Controls, against the header's end              |
| `Content`     | `div`     | The substance, which takes the room left over   |
| `Footer`      | `div`     | Whatever a reader acts on                       |

Name a card that stands on the page. Point `aria-labelledby` at the title's `id`, or state
`aria-label`. Take `as="div"` for a card that is part of its surroundings and needs no name.

Put the indicator, the title, the description and the aside directly in the header. It lays them out
on a grid, so a card with no indicator or no aside needs no other arrangement.

Alternative text stays on the picture inside `Card.Media`. A decorative picture states `alt=""`.

Set `interactive` and put a real link in the title for a card a reader presses:

```tsx
<Card.Root interactive>
  <Card.Header>
    <Card.Title>
      <Link to="/invoices/4821">Invoice 4821</Link>
    </Card.Title>
  </Card.Header>
</Card.Root>
```

The whole card follows the link and shows its focus, while the link alone carries the name and the
behaviour. Do not put a press handler or a `tabindex` on the root, and put no second link in the
title.

Set `divided` to rule the header and the footer apart from the band between them.

## Licence

MIT. See [LICENSE](LICENSE).
