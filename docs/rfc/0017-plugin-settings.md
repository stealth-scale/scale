---
rfc: 0017
title: "Plugin settings, switches and placements"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0017: Plugin settings, switches and placements

## Summary

A product configures its plugins at build. While the page runs, a person makes three kinds of
choice: a switch per plugin, the values of a plugin's settings, and the placement of contributions
in regions. This RFC defines the settings pages and sections a plugin declares, switches,
placements, where the host stores what a person chose, how a stored value is checked and migrated,
and how the host applies each change without a reload.

## Motivation

### The requirements

- A plugin creates a settings page, or adds a section to a page another plugin creates.
- A section whose values are flat renders from a schema, with its labels translated and its values
  validated, and the plugin does not write a form for it.
- A person switches a plugin off and on while the page runs, where the product allows it.
- A person moves a contribution into another region, removes it, or reorders a region.
- A stored value remains readable after a release that changes its format, through a migration. A
  value that fails its check is dropped rather than breaking the page.
- Two people at one browser, and one person in two tenants, keep separate choices.
- A change made in one tab applies in every other tab of the product.

### Why this layer

This repository has the pieces for it:

- `settings` stores a value per key in a `SettingStore`, and follows writes from other tabs
  (`foundations/settings/src/store.ts:13-37`, `foundations/settings/src/stores/local.ts:45-66`).
- `provider-form` builds a form from a JSON Schema document, translates every label through message
  identifiers, and validates with the same engine (`foundations/providers/form/src/schema-form.ts`).

`settings` stores strings from a fixed list and has no version or migration
(`foundations/settings/src/define.ts:14-37`). A switch is such a string. A section's values and a
person's placements are JSON, which the host stores through `SettingStore` directly, as
`provider-form` stores a form's draft (`foundations/providers/form/src/draft.ts:177-179`).

## Detailed design

### The choices

| Kind      | Chosen by | Applies to                | Values                                | Changes while the page runs | Stored in            |
| --------- | --------- | ------------------------- | ------------------------------------- | --------------------------- | -------------------- |
| Config    | Product   | The product               | Typed by the plugin's config schema   | No                          | The resolved product |
| Switch    | Person    | One plugin                | `on` or `off`                         | Yes                         | The setting store    |
| Setting   | Person    | One section of one plugin | Typed by the section's JSON Schema    | Yes                         | The setting store    |
| Placement | Person    | One slot                  | Extensions added, removed and ordered | Yes                         | The setting store    |

A flag is chosen by the product and a flag service per session (RFC-0015). An entitlement and a
permission are granted by services (RFC-0014). Neither is a person's choice.

### Storage

The host stores a person's choices in the `SettingStore` passed to `createHost` (RFC-0012). A
product passes the same store as its `Shell`: `localStore()` by default, `cookieStore()` for a
product that renders on a server.

| Choice    | Key                                                           | Value                                      |
| --------- | ------------------------------------------------------------- | ------------------------------------------ |
| Switch    | `stealth.<productId>.<subject>.plugin.<pluginId>`             | `on` or `off`                              |
| Setting   | `stealth.<productId>.<subject>.settings.<pluginId>.<section>` | `{"version":2,"values":{"days":3}}`        |
| Placement | `stealth.<productId>.<subject>.placements`                    | `{"version":1,"slots":{"host/aside":{…}}}` |

- `<subject>` is `subjectOf(session)` of RFC-0014, the person and the tenant, or `anyone` for a
  session nobody signed in to. Two people at one browser, and one person in two tenants, keep
  separate choices.
- A sign-in changes the subject. The host then reads every choice from the new subject's keys. It
  does not copy the choices made as `anyone`.
- A plugin's id is part of the key of its switch and its settings. Renaming a plugin starts its
  switch and its settings from their defaults, unless the new plugin's migrations read the old keys.
- The store notifies the host when another tab writes a key the host reads, and the host applies the
  change as if the person had changed the value in this tab.

### Switches

A person switches a plugin on or off on the host's Plugins settings page. The product determines
which plugins a person may switch, and each plugin's state before the person chooses (RFC-0011):

```ts
installed(inventory),
installed(billing, { locked: true }),
installed(showcase, { enabled: false }),
```

| `installed` option | Effect                                                        |
| ------------------ | ------------------------------------------------------------- |
| none               | Switchable. On until the person switches it off               |
| `enabled: false`   | Switchable. Off until the person switches it on               |
| `locked: true`     | Not switchable. On for everybody, whatever the store contains |

