# @stealthscale/component-media

The package renders pictures, clips, sound and embedded documents through six components: the
avatar, the carousel, the image cropper, the video, the audio element and the iframe. Each component
binds a recipe, so a theme restyles it by extending the recipe. The preset under `./theme` registers
the recipes with an application's compiler.

## Install

```bash
pnpm add @stealthscale/component-media
```

The package peers on `react`, `@stealthscale/theme`, `@stealthscale/hooks` and
`@stealthscale/component-actions`, whose `Button` the carousel's triggers are. It depends on
`@zag-js/avatar`, `@zag-js/carousel` and `@zag-js/image-cropper`, the Zag machines behind the
avatar, the carousel and the image cropper. The video, the audio element and the iframe render the
browser's own elements.

## Avatar

A box with a person's picture, or with their initials while the picture is missing, loading or
broken. The root runs the Zag avatar machine. The picture is hidden until it loads, and the initials
are hidden only once it has, so a slow or broken picture never leaves an empty box.

```tsx
import { Avatar } from "@stealthscale/component-media";

<Avatar.Root name="Ada Okafor">
  <Avatar.Fallback />
  <Avatar.Image src="/people/ada.webp" />
</Avatar.Root>;
```

| Part       | Element | What it renders                                                                    |
| ---------- | ------- | ---------------------------------------------------------------------------------- |
| `Root`     | `span`  | The box. It takes the name, the machine options and the variants                   |
| `Image`    | `img`   | The picture, which covers the box once it loads                                    |
| `Fallback` | `span`  | Its children, or the initials of the root's name                                   |
| `Badge`    | `span`  | A dot, a count, an emoji or an icon pinned to a corner of the box                  |
| `Group`    | `span`  | A row of avatars that overlap. It gives its variants to every avatar that has none |

| Axis      | Values                                                             | Default  |
| --------- | ------------------------------------------------------------------ | -------- |
| `size`    | `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`                         | `md`     |
| `shape`   | `circle`, `rounded`, `square`                                      | `circle` |
| `variant` | `solid`, `subtle`, `surface`, `outline`                            | `subtle` |
| `palette` | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | neutral  |
| `effect`  | `glow`, `pulse`                                                    | none     |

The side of the box is a control height, so an avatar is as tall as a button of the same size: 32,
36, 40, 44, 48 and 56px from `xs` to `2xl`. `2xs` is 24px, for a byline or a list row. The initials
take the label style of that size.

The initials are the first letter of the first word and of the last word of `name`. A letter is a
grapheme cluster, so an accented or composed letter is kept whole. Pass children to `Fallback` for
anything else: an icon for a service, or a count for a group.

### Accessibility

- With `name`, the root is an image named by the name: `role="img"` with `aria-label`. Without
  `name`, the root has no role. Name the picture through `alt` on `Image` instead.
- `Image` sets `alt` to an empty string by default, because the root's `name` is the avatar's
  accessible name.
- Beside the same name in words, set `aria-hidden` on the root, so a screen reader reads the name
  once.

```tsx
<Text>
  <Avatar.Root aria-hidden name="Ada Okafor" size="2xs">
    <Avatar.Fallback />
    <Avatar.Image src="/people/ada.webp" />
  </Avatar.Root>{" "}
  Ada Okafor commented 2 hours ago
</Text>
```

### Badges

`Avatar.Badge` goes inside `Avatar.Root` and is pinned to one of its corners. Without children it is
a status dot. With a count, an emoji or an icon it grows around its content.

```tsx
<Avatar.Root name="Ada Okafor">
  <Avatar.Fallback />
  <Avatar.Image src="/people/ada.webp" />
  <Avatar.Badge label="Online" palette="success" />
</Avatar.Root>;
<Avatar.Root name="Bram Voss">
  <Avatar.Fallback />
  <Avatar.Badge label="3 unread messages" palette="error" placement="top-end">
    3
  </Avatar.Badge>
</Avatar.Root>;
<Avatar.Root name="Cleo Han">
  <Avatar.Fallback />
  <Avatar.Badge label="On holiday" variant="subtle">
    🌴
  </Avatar.Badge>
</Avatar.Root>;
```

