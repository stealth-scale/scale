---
"@stealthscale/specimen": minor
---

specimen: show a scene in a device of the size the viewport states

- Each scene is drawn in its card until the viewport states a width, and in a `Device` from then on:
  a window of that size, which is a frame loading the application at its framed page with the
  scene's address in the fragment. Everything the scene draws sees a window of the device's size,
  the styling engine's media queries and the parts that portal to the body included, which a box
  held to a width on the page could not give it. The devices are a phone at the smallest measure and
  the theme's breakpoints, each with a height: 320 × 568, 640 × 960, 768 × 1024, 1024 × 768, 1280 ×
  800 and 1536 × 864. The frame is the device's size and nothing else, the way a phone is, so a
  sample shorter than the window is drawn at its top and one taller scrolls inside it. It is
  see-through and edged with a dashed hairline, loads again when the page changes its theme, its
  mode or its language, and loads when it comes into view.
- Inside the window the scene is drawn in a `Pane` that meets the window the way the scene meets its
  card: an inset scene keeps the card's room from the edges and a bled or bared one fills the
  window. A scene declares `viewport: true` to fill the window whatever its frame, which is what a
  shell the height of its window needs.
- A device shows one sample at a time. Over a matrix it draws a picker per axis and over a board one
  picker over the samples, each starting at the first value and forgotten with the page. A scene of
  one sample gets no picker. The framed document reports the axes its scene offers to the page
  holding it, so the page draws the pickers, and a pick moves the frame's fragment, which the
  document follows without loading again.
- An application serves the framed page by naming it in `Placing.framed`, and `framedDeclaration` is
  the route `declarations` adds for it: at the root, in no layout, holding the sample and nothing
  else. Without it no scene is shown in a device. The kit's preset makes the root of a framed
  document see-through, so the sample is drawn on the card that holds the frame.
- `PHONE`, `widthsOf` and `deviceOf` are published, so a switcher in an application's bar offers the
  same widths the page knows and agrees with it on the pixels. `Stage` and `stageWidthOf` are gone.
- The package peers on `@stealthscale/component-disclosure` and `@stealthscale/provider-viewport`,
  and depends on `lucide-react` for the marks its own controls carry.

specimen: redraw a page in place when its specimen is saved

- `Page` and the framed page listen for the hot update the specimen plugin's boundary dispatches on
  the window, `specimen:updated`, and replace the page's scenes or its sources with what the new
  module declares. An edit to a specimen therefore redraws that page and nothing else, where it ran
  the application's own modules again before. `useLoadedPage` holds the loading and the listening.