The host defines one setting per switchable plugin:

```ts
defineSetting({
  fallback: enabled === false ? "off" : "on",
  name: `${subject}.plugin.${pluginId}`,
  store,
  values: ["on", "off"],
});
```

- The switch is one input of a plugin's availability, beside its kill switch, its condition and its
  requirements (RFC-0012). A person's switch turns a plugin off for that person alone.
- Switching off a plugin that other plugins require without `optional` turns them off with it. The
  Plugins page asks the person to confirm first, and names those plugins.
- A plugin that is not on has every route not found, every extension unplaced, every command
  disabled, every settings page and section hidden, and every menu entry unlisted. For another
  plugin, `when: { plugin }` naming it is false.
- The not-found page of a switched-off plugin's route offers a button that turns the plugin on
  (RFC-0013).
- The host emits `host/pluginChanged` for each plugin that turns on or off (RFC-0016).
- A stored value for a locked plugin is ignored and reported. A `SettingStore` cannot list its keys,
  so the host reads no stored value for a plugin the product does not install.

### Settings pages and sections

A plugin declares pages and sections in its contract (RFC-0010):

```ts
export const timeOffContract = defineContract("time-off", (self) => ({
  settings: {
    pages: {
      "time-off": settingsPage({ label: "settings.title", order: 40 }),
    },
    sections: {
      calendar: settingsSection({
        label: "settings.calendar",
        target: identityContract.settings.pages.account,
      }),
      reminders: settingsSection({
        label: "settings.reminders.title",
        schema: {
          additionalProperties: false,
          properties: {
            channel: { default: "email", enum: ["email", "chat"], type: "string" },
            days: { default: 2, maximum: 14, minimum: 0, type: "integer" },
          },
          type: "object",
        },
        schemaVersion: 2,
        target: self.settingsPage("time-off"),
      }),
    },
  },
}));
```

```ts
/**
 * Describes a settings page a plugin creates.
 */
export interface SettingsPageOptions extends MarkerOptions {
  /**
   * Key of the page's title in the plugin's catalogue. The settings menu lists the page under it.
   */
  readonly label: string;

  /**
   * Rank of the page in the settings menu, ascending. Unranked pages follow, sorted by title.
   */
  readonly order?: number | undefined;

  /**
   * Condition under which the page is routed and listed.
   */
  readonly when?: When | undefined;
}

/**
 * Describes a section a plugin adds to a settings page, its own or another plugin's.
 */
export interface SettingsSectionOptions<
  Schema extends SettingsSchema | undefined = undefined,
> extends MarkerOptions {
  /**
   * Key of the section's heading in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Rank of the section on its page, ascending. Unranked sections follow, in install order.
   */
  readonly order?: number | undefined;

  /**
   * JSON Schema of the section's values. A section without one renders a component instead.
   */
  readonly schema?: Schema;

  /**
   * Version of the schema that a stored value records. 1 where left out.
   */
  readonly schemaVersion?: number | undefined;

  /**
   * The page the section renders on.
   */
  readonly target: SettingsPageReference;

  /**
   * Condition under which the section renders.
   */
  readonly when?: When | undefined;
}
```

The schema's version is `schemaVersion`, because a reference's `version` is the version of the
contract it was made from.

#### The values schema

A section's schema is the JSON Schema draft 2020-12 document that `provider-form` renders
(`foundations/providers/form/src/schema.ts:10-15`), limited to what a stored preference needs:

- The root is `type: "object"` with `additionalProperties: false`.
- Each property is `boolean`, `integer`, `number` or `string`, and states a `default`. A section has
  a value to read before the person saves one.
- A string property may state `enum`, which the form renders as a choice. `provider-form` reads
  choices from a string `enum` alone (`foundations/providers/form/src/property.ts:61-67`).
- A property may state `minimum`, `maximum`, `minLength`, `maxLength` and `pattern`, and the
  presentation keywords `x-control` and `x-span`.
- `ValuesOf<Schema>` types the values from the schema written `as const`: `integer` and `number` are
  `number`, a string with `enum` is the union of its values.

The build refuses a schema with a property that lacks a default, a default the schema rejects, or a
keyword outside that list (RFC-0011).

#### Rendering

- The host compiles a settings route, `host/settings`, at `settings`, whose component renders a
  `Page` titled `settings.title`, with the `host/settings` menu in `Page.Nav` and an `Outlet` in
  `Page.Body`. The menu is a wrapping row of the navigation package's links, each the router's link
  through `createLink(Link)`, which marks the current page with `aria-current`.