| Axis        | Values                                                             | Default      |
| ----------- | ------------------------------------------------------------------ | ------------ |
| `placement` | `top-start`, `top-end`, `bottom-start`, `bottom-end`               | `bottom-end` |
| `palette`   | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | neutral      |
| `variant`   | `solid`, `subtle`                                                  | `solid`      |

The badge centres on the point where the avatar's diagonal crosses its rim, so half of it covers the
picture. An empty badge is a dot, 28% of the avatar's side and never under 8px. Content makes it 40%
of the side and never under 16px, and a longer count widens it into a pill. An outline in `bg.panel`
cuts it away from the picture. The badge takes its own palette and look, apart from the avatar's.

With `label`, the badge is an image named by the label, and its ID joins the avatar's
`aria-describedby`. A named avatar is an image whose children are not read, so a screen reader reads
the label as the avatar's description, after the name. Without `label` the badge is hidden from
screen readers. Leave it out only where the same state is written beside the avatar in words.

### Groups

`Avatar.Group` overlaps each avatar with the one before it by a quarter of its side, and rings each
avatar in the panel's ground. Show the people left out as a last avatar with a count, named for
them:

```tsx
<Avatar.Group size="sm">
  {people.map((person) => (
    <Avatar.Root key={person.id} name={person.name}>
      <Avatar.Fallback />
      <Avatar.Image src={person.picture} />
    </Avatar.Root>
  ))}
  <Avatar.Root name="3 more">
    <Avatar.Fallback>+3</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>
```

### Machine options

The root takes the machine's `id`, `ids` and `onStatusChange` options. `onStatusChange` reports
`loaded` when the picture loads and `error` when it fails. To load another picture, change `src` on
`Image`. The machine's `setSrc`, `setLoaded` and `setError` methods are not offered.

### Not offered

- A default icon in the fallback. A component takes its glyphs from the caller, so a caller passes
  the icon as the fallback's children.
- A color picked from the name. Set `palette` per avatar.

## Carousel

Slides in a scroller that snaps a page at a time. Triggers move a page, dots pick one, and a
rotation control starts and stops a carousel that plays by itself. The root runs the Zag carousel
machine.

```tsx
import { Carousel } from "@stealthscale/component-media";

<Carousel.Root aria-label="Landscapes" controls="overlay" loop slideCount={pictures.length}>
  <Carousel.ItemGroup>
    {pictures.map((picture, index) => (
      <Carousel.Item index={index} key={picture.src}>
        <img alt={picture.alt} src={picture.src} />
      </Carousel.Item>
    ))}
  </Carousel.ItemGroup>
  <Carousel.Control>
    <Carousel.PrevTrigger>
      <ChevronLeftIcon />
    </Carousel.PrevTrigger>
    <Carousel.IndicatorGroup>
      <Carousel.Indicators />
    </Carousel.IndicatorGroup>
    <Carousel.NextTrigger>
      <ChevronRightIcon />
    </Carousel.NextTrigger>
  </Carousel.Control>
</Carousel.Root>;
```

| Part                | Element  | What it renders                                                          |
| ------------------- | -------- | ------------------------------------------------------------------------ |
| `Root`              | `div`    | The region the machine runs. It takes the options and the variants       |
| `ItemGroup`         | `div`    | The scroller that snaps a page at a time                                 |
| `Item`              | `div`    | The slide at `index`. A picture that is its child covers it              |
| `Control`           | `div`    | The row of controls, beside the slides or over them                      |
| `PrevTrigger`       | `button` | The library's square `Button`, which moves to the previous page          |
| `NextTrigger`       | `button` | The library's square `Button`, which moves to the next page              |
| `IndicatorGroup`    | `div`    | The group of dots                                                        |
| `Indicator`         | `button` | A dot, which moves to the page at `index`                                |
| `Indicators`        | none     | A dot per page                                                           |
| `AutoplayTrigger`   | `button` | The rotation control, the library's square `Button`                      |
| `AutoplayIndicator` | none     | The caller's `play` or `pause` glyph, whichever action the control takes |
| `ProgressText`      | `span`   | The current page over the number of pages, "2 / 5"                       |

