---
"@stealthscale/component-a11y": patch
---

component-a11y: let a roving focus item hold a ref to any element

- `RovingFocus.Item` typed its `ref` as `HTMLDivElement`, which is what the item draws when nothing
  else is asked for. An item drawn as a button or a link could not be given a ref of its own
  element, so a caller who needed one wrote an assertion or dropped the ref.
- The type is now `Ref<HTMLElement>`, which every element the item can draw satisfies.

component-a11y: write no id on a roving focus item unless a caller names one

- `RovingFocus.Item` stamped the id it tracks the item by onto the element, so a control drawn as an
  item lost its own id: a menu's trigger, which its panel's `aria-labelledby` points at. The group
  tracks an item by its registration and moves focus through the element, so the element now carries
  an id only where a caller states one.
- The item holding the tab stop is stamped `data-stop` rather than `data-active`. The theme reads
  `[data-active]` as a control being pressed, so a button drawn as an item was filled for holding
  the stop.