- The settings route's index, `host/settings/index` at `/` without a condition of its own, renders
  `<Navigate replace>` to the menu's first entry. The first entry sorts by translated title among
  unranked pages, which no `beforeLoad` can translate, so the redirect happens in the page. A server
  renders the frame alone for the index.
- The resolver lists each settings page as a route, with the id `host/settings/<page id>`, the path
  `<pluginId>/<page>`, the parent `host/settings` and an entry in the settings menu (RFC-0011). The
  menu, `routeHref` and `RouteLink` resolve a settings page as they resolve any page. The route's
  condition is the page's condition joined with the product's, and its plugin's availability, as for
  any plugin route. A settings page loads the plugins whose sections or extensions it renders.
- The page titles the document with its title through `useDocumentTitle`, and renders every section
  whose target is the page, whose plugin is on, and whose condition is true, in order. Each section
  is a `Section` of `component-screen` with the section's heading. A page with no section to render,
  other than the Plugins page, renders an empty state.
- Each section renders in its plugin's scope, inside an error boundary of its own. A render that
  throws reports `render-failed` with the target `section:<id>`, counts towards the section's
  quarantine, and renders an error alert in the section's place, so the other sections on the page
  keep running. A quarantined section renders the alert without rendering the section (RFC-0012).
- A schema section renders a form built with the forms package's `useSchemaForm`:
  - The form id is `settings.<section>`, so every label, description, choice and error message is a
    key of the section's plugin catalogue under `settings.<section>.fields.<path>`, the identifiers
    `provider-form` derives (`foundations/providers/form/src/identifiers.ts:64-81`).
  - A catalogue key is a string or an object, never both, so a schema section's label is a key
    beside its fields: `settings.reminders.title` beside `settings.reminders.fields`.
  - `translate` is the `t` of the section's plugin namespace.
  - `values` are the section's current values.
  - The section's Save button, `form.Submit` with the host's `settings.save`, submits the form. A
    valid submission writes the values, the form keeps them, and the host raises a success toast,
    `settings.saved`. An invalid one focuses the first refused field, which is `provider-form`'s
    default (`foundations/providers/form/src/form-defaults.ts:27-32`).
  - The form renders the glyphs the product passes to `createHost` as `glyphs` (RFC-0012): the mark
    in a checked box, a select's chevron and the others the forms package names.
- A component section renders the component the manifest maps its name to, with `{ sectionId }` as
  its props. The component reads and writes its values through `useSettings`, or keeps its state
  elsewhere, such as a list of connected calendars on a service.
- A section whose target page is not rendered, because the page's plugin is not installed or is not
  on or the page's condition is false, renders on its own plugin's first settings page. Where its
  plugin has no settings page, the settings frame reports it as `unplaced` once per mount, with the
  target page as `slot` and the section as `target`, and again where a change leaves it unplaced.
- The host's own settings pages are `host/settings/host/plugins`, the Plugins page, and
  `host/settings/host/account`, a page other plugins add sections to. The account page is a route
  only where an installed section targets it, which the build decides.
- The Plugins page lists every installed plugin in install order with its name, its description and
  its state, and a `Switch` where the plugin is switchable. A locked plugin reads "Always on", and a
  plugin that is not on states why. Switching off a plugin that installed plugins require without
  `optional` opens a confirmation that names them, and the switch applies once the person confirms.
  The confirmation is a warning `Alert` whose words the announcer's polite region reads, because a
  live region that mounts with its words is not announced reliably, and focus returns to the switch
  once the person settles.

#### Reading and writing values

```ts
/**
 * Describes a section's values as a component reads them.
 */
export interface Settings<Values> {
  /**
   * The stored values over the schema's defaults.
   */
  readonly values: Values;

  /**
   * Validates the change against the schema, writes it over the stored values, and renders the
   * section's readers again.
   *
   * @throws {@link Error} Where the section is another plugin's, no installed plugin declares it,
   *   or the schema refuses a value of the change.
   */
  readonly update: (change: Partial<Values>) => void;

  /**
   * Removes the stored value, so the section reads its defaults.
   *
   * @throws {@link Error} Where the section is another plugin's.
   */
  readonly reset: () => void;
}

/**
 * Reads a settings section's values, and renders again when they change in this tab or another.
 */
export function useSettings<S extends SettingsSectionReference>(section: S): Settings<ValuesOf<S>>;
```

