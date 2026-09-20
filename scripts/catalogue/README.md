# Catalogue scripts

Two commands that open a page of the catalogue in a browser and read it back, for building and
checking components. Both run straight from the shell under Node 26, which strips the types, so
there is nothing to build. Both need a catalogue that is already serving, on port 4100 unless
`--port` names another, which is how the earlier library on 5178 is read for a comparison.

```bash
pnpm shot -p actions/button -t asphalt,prism -m light,dark
pnpm dom -p actions/button -s looks --tree --depth 4
```

`pnpm shot --help` and `pnpm dom --help` list every option.

## Where a page is read

Both commands share the targeting. A theme, a colour mode, a width or a page can be named more than
once with commas, and the command runs every combination.

| Option             | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| `-p, --page`       | The page under `/components`, such as `actions/button`                   |
| `-s, --scene`      | A scene's title, part of it, or its number on the page                   |
| `-t, --theme`      | A theme, written into the page's settings before it loads                |
| `-m, --mode`       | `light` or `dark`, written the same way and set on the browser           |
| `-w, --width`      | The viewport's width, 3072 by default                                    |
| `--height`         | The viewport's height, 1400 by default                                   |
| `--scale`          | The device scale factor, 1.25 by default                                 |
| `--open`           | A selector to press before anything is read, so a panel it opens is open |
| `--press`          | Keys to type after `--open`, commas between them and `*` to repeat one   |
| `--reduced-motion` | Read the page as someone who asked for less motion                       |
| `--forced-colors`  | Read the page in a forced colours mode                                   |
| `-b, --browser`    | `chromium`, `firefox` or `webkit`, `firefox` by default                  |
| `--port`           | The catalogue's port, 4100 by default                                    |

The defaults are the catalogue as it is read: a 4K screen at 125% scaling, in Firefox.

## Capturing

`pnpm shot` writes one image per combination under `.scratch/shots`, named for the page, the scene,
the theme, the mode and the width.

| Option          | What it does                                                             |
| --------------- | ------------------------------------------------------------------------ |
| `-e, --element` | Capture the first visible element a selector finds rather than the scene |
| `--state`       | `rest`, `hover`, `focus` or `active`, one image each; needs `--element`  |
| `--margin`      | Room round a scene or an element for a ring or a shadow, 8px by default  |
| `-f, --full`    | Capture the whole page rather than to the fold                           |
| `-o, --out`     | Where the images go                                                      |

A control is put in a state the way a reader would put it there: hovered by the pointer, focused
from the keyboard with Tab, held down with the pointer. Animations are held still while capturing,
so two captures of one thing lay over each other. A scene narrows and `--element` picks within it,
so `[data-recipe=toolbar]` under a scene is the scene's toolbar and not the catalogue's own bar;
without a scene a selector reaches the whole document, which is how the chrome is captured.

```bash
pnpm shot -p actions/button -e "[data-recipe=button]" --state rest,hover,focus,active -b chromium
pnpm shot -p disclosure/menu --open "[data-recipe=menu] button" -e "[role=menu]"
pnpm shot -p layout/stack -s gaps -w 420,1024,3072
```

`--press` types once `--open` has pressed something. A component is then read part way through a
keyboard journey rather than at rest. A star repeats a key. One press says nothing about what the
twelfth does, and a reader crosses a long list by keeping the key down.

```bash
pnpm shot -p collections/listbox --open "#too-many-rows-to-draw [role=option]" --press "ArrowDown*14"
```

## Reading

`pnpm dom` prints an outline of the region: the headings, the landmarks, the controls with their
accessible names, a count of elements per recipe, any word left as the key it was looked up by, and
what the console reported. The region is the page, the scene named with `--scene`, or the elements
named with `--select`, within the scene where one is named. Everything else is read on request, and
once anything else is read the outline shrinks to the scenes and the console errors unless
`--outline` asks for the whole of it.

| Option        | What it does                                                                  |
| ------------- | ----------------------------------------------------------------------------- |
| `--outline`   | The whole outline beside another reading                                      |
| `--tree`      | The tree of elements: tag, recipe, classes, role, ARIA and state attributes   |
| `-d, --depth` | How deep the tree goes, 8 by default                                          |
| `--classes`   | `recipe` for the slot and variant classes alone, `all` for every class        |
| `--css`       | The computed style of each element a selector finds in the region             |
| `--css-all`   | Every computed property rather than the visual ones                           |
| `--rules`     | The rules that reach the first element a selector finds, least specific first |
| `--state`     | The state the element read by `--css` or `--rules` is put in first            |
| `--aria`      | The accessibility tree of the region, as a screen reader hears it             |
| `--axe`       | An accessibility audit of the region, the same one the testing kit runs       |
| `--box`       | The box of each element a selector finds in the region                        |
| `--tokens`    | Every custom property in force on the root, for the theme and the mode        |
| `-j, --json`  | JSON rather than text, for a diff                                             |

`--rules` reads the browser's devtools protocol and needs `--browser chromium`.

```bash
pnpm dom -p actions/button -s looks --rules "[data-recipe=button]" -b chromium
pnpm dom -p actions/button -s looks --css "[data-recipe=button]" --state hover -b chromium
pnpm dom -p forms/field --axe
pnpm dom -p actions/button --tokens -t asphalt -j > /tmp/asphalt.json
pnpm dom -p actions/button --tokens -t prism -j > /tmp/prism.json
diff /tmp/asphalt.json /tmp/prism.json
```
