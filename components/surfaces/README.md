# @stealthscale/component-surfaces

Renders the surfaces a page is built from.

Every value a theme can change is an axis of a component's recipe, so set it as a prop and write no
style. Change the element a component renders with `as`. A component with parts is published as a
namespace, `Card.Root`.

## Install

```bash
pnpm add @stealthscale/component-surfaces
```

The package peers on `react` and `@stealthscale/theme`. List the preset under `./theme` among the
presets your compiler installs.

## Card

A card stacks a picture, a header, content or sections, and a footer of controls on one panel.

```tsx
import { Button, IconButton } from "@stealthscale/component-actions";
import { Card } from "@stealthscale/component-surfaces";
import { EllipsisIcon, ReceiptTextIcon } from "lucide-react";

<Card.Root aria-labelledby="invoice-4821">
  <Card.Header>
    <Card.Indicator>
      <ReceiptTextIcon aria-hidden />
    </Card.Indicator>
    <Card.Title id="invoice-4821">Invoice 4821</Card.Title>
    <Card.Description>Issued on 2 September</Card.Description>
    <Card.Aside>
      <IconButton aria-label="More actions for invoice 4821" size="sm" variant="ghost">
        <EllipsisIcon aria-hidden />
      </IconButton>
    </Card.Aside>
  </Card.Header>
  <Card.Content>Three lines, one unbilled.</Card.Content>
  <Card.Footer>
    <Button size="sm">Send</Button>
  </Card.Footer>
</Card.Root>;
```

| Part          | Element   | What it renders                                                           |
| ------------- | --------- | ------------------------------------------------------------------------- |
| `Root`        | `article` | The panel. It resolves every variant                                      |
| `Media`       | `div`     | A picture that extends to the card's edges                                |
| `Overlay`     | `div`     | A layer over the picture, inside `Media`, for a badge or a caption        |
| `Header`      | `div`     | A three-column grid: indicator, title over description, aside             |
| `Indicator`   | `div`     | An icon or an avatar image at the start of the header                     |
| `Title`       | `h3`      | The card's heading                                                        |
| `Description` | `p`       | The line under the title                                                  |
| `Aside`       | `div`     | A control or a badge at the end of the header                             |
| `Content`     | `div`     | The body, which takes the height the other bands leave                    |
| `Section`     | `div`     | A band that extends to the side edges, with a rule to each band beside it |
| `Footer`      | `div`     | The controls                                                              |

| Axis          | Values                                                                             | Default    |
| ------------- | ---------------------------------------------------------------------------------- | ---------- |
| `variant`     | `elevated`, `outline`, `subtle`, `glass`, `plain`                                  | `elevated` |
| `palette`     | `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error` | none       |
| `size`        | `sm`, `md`, `lg`, `xl`                                                             | `md`       |
| `radius`      | the theme's corner radii                                                           | `l2`       |
| `orientation` | `vertical`, `horizontal`                                                           | `vertical` |
| `scrim`       | `true`                                                                             | off        |
| `divided`     | `true`                                                                             | off        |
| `justify`     | `start`, `center`, `end`, `between`, `around`, `evenly`                            | `end`      |
| `interactive` | `true`                                                                             | off        |
| `disabled`    | `true`                                                                             | off        |
| `effect`      | `glow`                                                                             | none       |
| `motion`      | `fade`, `rise`, `reveal`                                                           | none       |

### Name the card

Point `aria-labelledby` at the title's `id`, or pass `aria-label`. Pass `as="div"` for a card that
is part of its surroundings and does not need a name.

### Header

Put the indicator, the title, the description and the aside directly in `Card.Header`. The indicator
and the aside are centred on the title and description rows. An `img` in the indicator renders as a
round avatar of 32 to 56px by size, and an `svg` placed directly in it takes the icon size of the
card's size.

### Pictures

Put the picture in `Card.Media` with its alternative text, or `alt=""` when it is decorative. In a
vertical card the picture extends to both side edges, to the top edge as the first band, and to the
bottom edge as the last. In a horizontal card it covers the leading third at the card's full height.

Put a badge or a caption over the picture in `Card.Overlay`, after the image. Set `scrim` on the
root when the overlay contains text. It darkens the lower half of the picture and renders the
overlay in the dark color scheme.

```tsx
<Card.Root scrim>
  <Card.Media>
    <img alt="" src={cover} />
    <Card.Overlay>
      <Badge variant="solid">Engineering</Badge>
      <Text size="sm">6 min read</Text>
    </Card.Overlay>
  </Card.Media>
  <Card.Header>
    <Card.Title>How we settle payouts in two days</Card.Title>
  </Card.Header>
</Card.Root>
```

### Sections

Use `Card.Section` for rows of settings, a list of features or a summary. A section extends to the
card's side edges and keeps its content at the card's inset, so its text is aligned with the header.
It renders a hairline between itself and each band beside it, and two adjacent sections share one
rule. Each rule spans the card's full width with the inset above and below it. `divided` renders the
rules under the header and above the footer the same way.

### Interactive cards

Set `interactive` and put a link in the title. The link's hit area covers the whole card, and the
link keeps the focus and the accessible name. Other links and buttons in the card take their own
clicks. Do not put a click handler or a `tabindex` on the root, and do not put a second link in the
title.

```tsx
<Card.Root interactive>
  <Card.Header>
    <Card.Title>
      <Link href="/invoices/4821">Invoice 4821</Link>
    </Card.Title>
  </Card.Header>
</Card.Root>
```

Set `disabled` to render the card at the disabled opacity with no pointer events. The root sets
`aria-disabled`. The styles do not remove the title's link from the tab order, so render the title
without the link, or give the link `aria-disabled` and no `href`.

### Palettes

`palette` sets the palette of the focus ring and the glow. An `outline` card also sets its border to
the palette, and a `subtle` card fills with the palette's subtle color. The stylesheet contains
every palette whether a page uses it, so a value set at runtime has a class.

## Licence

MIT. See [LICENSE](LICENSE).