- A plugin reads any section by reference and writes only its own. The product's own code, outside
  every plugin's scope, writes any section.
- `useSettings` reads a section that no installed plugin declares, such as an optional plugin's, as
  empty, and its `update` throws.
- A read goes through these steps:
  1. The host reads the section's key. An absent key returns the defaults.
  2. It parses the JSON, and checks for a whole `version` of 1 or more and an object of `values`. A
     value that fails either check is dropped and reported, and the defaults are returned.
  3. Where the stored version is lower than the section's, it runs the manifest's migrations from
     the stored version up, one version at a time. A missing migration, or a migration that throws,
     drops the value. The report contains the version, and the error where the migration threw.
  4. Where the stored version is higher, which a rolled-back release leaves, it returns the
     defaults. It keeps the stored value for the newer release to read again, and does not report
     it.
  5. It validates each property against the schema, keeps the valid ones, drops the rest and reports
     each dropped property.
  6. It returns the kept properties over the defaults.
- `useSettings` reports each dropped part as `setting-dropped`, with the key and the reason, once
  per stored value it reads. Each reader reports on its own, so a section that two components read
  reports each dropped part twice.
- A write validates the change against the schema, and throws where the schema refuses a value. It
  then stores `{"version":<section version>,"values":<values>}`, where the values are the change
  over the stored values the read kept, not over the defaults. A default that a later release
  changes then applies to every property the person never set.
- A migration is a function in the manifest, because the host reads a section synchronously:

  ```ts
  definePlugin(timeOffContract, {
    settings: {
      calendar: { component: () => import("#calendar-settings.tsx") },
      reminders: {
        migrations: { 1: (values) => ({ ...values, channel: "email" }) },
      },
    },
  });
  ```

  The key is the version the migration reads, and the result is the next version's values.

### Placements

A placement moves an extension into a region, takes it out of one, or orders a slot. The product
states its placements at build (RFC-0011), and a person states theirs at run time.

```ts
/**
 * Describes what one layer of placements states about one slot, by qualified extension ids: the
 * product's resolved placements, or a person's stored ones.
 */
export interface SlotPlacement {
  /**
   * Extensions placed in the slot beside their own target.
   */
  readonly add?: readonly string[] | undefined;

  /**
   * Extensions listed first, in this order.
   */
  readonly order?: readonly string[] | undefined;

  /**
   * Extensions taken out of the slot.
   */
  readonly remove?: readonly string[] | undefined;
}

/**
 * Describes a person's placements as a component reads them.
 */
export interface Placements {
  /**
   * The person's placements, by slot.
   */
  readonly slots: Readonly<Record<string, SlotPlacement>>;

  /**
   * Replaces the person's placements for the slots the change names, and writes the result.
   */
  readonly update: (change: Readonly<Record<string, SlotPlacement>>) => void;

  /**
   * Removes every placement the person made.
   */
  readonly reset: () => void;
}

/**
 * Reads the person's placements, for a plugin that offers a layout editor.
 */
export function usePlacements(): Placements;
```

The host resolves a slot's contents in this order (RFC-0013 renders the result):

1. The extensions whose own target is the slot, from the manifests.
2. The product's placements: `remove` takes an extension out, `add` puts one in. The build sorts the
   slot by the product's `order`, then each extension's `order`, then install order, then
   declaration order.
3. The person's placements, the same way. An extension marked `required` is never removed. An
   extension the person adds follows the extensions already placed, by its own `order` and then in
   install order.
4. The person's `order` lists extensions first, in that order. The rest keep their place.

- `add` names one of the host's eight regions: `brand`, `header`, `userMenu`, `navigation`, `aside`,
  `footer`, `status` and `toolbar` (RFC-0013). A region renders extensions without props, so an
  extension moves between regions without a props mismatch. The build refuses a product's `add` to
  any other slot, and the host ignores and reports a person's.
- The host checks stored placements when it reads them, once per stored text, so one value is
  reported once per tab. A whole value is dropped and reported where it is not JSON, has no `slots`
  object, or is not version 1. A later version reads as no placements and is not reported.
- A slot or an extension no installed plugin declares, an `add` to a slot that is not a region, a
  member that is not a list and a placement that is not an object are dropped and reported, each
  reason as `<path> <predicate>`. `update` checks the change, reports what it drops and writes the
  rest, so a stored value never contains a dropped part.
