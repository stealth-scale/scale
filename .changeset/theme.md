---
"@stealthscale/theme": minor
---

- Add `defineTheme`, which builds a theme from a statement on nine axes: `colors`, `faces`, `type`,
  `metrics`, `motion`, `shape`, `depth`, `looks` and recipe extensions.
- Derive every surface, ink, line, palette role and status from a root theme's pages, inks and
  `primary`.
- Merge a derived theme's statement over its parent's and derive the axes again from the whole.
- Publish the theme engine: `drawColors`, `drawAxes`, `inked`, `drawn`, `intents`, `hues`, `coded`,
  `canonical`, `ladderOf`, `typeScale`, `metrics`, `shape`, `depth` and `faces`, with `FOUNDATION`,
  `PAGES`, `RATIOS`, `HAIRLINES`, `STATUS_HUES` and `RAMPS`.
- Publish the color arithmetic: `lightened`, `atChroma`, `polar`, `lightnessOf`, `inGamut`,
  `referenced`, `scaleOf`, `stepOf`, `mixed`, `stated`, `contrast`, `luminance`, `linear` and
  `oklab`.
- Add `axis(values, write)`, which writes an axis helper from an axis's values.
- Scale every control, icon, tag, inset and gap by `--density`, which `data-density` sets to 0.9 for
  `compact` and 1.1 for `comfortable`.
- Add `dense()` for a recipe that reads a scaled length.
- Add the `motion` axis, `pace` and the `press`, `enter`, `leave` and `move` curves, computed by
  `tempo()`.
- Add the heading, label and body roles to the `type` axis, computed by `roles()`.
- Add `ring.width`, `ring.offset` and stated corners to the `shape` axis.
- Add `narrow`, `wide` and `prose` to the `metrics` axis.
- Take a list of intents in `colors.keep`.
- Add `colors.ratios.hairline`, `colors.chroma` and `colors.wells`.
- Derive a status the theme leaves unstated at the chroma of its most saturated intent, 0.1 at
  least.
- Move a status in lightness until it clears every solid derived before it.
- Add `FLOOR` and `ratiosOf()`, which keep a stated ratio at WCAG AA or above.
- Label a solid in black or white where neither the theme's ink nor its page reads on it.
- Measure a contrast ratio on the color a display shows.
- Throw an error with the value of a malformed color.
- Derive the code inks at the text ratio on the page and the panel.
- Stop a theme's rules at the nearest nested theme.
- Merge a partial look into the derived looks at every level.
- Honour `colors.keep` in the status solver.
- Paint the selection and a native control's accent in the accent palette.
- Take the statuses a recipe offers in `statusVariants()`, `fieldStatusVariants()` and
  `statusEmitted()`.
- Refuse `defaultVariants`, `jsx` and `staticCss` in a theme's recipe extension.
- Raise the panel and the popover above the page, and sink the wells below it.
- Lift a palette's fills towards the ink at one lightness.
- Derive the faded inks and the lines from ratios: `fg.muted` at 7:1, `fg.subtle` at 4.5:1, `border`
  at 1.45:1 and `border.emphasized` at 3:1.
- Move a hovered solid away from its label and a hovered line towards the ink.
- Derive the intents from colors, and read `fg.link` and `border.focus` from the accent.
- Breaking: remove `bg` and `fg.muted` from a palette's roles, and `bg.disabled` and `fg.disabled`
  from the families.
- Make the hue palettes optional in `ThemeColors`.
- Add a `chart` role to every palette.
- Add the `series` family, `series.1` to `series.8`, and `SERIES`.
- Add the `code` family, the ten inks `CODE` lists.
- Add `borderWidths.hairline`, `borderWidths.control` and `borderWidths.indicator`.
- Add `sizes.sidebar`, `sizes.aside`, `sizes.rail`, `sizes.page.narrow`, `sizes.page.wide` and
  `sizes.prose`.
- Add `spacing.safe.top`, `spacing.safe.right`, `spacing.safe.bottom` and `spacing.safe.left`.
- Breaking: rename `scales/` to `draw/`, and the aspect ratios' `RATIOS` to `ASPECT_RATIOS`.
- Breaking: remove `backgrounds`, `surfaces`, `foregrounds`, `borders`, `stepped`, `ramp`,
  `neutralFills`, `paletteRoles`, `paletteAlias`, `palettes`, `families`, `ROLE_STEPS`,
  `FOREGROUND_STEPS`, `BORDER_STEPS`, `PageLightness`, `Palettes`, `PaletteAliases`, `Coded`,
  `deepMerge`, `contract`, `ContractedVariant`, `RootThemeConfig`, `DerivedThemeConfig` and
  `ThemeConfig`.
- Add `statusEmitted()`, which writes the `staticCss` entry of a `status` axis.
- Take the condition of the mark in `highlightVariants(highlights, when)`.
- Add `layerStyles.field`, `fieldVariants()` and `fieldStatusVariants()`.
- Add `wrappedField()` and `wrappedFieldVariants()`, which read the state of every control in a
  field's box.
- Set a field's height to `control.md` under a coarse pointer.
- Transition a field like `interactive()`.
- Write a control's inline insets through `--control-inset-start` and `--control-inset-end`, named
  `CONTROL_INSET_START` and `CONTROL_INSET_END`.
- Paint `field()`'s edge in `border.emphasized` at the control's width.
- Restate the hover, invalid and read-only rules in each field look.
- Read read-only from `readonly`, `data-readonly` and `aria-readonly`, and from `:read-only` on an
  `input` or a `textarea`.
- Paint a subtle or flushed field's block-end edge in the focus ring's color under keyboard focus.
- Dash a read-only field's edges on every field look.
- Rest the subtle field look on `bg.subtle`.
- Add `FIELD_EDGE` and `cursor.field`.
- Add `filledColumns()`.
- Export `SystemStyleObject` from the authoring entry.
- Make `Application.themes` optional.
- Stamp `data-recipe` only outside production.
- Keep a control's box still under a press.
- Set each heading role's own leading and tracking.
- Step the quiet surfaces two, four and seven points below a light page.
- Mark the `tint` highlight with the muted fill.
- Cast each shadow's ink through `light-dark()`.
- Mark a highlighted row with a `Highlight` line under forced colors.
- Mark a plain fill's press with a fill.
- Clip the ripple to its own box.
- Light the rim of every raised surface after dark.
- Export `breakpoints`.
- Add `paletteVariants()`.
- Kebab-case the slot in a slot compound's class.
- Dim the siblings of a focused or pressed child in `layerStyles.dim.others`.
- Set `label.2xl` to the `xl` step.
- Add `subtle` to `toneVariants`.
- Paint outlined and surface edges in the palette's `muted` role, through
  `layerStyles.outline.muted`.
- Add `animationStyles.sheet` motions from and to each edge of the window.
- Add the `drag`, `dragging`, `pan`, `connect` and `resizeColumn` cursors.
- Add the `marquee-x` and `marquee-y` keyframes and motions.
- Add the `slide-up` motion.
- Read a scale motion's distance from `--scale-distance`.
- Reword the errors about a compound matched on a value that cannot be part of a class name.
