# Catalogue scripts

The commands in this directory open catalogue pages in a browser and read them back. You use them to
build and review components. Node 26 strips the TypeScript types, so the commands run without a
build step. Each command reads a catalogue that is already serving, at `http://localhost:4100`
unless `--base` names another URL.

| Command       | What it does                                                         |
| ------------- | -------------------------------------------------------------------- |
| `pnpm shot`   | Captures a page, a scene or an element as PNG files                  |
| `pnpm dom`    | Prints the DOM, styles, rules, accessibility tree, boxes or measures |
| `pnpm review` | Runs the page review checks and exits with 1 on any fault            |

```bash
pnpm shot -p components/actions/button -t asphalt,prism -m light,dark
pnpm dom -p components/actions/button -s variant --tree --depth 4
pnpm review -p components/data/badge,components/data/tag
```

A page's id is its path under the base URL: `components/actions/button` is served at
`/components/actions/button`. The `components/` prefix is part of the id.

Run any command with `--help` to list its options.

## Targeting

All three commands take these options. Pages, themes, modes and widths accept comma-separated lists,
and the command runs every combination.

| Option             | What it does                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `-p, --page`       | Page id, such as `components/actions/button`                        |
| `-s, --scene`      | Scene title, part of it, or its position on the page                |
| `-t, --theme`      | Theme, written to the page's storage before it loads                |
| `-m, --mode`       | `light` or `dark`, written to storage and emulated in the browser   |
| `-w, --width`      | Viewport width, 1920 by default                                     |
| `--height`         | Viewport height, 1080 by default                                    |
| `--scale`          | Device scale factor, 1 by default                                   |
| `--open`           | Selectors to click before reading, separated by semicolons          |
| `--press`          | Keys to type after `--open`, separated by commas, `*` repeats a key |
| `--reduced-motion` | Emulates `prefers-reduced-motion: reduce`                           |
| `--forced-colors`  | Emulates `forced-colors: active`                                    |
| `-b, --browser`    | `chromium`, `firefox` or `webkit`, `firefox` by default             |
| `--base`           | Catalogue base URL, `http://localhost:4100` by default              |

`pnpm review` rejects `--scene`, because every check reads the whole page.

## Capturing

`pnpm shot` writes one file per combination under `.scratch/shots`. The file name contains the page,
the scene, the theme, the mode and the width.

| Option          | What it does                                                           |
| --------------- | ---------------------------------------------------------------------- |
| `-e, --element` | Captures the first visible match of a selector instead of the scene    |
| `--state`       | `rest`, `hover`, `focus` or `active`, one file each; needs `--element` |
| `--margin`      | Space around a scene or an element for a ring or a shadow, 8px default |
| `-f, --full`    | Captures the whole page instead of the fold                            |
| `-o, --out`     | Output directory                                                       |

The command hovers a control with the pointer, focuses it with Tab, and presses it with the pointer
held down. Animations are frozen, so two captures of one element overlay pixel for pixel. With
`--scene`, `--element` matches inside that scene only. Without `--scene`, it matches anywhere in the
document, which is how you capture the catalogue chrome.

```bash
pnpm shot -p components/actions/button -e "[data-recipe=button]" --state rest,hover,focus,active -b chromium
pnpm shot -p components/disclosure/menu --open "[data-recipe=menu] button" -e "[role=menu]"
pnpm shot -p components/layout/stack -s gaps -w 420,1024,3072
```

`--open` clicks each selector in order and waits for the next one to appear. Use it to reach a
control inside a panel, or a band on another tab.

```bash
pnpm shot -p components/disclosure/menu --open '[role=tab]:last-of-type; [data-scope=popover][data-part=trigger]'
```

`--press` types keys after `--open`. `ArrowDown*14` presses the key 14 times.

```bash
pnpm shot -p components/collections/listbox --open "#too-many-rows-to-draw [role=option]" --press "ArrowDown*14"
```

## Reading