| Axis       | Values                                                             | Default   |
| ---------- | ------------------------------------------------------------------ | --------- |
| `controls` | `outside`, `overlay`                                               | `outside` |
| `palette`  | `primary`, `secondary`, `accent`, `neutral`, and the four statuses | neutral   |
| `radius`   | `l1`, `l2`, `l3`                                                   | `l3`      |
| `ratio`    | the theme's seven aspect ratios                                    | none      |

- `controls="outside"` lays the controls in a row under the slides, or beside them in a vertical
  carousel. `controls="overlay"` puts the triggers at the sides of the slides and the dots on a
  `bg.panel` pill at the bottom, and the triggers take the `surface` look.
- A dot is a 24px target around an 8px mark in the palette's `border` role. The current page's dot
  is a 20px pill in the palette's solid.
- `ratio` sets the scroller's shape. A vertical carousel needs a height, so its scroller takes the
  `landscape` ratio unless `ratio` sets another.

### Options

The root takes every option of the Zag carousel machine except `translations`: `slideCount`
(required), `page`, `defaultPage`, `onPageChange`, `orientation`, `slidesPerPage` (1),
`slidesPerMove` (`auto`, the slides of a page), `spacing`, `padding`, `loop`, `autoplay` (`true` for
every 4000ms, or `{ delay }`), `allowMouseDrag`, `snapType`, `autoSize`, `inViewThreshold` (0.6),
`onDragStatusChange`, `onAutoplayStatusChange`, `dir`, `id` and `ids`.

- `spacing` defaults to the theme's `gap.md` between slides.
- `loop` defaults to `true` while `autoplay` is set, and to `false` otherwise.
- `page` and `onPageChange` control the page from outside the root.

### Rotation

The rotation follows the APG carousel pattern.

- `autoplay` starts the rotation, unless the reader asks the system for reduced motion.
- Keyboard focus that enters the carousel stops the rotation, and it stays stopped until the reader
  starts it with the rotation control.
- A pointer over the carousel pauses the rotation until it leaves, unless the reader started the
  rotation with the control.
- The rotation control's name states its action, "Stop slide rotation" or "Start slide rotation",
  and follows the reader's choice rather than a pause under the pointer. Pass `startLabel` and
  `stopLabel` in the reader's language, and put the control first among the carousel's controls.

### Accessibility

- The machine makes the root a `region` with the role description "carousel". Name it with
  `aria-label`.
- The machine makes a slide a `group` with the role description "slide", named "1 of 5" unless the
  slide takes `aria-label` or `aria-labelledby`. A slide out of the scroller's view is `inert`, so
  its controls leave the tab order.
- The scroller is a polite live region while the carousel does not rotate. It is in the tab order
  while no slide holds a control. While it has focus, the arrow keys of its orientation, Home and
  End move a page, swapped under `dir="rtl"`.
- While a dot has focus, the same keys move a page and focus moves to the new page's dot. The
  current page's dot sets `aria-disabled`, as the APG pattern marks the picker of the slide in view.
- The triggers are named "Previous slide" and "Next slide" unless they take `label`. At an end of a
  carousel that does not loop, a trigger sets `aria-disabled` and keeps focus.
- Under reduced motion, a trigger, a dot or a key moves the page at once.

### Machine behaviour