- The host does not render a layout editor. A plugin offers one through `usePlacements`.

### Configuration

Configuration is the product's choice, typed by the plugin's config schema (RFC-0010), stated in
`installed` and checked at build (RFC-0011). `useConfig(schema)` returns the product's values over
the schema's defaults. A person does not change configuration. A value a person may change is a
setting.

### On a server

A product that renders on a server passes `cookieStore()` to the host and to `Shell`, so the server
reads the switches, the settings and the placements the browser wrote, and renders the same page.
`cookieStore` writes one cookie per key, with `Path=/`, a year's `Max-Age` and `SameSite=lax`
(`foundations/settings/src/stores/cookie.ts:53-75`).

## Failure handling

| Failure                                                         | Detected by   | Outcome                                                                    |
| --------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| A stored switch for a locked plugin                             | The host      | Ignored and reported                                                       |
| A stored settings value does not parse                          | The host      | The defaults are returned, and a `setting-dropped` entry is reported       |
| A stored value has no whole version or no object of values      | The host      | The defaults are returned, and a `setting-dropped` entry is reported       |
| A stored version has no migration                               | The host      | The value is dropped and reported                                          |
| A migration throws                                              | The host      | The value is dropped, and the report contains the version and the error    |
| A stored version is higher than the section's                   | The host      | The defaults are returned, and the stored value is kept                    |
| A stored property fails the schema                              | The host      | The property is dropped and reported. The valid properties remain          |
| `update` with an invalid change, or on another plugin's section | `useSettings` | Throws                                                                     |
| `update` on a section no installed plugin declares              | `useSettings` | Throws                                                                     |
| `reset` on another plugin's section                             | `useSettings` | Throws                                                                     |
| A section's target page is not rendered                         | The host      | The section renders on its plugin's first page, or is reported as unplaced |
| A section throws while rendering                                | Its boundary  | An error alert in its place. After 3 in a row, quarantined                 |
| A placement names an unknown slot or extension                  | The host      | The name is dropped and reported                                           |
| A person's `add` names a slot that is not a region              | The host      | Ignored and reported                                                       |
| A section's schema lacks a default or uses another keyword      | The build     | The build fails, naming the section                                        |
| The browser refuses storage                                     | `settings`    | Every choice reads its default, and writes go nowhere                      |

## Answered questions

- **Does a plugin create a settings page, or add a section to one?** Both. Some plugins add a
  section to a page another plugin creates, and others create the page.

## Alternatives considered

### One stored value per plugin

Keep every section of a plugin in one JSON value under one key.

**Why not:** a migration of one section would rewrite every section of the plugin, and two tabs
saving two sections would overwrite each other's write. A key per section changes one section at a
time.

### Settings as a component each plugin renders

Each plugin renders its own settings page as an ordinary route.

**Why not:** a plugin could not add a section to another plugin's page. Every plugin would also
build its own form, its own save and its own storage. A schema section gets the form, the
validation, the translation and the storage from the host.

### A person may change configuration

Expose each config property as a setting.

**Why not:** configuration is the product's decision for everybody, checked at build and typed by
the product's definition. A value one person may choose is a setting, and the plugin declares it as
one.

### Placements anywhere

A placement adds an extension to any slot.

**Why not:** an extension renders with its slot's props, and a slot with other props would render it
with the wrong ones. Regions render without props, so a move between regions cannot mismatch.

## Drawbacks

- A schema section covers flat values. A setting with a list or a nested object is a component
  section.
- Settings are per browser. A person who signs in on another machine starts from the defaults, until
  a product passes a `SettingStore` backed by its own service.
- `cookieStore` sends every choice with every request. A person with many settings sends a larger
  header, and a browser caps a cookie at about 4 KB.
- A section keeps its migrations in the manifest module, which the page loads at start. A plugin
  with many versions loads its migrations even when no stored value is old.

## Unresolved and future work

- A `SettingStore` over the product's own service, so a person's choices follow them across
  machines.
- A layout editor, as a plugin over `usePlacements`.

## References

| What                                     | Where                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| The setting store and its keys           | `foundations/settings/src/store.ts`, `foundations/settings/src/define.ts` |
| Following writes from other tabs         | `foundations/settings/src/stores/local.ts:45-66`                          |
| A form's draft in the setting store      | `foundations/providers/form/src/draft.ts`                                 |
| A form built from a JSON Schema document | `foundations/providers/form/src/schema-form.ts`, `docs/rfc/0007-forms.md` |