`pnpm dom` prints an outline of the region: headings, landmarks, controls with their accessible
names, the element count per recipe, untranslated keys and console errors. The region is the page,
the scene named with `--scene`, or the elements `--select` matches. When you request another
reading, the outline shrinks to the scene titles and the console errors unless you add `--outline`.

| Option        | What it does                                                                |
| ------------- | --------------------------------------------------------------------------- |
| `--outline`   | Prints the whole outline beside another reading                             |
| `--tree`      | Prints the element tree: tag, recipe, classes, role, ARIA and state         |
| `-d, --depth` | Tree depth, 8 by default                                                    |
| `--classes`   | `recipe` for slot and variant classes, `all` for every class                |
| `--css`       | Computed style of each element the selector matches in the region           |
| `--css-all`   | Every computed property instead of the layout and paint subset              |
| `--rules`     | Rules matching the first element the selector matches, least specific first |
| `--state`     | State of the element `--css` or `--rules` reads                             |
| `--aria`      | Accessibility tree of the region                                            |
| `--axe`       | Axe audit of the region                                                     |
| `--box`       | Box of each element the selector matches in the region                      |
| `--measure`   | Text and icon measurements of the `--select` elements                       |
| `--tokens`    | Custom properties on the root for the theme and the mode                    |
| `-j, --json`  | JSON instead of text                                                        |

`--rules` reads the Chrome DevTools Protocol and needs `--browser chromium`.

```bash
pnpm dom -p components/actions/button -s variant --rules "[data-recipe=button]" -b chromium
pnpm dom -p components/actions/button -s variant --css "[data-recipe=button]" --state hover -b chromium
pnpm dom -p components/forms/field --axe
pnpm dom -p components/actions/button --tokens -t asphalt -j > /tmp/asphalt.json
pnpm dom -p components/actions/button --tokens -t prism -j > /tmp/prism.json
diff /tmp/asphalt.json /tmp/prism.json
```

## Measuring

`--measure` takes one or more kinds, separated by commas, and measures every element `--select`
matches. Values are CSS pixels. A centre offset is the ink centre minus the box centre, so a
positive offset has the larger x or y coordinate.

| Kind     | What it reports                                                                |
| -------- | ------------------------------------------------------------------------------ |
| `ink`    | Offset of the x-height centre and the cap-height centre from the box centre    |
| `glyph`  | Inset of the icon's ink from each edge, and the ink's centre offset            |
| `starts` | Viewport x of the first and last text ink, and their insets from the box edges |
| `gaps`   | Block and inline distance from each element to the next one matched            |

The icon is the element's first `svg`. Its ink is the geometry's bounding box plus half the stroke
width, so a 24-unit lucide icon at 16px reads its drawn edges, not its box.

```bash
pnpm dom -p components/data/badge -s marks --select ".badge" --measure ink,glyph
pnpm dom -p components/navigation/toc --select ".toc__title, .toc__link" --measure starts
```

## Reviewing

`pnpm review` runs seven checks on each page, in light and in dark unless `--mode` names a mode. It
prints one line per check and one indented line per fault, then exits with 1 when any check failed.
`--json` prints the same results as JSON.

| Check      | Fails when                                                                                |
| ---------- | ----------------------------------------------------------------------------------------- |
| `axe`      | Axe reports a violation. It runs the catalogue's scene rules plus the label-in-name rule  |
| `overflow` | A recipe slot's content is wider than its box                                             |
| `columns`  | Sibling rows of one list end their last part at distances more than 1px apart             |
| `sources`  | A scene has no Source, or its Source contains `{...props}`, `props.<name>` or `#` imports |
| `props`    | The Props tab lists no part within 15 seconds. A part without props of its own passes     |
| `raw keys` | Text renders as an untranslated key                                                       |
| `console`  | The page logs an error while the checks run                                               |

Every check reads the whole document, the catalogue chrome included. Axe reports two landmarks with
the same name even when one is in a scene and the other is in the chrome.