- The machine's own keys on the scroller are switched off. They page on Left and Right only, in a
  vertical carousel too, ignore `dir`, and act while focus is on a control inside a slide.
- The machine ignores a drag that starts while the scroller has focus. The carousel starts it, as it
  does while the scroller has no focus.

### Not offered

- The machine's `translations`. The parts take their words as props, with the machine's English as
  the default.
- A provider that runs the machine outside the root. `page` and `onPageChange` control the page from
  outside.

## Image cropper

A picture in a viewport with a selection over the part to keep. A pointer drags the selection and
resizes it by its handles, and the arrow keys move it. The picture zooms, turns, flips and pans
under the selection. The application starts the machine with `ImageCropper.useImageCropper` and
passes the api to the root, so its own controls outside the root, such as a zoom button or a save
button, call the same api.

```tsx
import { ImageCropper } from "@stealthscale/component-media";

function ProfileCropper() {
  const cropper = ImageCropper.useImageCropper({ aspectRatio: 1, cropShape: "circle" });

  return (
    <ImageCropper.Root aria-label="Crop your profile picture" cropper={cropper}>
      <ImageCropper.Viewport>
        <ImageCropper.Image src="/people/ada.webp" />
        <ImageCropper.Selection>
          {ImageCropper.handles.map((position) => (
            <ImageCropper.Handle key={position} position={position} />
          ))}
          <ImageCropper.Grid axis="horizontal" />
          <ImageCropper.Grid axis="vertical" />
        </ImageCropper.Selection>
      </ImageCropper.Viewport>
    </ImageCropper.Root>
  );
}
```

| Part        | Element | What it renders                                                                       |
| ----------- | ------- | ------------------------------------------------------------------------------------- |
| `Root`      | `div`   | The group. It takes `cropper`, the description's words and the variants               |
| `Viewport`  | `div`   | The box that clips the picture. A press outside the selection pans the picture        |
| `Image`     | `img`   | The picture, as wide as the viewport at its own ratio                                 |
| `Selection` | `div`   | The crop, a slider in the tab order, with the picture outside it dimmed               |
| `Handle`    | `div`   | A handle that resizes the selection from the edge or corner `position` names          |
| `Grid`      | `div`   | Two lines of thirds along `axis`, shown while the selection moves or the picture pans |

`ImageCropper.handles` lists the eight positions, from `nw` clockwise to `w`.

| Axis     | Values           | Default |
| -------- | ---------------- | ------- |
| `radius` | `l1`, `l2`, `l3` | `l2`    |

The picture sets the viewport's shape. The image spans the viewport's width at its own ratio,
because the machine measures the image's box for the crop it exports. The axis leaves out `full`,
because a fully round viewport clips the selection's corners and their handles.

### Options

`useImageCropper` takes every option of the Zag image cropper machine except `translations`.

| Option                                                             | Default     | What it sets                                                       |
| ------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------ |
| `aspectRatio`                                                      | none        | The crop's width over its height                                   |
| `cropShape`                                                        | `rectangle` | `circle` for a round crop in a square                              |
| `initialCrop`                                                      | see below   | The crop in the viewport's pixels once the picture loads           |
| `minWidth`, `minHeight`                                            | 40          | The smallest crop in pixels                                        |
| `maxWidth`, `maxHeight`                                            | none        | The largest crop in pixels                                         |
| `fixedCropArea`                                                    | `false`     | Keeps the crop in place. A drag and the arrow keys pan the picture |
| `defaultZoom`, `zoom`                                              | 1           | The zoom, uncontrolled or controlled                               |
| `minZoom`, `maxZoom`                                               | 1, 5        | The zoom's range                                                   |
| `zoomStep`                                                         | 0.1         | The zoom step of the plus and minus keys and of the wheel          |
| `zoomSensitivity`                                                  | 2           | The exponent a pinch's scale is raised to                          |
| `defaultRotation`, `rotation`                                      | 0           | The rotation in degrees, uncontrolled or controlled                |
| `defaultFlip`, `flip`                                              | no flip     | The horizontal and the vertical flip                               |
| `nudgeStep`, `nudgeStepShift`, `nudgeStepCtrl`                     | 1, 10, 50   | The arrow keys' step in pixels: alone, with Shift and with Control |
| `onCropChange`, `onZoomChange`, `onRotationChange`, `onFlipChange` | none        | Called with the new value                                          |
| `id`                                                               | generated   | The prefix of every part's ID                                      |
| `ids`, `dir`, `getRootNode`                                        | none        | Part IDs, the direction and the root node                          |

Without `initialCrop`, the crop is the largest crop of the aspect ratio inside 80% of the viewport,
centred.

### The api

- `crop`, `zoom`, `rotation`, `flip`, `offset`, `naturalSize`, `viewportRect`, `dragging` and
  `panning` report the state.
- `setZoom`, `zoomBy`, `setRotation`, `rotateBy`, `setFlip`, `flipHorizontally`, `flipVertically`,
  `resize(position, delta)` and `reset` change it.
- `getCropData()` returns the crop in the picture's own pixels, with the rotation and the flip.
- `getCroppedImage({ type, quality, maxSize, output })` renders the crop to a canvas. It resolves to
  a `Blob`, to a data URL with `output: "dataUrl"`, or to `null` before the picture loads. A round
  crop exports its square, so the caller rounds the picture it shows, as an avatar does.

### Accessibility

- The machine makes the root a `group` named "Image cropper". Name it for the picture with
  `aria-label`.
- The machine describes the zoom, the rotation and the crop in English through the root's
  `aria-description`, and marks the root `aria-busy` while the picture loads. `description(details)`
  returns the description in the reader's language from the crop in whole pixels, the zoom and the
  rotation. `loadingDescription` replaces it while the picture loads.
- The selection is a `slider` in the tab order. The arrow keys move the crop, Alt with an arrow
  moves its east or south edge, plus and minus zoom, and Shift or Control take larger steps. With
  `fixedCropArea` the arrow keys pan the picture. The selection takes `aria-label`,
  `aria-roledescription` and `aria-description` for its words, and `valueText(crop)` for its
  `aria-valuetext`.
- The picture, the handles and the grid are hidden from assistive technology.
- Moving the crop takes a drag or the arrow keys. The api has no method that moves the crop, so an
  application cannot offer a single-pointer alternative for moving it (WCAG 2.5.7). `resize` and the
  zoom, rotation and flip methods each take a button.
- A handle on the viewport's edge takes a press only on its half inside the viewport, because the
  viewport clips the picture and everything over it.

### Machine behaviour

- A turn changes neither the zoom nor the crop. A quarter turn of a landscape picture in a landscape
  viewport leaves empty bands beside the picture, which the crop can cover.

### Not offered

- The machine's `translations`. The parts take their words as props, with the machine's English as
  the default.

## Video

A `video` element that keeps its shape before the clip's metadata loads, and follows three rules for
a clip that starts by itself.

```tsx
import { Video } from "@stealthscale/component-media";

<Video controls poster="/tour.webp" preload="metadata" src="/tour.webm" />;
```

| Axis     | Values                                                                    | Default |
| -------- | ------------------------------------------------------------------------- | ------- |
| `ratio`  | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide` | `video` |
| `fit`    | `cover`, `contain`                                                        | `cover` |
| `radius` | `l1`, `l2`, `l3`, `full`                                                  | `l3`    |

`VideoPropsProvider` sets the variants on every video below it.

- The element keeps the ratio's shape from the first paint, 16:9 by default, so nothing below it
  moves when the metadata loads. `cover` crops the clip to the shape, and `contain` shows the whole
  clip between bars in `bg.emphasized`, which also shows while the poster loads. A hairline edge
  bounds pale footage.
- `autoPlay` starts the clip only while the reader does not ask for reduced motion
  (`prefers-reduced-motion: reduce`). The video reads the setting before the first paint and again
  when it changes. A server render leaves out `autoplay`.
- A clip with `autoPlay` shows the browser's controls unless `controls={false}`. Moving content that
  starts by itself and runs longer than 5 seconds needs a way to pause it (WCAG 2.2.2). A caller who
  turns the controls off renders a pause button of its own, which calls the element's `pause()`
  through a ref.
- A clip that starts by itself is muted and sets `playsInline`, because a browser starts only a
  muted clip unasked, and a phone plays an inline clip in the page. The video keeps a caller's
  `playsInline`.
- A clip with speech takes a `track` with `kind="captions"` as a child (WCAG 1.2.2).
- Not offered: a control bar of the library's own, because the browser's controls work with a
  keyboard and a screen reader already. The `fill`, `none` and `scale-down` fits.

## Audio

An `audio` element with the browser's controls, as wide as its container.

```tsx
import { Audio } from "@stealthscale/component-media";

<Audio aria-label="Voice memo from Ada" preload="metadata" src="/memo.webm" />;
```

The recipe has no axes. The browser draws the controls, and their colors follow the page's
`color-scheme`.

- The controls are on unless `controls={false}`. Sound that plays for more than 3 seconds needs a
  way to stop it (WCAG 1.4.2), and the browser does not render an `audio` element without controls.
  A caller who turns them off renders controls of its own, which call the element's `play()` and
  `pause()` through a ref.
- `autoPlay` is passed as given. It starts sound, not motion, so reduced motion does not gate it,
  and a browser starts sound only after the reader has interacted with the page.
- Speech needs a transcript in the page beside the player (WCAG 1.2.1), because the transcript is
  the only way a reader who cannot hear the recording gets its words.
- Name the element with `aria-label` or `aria-labelledby`.
- Not offered: a control bar of the library's own, for the reason the video gives. A radius, which
  clips Chromium's control panel.

## Iframe

An `iframe` for a document the application does not control, such as a customer's email template or
a partner's widget. It is sandboxed by default and keeps one of the theme's ratios before its
document loads.

```tsx
import { Iframe } from "@stealthscale/component-media";

<Iframe ratio="portrait" srcDoc={template} title="Preview of the March invoice email" />;
```

| Axis     | Values                                                                    | Default |
| -------- | ------------------------------------------------------------------------- | ------- |
| `ratio`  | `square`, `landscape`, `portrait`, `golden`, `video`, `wide`, `ultrawide` | `video` |
| `radius` | `l1`, `l2`, `l3`                                                          | `l3`    |

`radius` leaves out `full`, because a framed document's content reaches the frame's corners and a
fully round corner clips it.

- `sandbox` defaults to the empty value, which denies the document scripts, forms, popups and
  same-origin access. Widen it one capability at a time, such as `sandbox="allow-scripts"` for a
  widget that needs scripts. A document from the page's own origin with `allow-scripts` and
  `allow-same-origin` can remove its own sandbox. Never grant both to such a document.
- `referrerPolicy` defaults to `no-referrer`, so the framed origin is not told which page framed it.
- `loading` defaults to `lazy`, which lets the browser defer a frame below the fold until the reader
  scrolls near it.
- The frame sets no `allow`, so it is delegated no permission the page has, such as the camera or
  geolocation. Pass `allow` to delegate one.
- `title` is required, because it is the frame's accessible name. State what the frame shows.
- The box is `bg.panel` with a hairline edge until the document paints over it.

### Focus

Firefox and Chromium give a frame's document a tab stop, and a control inside the document takes
focus as it does on a page of its own. While a frame's document has focus, both browsers match no
focus pseudo-class on the `iframe` element and fire no focus event at it. The frame draws no focus
ring. A framed document draws the rings of its own controls.

## Licence

MIT. See [LICENSE](LICENSE).
