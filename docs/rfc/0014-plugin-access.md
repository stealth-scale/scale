---
rfc: 0014
title: "Plugin access: sessions, permissions and entitlements"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0014: Plugin access: sessions, permissions and entitlements

## Summary

The host determines what a person is offered. The services determine what the person may do. This
RFC defines the three inputs of access:

- The session states who is signed in, and for which tenant.
- A permission states what the person may do, for the tenant or on one resource.
- An entitlement states what the tenant is licensed for.

It also defines where each input is checked, the check a component makes on one resource, the access
catalogue the build writes for the access service, signing in, and what the host does when access
changes.

RFC-0015 defines feature flags. A flag states what is released to a session.

## Motivation

### The requirements

- A person is offered a page, a contribution, a command or a control only when they may use it.
- A permission has one name in the contract, in the session, in the service's check and in the
  access service's role editor.
- A permission may apply to one resource, such as one request, and a service determines whether the
  person has it on that resource.
- A tenant's licence determines which plugins and which features the tenant has.
- The access service receives every permission, resource kind, role and entitlement the installed
  plugins declare, with their descriptions in every language, without reading TypeScript.
- A sign-in, a sign-out, a tenant switch or a changed grant applies while the page runs, without a
  reload.
- No check in the browser is a security boundary. The service behind every action enforces what the
  page offers.

### Why this layer

The page's code runs on the person's machine, so the page cannot enforce access. The page offers
only what will succeed, and renders a service's refusal as an error the person can read. The
services refuse. The design keeps every access rule in the services and gives the page their
results: the permissions and entitlements a session has, and the decision on one resource.

## Detailed design

### Three inputs

| Input       | States                                        | Determined by                               | Scope                                               | Changes when                                      |
| ----------- | --------------------------------------------- | ------------------------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| Session     | Who is signed in, and for which tenant        | The identity service                        | Person and tenant                                   | A sign-in, a sign-out, a renewal, a tenant switch |
| Permission  | What the person may do                        | The access service, from roles and policies | The tenant, or one resource for a scoped permission | A grant or a revocation                           |
| Entitlement | Which capabilities the tenant is licensed for | The licence service                         | The tenant                                          | A purchase, an upgrade, a downgrade or an expiry  |

A product writes one adapter, the session source, which reads all three from its services. The host
never computes a permission or an entitlement.

### Where access is decided

| Layer          | Mechanism                                                                          | A person without access sees                                          | Security boundary |
| -------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| Plugin         | The product's `installed` condition, typically an entitlement                      | Every page of the plugin not found, nothing placed, commands disabled | No                |
| Page           | The route's `when`, evaluated in `beforeLoad` (RFC-0013)                           | The not-found page. The menu does not list the entry                  | No                |
| Contribution   | The extension's `when`, evaluated where its target renders                         | Nothing in the extension's place                                      | No                |
| Command        | The command's `when`, evaluated when read and again when run                       | A disabled command. Keys and the palette skip it. `run` refuses       | No                |
| Part of a page | `usePermission`, `useAccess` or `useEntitlement` in the component                  | Whatever the component renders instead                                | No                |
| Service        | The service checks the permission's qualified id, the resource and the entitlement | An error response                                                     | Yes               |

- The first five layers determine what the page offers. They prevent a person from being offered
  something they cannot use. A request made outside the page bypasses the five, because the page's
  code runs on the person's machine.
- The service refuses what the person may not do. Every action a plugin offers has a service
  operation that checks a permission, and an entitlement where the action is licensed.
- A permission's qualified id is the scope the service checks. `time-off/request.approve` in the
  contract and in the service's check are one string, so the page and the service cannot disagree
  about a name.

One permission at every layer:

```ts
export const timeOffContract = defineContract("time-off", (self) => ({
  commands: {
    approve: command({
      ...args<{ readonly requestId: string }>(),
      label: "commands.approve",
      sample: { requestId: "7" },
      when: { permission: self.permission("request.approve") },
    }),
  },
  permissions: {
    "request.approve": permission({
      description: "permissions.approve",
      resource: self.resource("request"),
    }),
    "request.read": permission({ description: "permissions.read" }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  routes: {
    request: route({
      ...params<{ id: string }>(),
      path: "time-off/$id",
      sample: { id: "7" },
      when: { permission: self.permission("request.read") },
    }),
  },
}));
```

```tsx
export function Request(): ReactNode {
  const { id } = useRouteParams(timeOffContract.routes.request);
  const { t } = useTranslation(timeOffContract.pluginId);
  const approve = useCommand(timeOffContract.commands.approve);
  const access = useAccess(timeOffContract.permissions["request.approve"], id);

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title>{t("request.title", { id })}</Page.Title>
        {approve.enabled && access !== "denied" ? (
          <Page.Actions>
            <Button disabled={access === "pending"} onClick={() => approve.run({ requestId: id })}>
              {approve.label}
            </Button>
          </Page.Actions>
        ) : null}
      </Page.Header>
    </Page.Root>
  );
}
```

- A person without `time-off/request.read` who opens `/time-off/7` gets the not-found page, and the
  menu does not list the overview.
- A person who approves no request at all has no `time-off/request.approve` in their session, so the
  command is disabled and the page renders no Approve button.
- A person who approves requests of their own team, and not this one, has the permission in their
  session. The resource check returns `denied` for request 7, and the page renders no button.
- The service operation behind the command checks `time-off/request.approve` on request 7, so a
  request made outside the page is refused as well.

### The session

```ts
/**
 * Describes who is signed in, for which tenant, and what the access and licence services granted.
 */
export interface Session {
  /**
   * True when somebody is signed in.
   */
  readonly authenticated: boolean;

  /**
   * Name the page shows for the person.
   */
  readonly displayName?: string | undefined;

  /**
   * Qualified ids of the entitlements the tenant is licensed for.
   */
  readonly entitlements: readonly string[];

  /**
   * Qualified ids of the permissions the person has in the tenant: for the whole tenant, or on at
   * least one resource.
   */
  readonly permissions: readonly string[];

  /**
   * Qualified ids of the roles assigned to the person, for display and for flag targeting. No
   * condition reads them.
   */
  readonly roles: readonly string[];

  /**
   * Tenant the session applies to, where the product has tenants.
   */
  readonly tenantId?: string | undefined;

  /**
   * Id of the person.
   */
  readonly userId?: string | undefined;
}

/**
 * The session of a person who is not signed in.
 */
export const NOBODY: Session;

/**
 * Provides the session while the page runs.
 */
export interface SessionSource {
  /**
   * Returns the session now. Returns the same object until the session changes.
   */
  readonly read: () => Session;

  /**
   * Calls the listener after the session changes. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Returns a source whose session never changes: for a server request, a test or the standalone host.
 */
export function constantSession(session: Session): SessionSource;

/**
 * Returns the person and the tenant a session applies to, or undefined for nobody.
 *
 * @remarks
 *   A token renewed for the same person returns the same subject. A sign-in, a sign-out and a
 *   tenant switch return another.
 */
export function subjectOf(session: Session): string | undefined;
```

- A product writes the adapter from its identity client to `SessionSource`. The adapter reads the
  permissions and the entitlements from the token's claims or from its services, and may ask for the
  ids the access catalogue lists alone, so the session does not grow with permissions of plugins the
  product does not install.
- `read` returns one object until the session changes, because the host reads it through
  `useSyncExternalStore`, which requires a stable snapshot.
- The session store puts `permissions` and `entitlements` in sets once per session, so a check is
  one lookup however long the lists are.

### Permissions

- A contract declares each permission with `permission()` (RFC-0010): its description key, and the
  resource kind it is granted on, where it is granted per resource.
- The host qualifies the name with the plugin id. The qualified id is the permission's only
  identity: in a condition, in the session, in a service's check, in the access catalogue and in a
  report.
- A permission without a resource kind is a tenant permission: the person has it for the whole
  tenant or not at all. A permission with a resource kind is a scoped permission: the person has it
  on some resources and not on others.
- A permission is true in a condition when `session.permissions` contains its qualified id. For a
  scoped permission that means the person has it on at least one resource, which is what a menu
  entry, a page for creating a resource and a command need to know.
- The match is exact. There are no wildcards and no hierarchy, because the service's check has
  neither.
- A permission the session has and no installed contract declares is ignored.
- `usePermission(reference)` returns whether the session has the permission, and renders the
  component again when that changes.

### Checks on one resource

A component checks a scoped permission on one resource with `useAccess`:

```ts
/**
 * Identifies one resource by its kind's qualified id and its own id.
 */
export interface ResourceRef {
  /**
   * Id of the resource within its kind.
   */
  readonly id: string;

  /**
   * Qualified id of the resource kind: `time-off/request`.
   */
  readonly type: string;
}

/**
 * Describes one check: a scoped permission on one resource.
 */
export interface AccessCheck {
  /**
   * Qualified id of a scoped permission.
   */
  readonly permission: string;

  /**
   * The resource the permission is checked on.
   */
  readonly resource: ResourceRef;
}

/**
 * Decides checks on single resources for the session the host identified.
 */
export interface AccessSource {
  /**
   * Decides each check, in the order given. The host calls it with every check one task
   * requested.
   */
  readonly check: (checks: readonly AccessCheck[]) => Promise<readonly boolean[]>;

  /**
   * Calls the listener when earlier decisions may be out of date. Returns a function that stops the
   * calls.
   */
  readonly subscribe?: ((listener: () => void) => () => void) | undefined;
}

/**
 * Lists the states of one decision.
 */
export type AccessDecision = "allowed" | "denied" | "pending";

/**
 * Reads the decision on one resource, and renders again when it changes.
 */
export function useAccess(
  permission: PermissionReference<string, true>,
  resourceId: string,
): AccessDecision;

/**
 * Describes a decision the page already knows, from data a service returned.
 */
export interface KnownDecision extends AccessCheck {
  /**
   * True where the person has the permission on the resource.
   */
  readonly allowed: boolean;
}

/**
 * Lists what a component may do to the host's decisions.
 */
export interface AccessActions {
  /**
   * Drops the decisions on a resource, or every decision where it names none, so the next read asks
   * again.
   */
  readonly forget: (resource?: ResourceRef) => void;

  /**
   * Records decisions a service returned with its data, so no check is sent for them.
   */
  readonly prime: (decisions: readonly KnownDecision[]) => void;
}

/**
 * Returns the actions on the host's decisions.
 */
export function useAccessActions(): AccessActions;
```

A read of `useAccess` returns the first of these that applies:

1. The decision in the host's `access` store for the session's subject, the permission and the
   resource.
2. `denied`, where the session does not have the permission on any resource. The source is not
   asked.
3. `allowed`, where no `AccessSource` was given to `createHost`. The page then offers the action to
   everybody who has the permission on some resource, and the service refuses the rest.
4. `pending`, and the host queues the check. Every check queued in one task goes to `check` in one
   call, with duplicates removed. The component renders again when the decision arrives.

- `useAccess` accepts a scoped permission alone. The type checker refuses a tenant permission, which
  `usePermission` reads.
- A source whose service caps the size of a batch splits the call itself, and returns the decisions
  in the order of the checks.
- The store keeps each decision until the session's subject changes, the source calls its listener,
  or a component calls `forget`. A plugin calls `forget` with the resource after an action that
  changes who may act on it, such as a transfer of ownership.
- A `check` that rejects, or that returns a list of another length, decides its checks as `denied`
  for 30 seconds and reports `access-failed` (RFC-0012). The next read after that asks again.
- A pending decision renders the control disabled, not absent, so the page does not move when the
  decision arrives.

A service that returns a resource can return the person's actions on it too, and the page records
them with `prime`. The page then does not send a check for that resource:

```ts
const request = await fetchRequest(id);

prime(
  request.actions.map((action) => ({
    allowed: true,
    permission: `time-off/request.${action}`,
    resource: { id, type: "time-off/request" },
  })),
);
```

The host primes the decisions a declared query's data states, through the query's decision
selectors, so a page that reads its data through the plugin's queries does not send a check for a
resource it displays. The host primes them from data a fetch returns and from data the page hydrates
after a server render (RFC-0020).

A list, a page for one resource and a command on one resource need no check of their own:

| Case                                | Handled by                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| A list of resources                 | The service returns only the resources the person may read                                             |
| A page for one resource             | The service returns not found for a resource the person may not read, and the page throws `notFound()` |
| A command that acts on one resource | The command's condition checks the permission for the tenant. The service decides the resource         |

### Roles

- A contract declares roles as sets of its own permissions with `role()` (RFC-0010). The access
  catalogue lists each role, and the access service offers it as one grant: "Time off approver"
  grants reading and approving requests.
- No condition and no hook checks a role. The access service maps roles to permissions, and the
  session lists the permissions that result, so the page and the service apply one mapping.
- `Session.roles` lists the roles assigned to the person, for a page that displays them and for a
  flag service that targets them (RFC-0015).

### Entitlements

- A contract declares each capability that is licensed on its own with `entitlement()`: a whole
  module, or a feature of a plan. The qualified id is `time-off/halfDays`.
- `Session.entitlements` lists the entitlements of the session's tenant. The session source reads
  them from the product's licence service.
- `when: { entitlement: reference }` is true when the session's entitlements contain the id.
- `useEntitlement(reference)` returns the same value to a component, which may render an offer to
  upgrade in place of the feature.
- A product licenses a whole plugin through the plugin's condition in its definition (RFC-0011):

  ```ts
  installed(timeOff, { when: { entitlement: timeOffContract.entitlements.module } });
  ```

  Every page of the plugin is then not found, every extension unplaced and every command disabled
  for a tenant without the entitlement.

- The service checks the entitlement as it checks a permission, because the page's checks are
  advisory.

Permissions, entitlements and flags differ in the question each one settles:

| Input       | Question                          | Set by              | Scope             | Lifetime                          | The service checks it |
| ----------- | --------------------------------- | ------------------- | ----------------- | --------------------------------- | --------------------- |
| Permission  | May this person do this?          | The access service  | Person and tenant | Until revoked                     | Yes                   |
| Entitlement | Has this tenant bought this?      | The licence service | Tenant            | The term of the licence           | Yes                   |
| Flag        | Is this released to this session? | The flag service    | Session           | Weeks, or permanent for ops flags | No                    |

A capability a tenant buys is an entitlement. A flag service that encoded plans would copy the
licence service's data, and the services would not enforce it.

### The access catalogue

The build writes every access declaration of the installed plugins into `dist/.product/access.json`
(RFC-0011), for the access service and the licence service:

```ts
/**
 * Describes the product a catalogue was built for.
 */
export interface CatalogueProduct {
  /**
   * Id of the product.
   */
  readonly id: string;

  /**
   * Version of the product.
   */
  readonly version: string;
}

/**
 * Describes one declared name in a catalogue.
 */
export interface CatalogueEntry {
  /**
   * The contract's deprecation note. Absent where the name is not deprecated.
   */
  readonly deprecated?: string | undefined;

  /**
   * The description in each language the plugin's catalogues contain, by language.
   */
  readonly description: Readonly<Record<string, string>>;

  /**
   * Qualified id of the name.
   */
  readonly id: string;

  /**
   * Id of the plugin that declares the name: `host` for a kill switch.
   */
  readonly plugin: string;
}

/**
 * Describes a permission in the access catalogue.
 */
export interface CataloguePermission extends CatalogueEntry {
  /**
   * Qualified id of the resource kind a scoped permission is granted on. Absent on a permission for
   * the whole tenant.
   */
  readonly resource?: string | undefined;
}

/**
 * Describes a role in the access catalogue.
 */
export interface CatalogueRole extends CatalogueEntry {
  /**
   * Qualified ids of the permissions the role grants.
   */
  readonly permissions: readonly string[];
}

/**
 * Describes every access declaration of a product's installed plugins, for the access service and
 * the licence service.
 */
export interface AccessCatalogue {
  /**
   * Every entitlement.
   */
  readonly entitlements: readonly CatalogueEntry[];

  /**
   * Every permission.
   */
  readonly permissions: readonly CataloguePermission[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;

  /**
   * Every resource kind.
   */
  readonly resources: readonly CatalogueEntry[];

  /**
   * Every role.
   */
  readonly roles: readonly CatalogueRole[];
}
```

- Each list is sorted by id, so a diff of two releases' catalogues lists every added and removed
  name.
- A description is translated in every language the plugin's catalogues contain.
- The access service reads the file to offer the roles as grants, to refuse a grant of an unknown
  permission, and to show each description in the role editor. The licence service reads the
  entitlements to compose its plans.
- A service written in TypeScript may import the contract instead and read the qualified id from the
  reference: `timeOffContract.permissions["request.approve"].id`.

### Signing in

A condition may require a signed-in person: `when: { authenticated: true }`. A page for people who
are not signed in states `when: { authenticated: false }`.

A product states its sign-in page and may require sign-in for every plugin page (RFC-0011):

```ts
export default defineProduct({
  name: "product.name",
  plugins: [installed(identity), installed(timeOff)],
  productId: "people",
  signIn: identityContract.routes.signIn,
  version: "1.0.0",
  when: { authenticated: true },
});
```

- The host joins the product's `when` into the condition of every plugin route except the sign-in
  route.
- When a route's condition is false, the session is not authenticated, the product states a sign-in
  route, and the condition requires `authenticated: true` at its top level or in a top-level
  `allOf`, the evaluator throws the router's `redirect` to the sign-in route. The redirect's search
  has `redirect` set to the address the navigation entered, its path, its search and its hash, which
  `beforeLoad` receives before the navigation commits (RFC-0012). ADR-0024 leaves this case to the
  evaluator.
- Every other false condition is not found. A signed-in person without a permission is not
  redirected, because signing in again does not change their permissions.
- The sign-in page reads `redirect` and navigates there after sign-in, where the address has the
  page's own origin. It refuses any other address, so the parameter cannot send a person off site.

### Evaluating a condition in the host

`conditionContextOf(stores, place)` of `sdk-plugin` builds the `ConditionContext` of RFC-0010 from
the host's stores as they are when the condition is evaluated:

| Member          | From                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `authenticated` | The session store                                                                                                                |
| `permitted`     | The session store's set of permissions                                                                                           |
| `entitled`      | The session store's set of entitlements                                                                                          |
| `flag`          | The flag store (RFC-0015). A flag no installed plugin declares is false                                                          |
| `on`            | The availability store: installed, not stopped, switched on, its condition true, its requirements on                             |
| `matched`       | `place.matched`: the router's matches, for an extension, a command, a section or a component. Undefined for a route and a plugin |
| `field`         | `place.field`: the reader of the record a slot that states `record` renders with. Undefined everywhere else                      |

- The context reads a flag only when a condition checks it, so an experiment counts an exposure only
  where its variant determines what the person sees.
- The route evaluator and a plugin's condition pass no place.

A route's condition is evaluated before the route matches, so the location is not known there. The
build refuses a `route` member in a route's condition and in a plugin's condition (RFC-0011).

### When access changes

A session changes while the page runs: a sign-in, a sign-out, a tenant switch, or a grant the
session source learns of. The host then does this, in order:

1. The session source calls its listener. The host reads the session, and stops if `read` returned
   the same object.
2. The host updates the session store. Every component that reads `useSession`, `usePermission` or
   `useEntitlement` renders again where its value changed.
3. Where `subjectOf` returns another subject, the switch and placement stores move to the new
   subject's keys, because they subscribed to the session store first (RFC-0017).
4. The host emits `host/sessionChanged` with the new session. The event is sticky, and the host
   emits it at start as well, so a plugin that subscribes later receives it at once (RFC-0016).
5. Where `subjectOf` returns another subject, the host resets its data client and clears its access
   decisions (RFC-0005). The flag values remain while the flag source identifies the new session,
   because a cleared store would evaluate the next read against a source that still evaluates for
   the person before.
6. The host calls the flag source's `identify`, and evaluates again every flag the page has read
   once it resolves (RFC-0015).
7. `HostProvider` calls `router.invalidate()` at the end of the task. The router runs `beforeLoad`
   again for every matched route, so a page the person may no longer see becomes not found, and a
   page that now requires sign-in redirects.

When the access source calls its listener, the host clears its decisions, and every component that
reads `useAccess` asks again. Extensions, commands and menu entries read the stores directly, so
they update in the render after the store changes, without an invalidation.

### On a server

- The server builds a host per request, with `constantSession` for the request's session and an
  access source bound to that request.
- The decisions the host knows when the router dehydrates, after the page's loaders primed them and
  before the render, are part of the router's dehydrated state (`setupHostIntegration`, RFC-0012).
  The browser's host starts with them where its subject is the server's, so the browser's first
  render matches the server's.
- A decision an access batch settles during the server's render is left out, because the render read
  it as `pending`. A decision the server did not make is `pending` in both renders, and the
  browser's access source decides it after hydration.

## Failure handling

| Failure                                                        | Detected by      | Outcome                                                                                 |
| -------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| The session source's `read` throws                             | The host         | The host keeps the last session and reports `session-failed`                            |
| The access source rejects, or returns a list of another length | The host         | The batch's checks are `denied` for 30 seconds, and `access-failed` is reported         |
| A session permission or entitlement no contract declares       | The host         | Ignored                                                                                 |
| A primed decision for a permission no contract declares        | The host         | Ignored                                                                                 |
| `useAccess` with a tenant permission                           | The type checker | Fails to compile                                                                        |
| A route's or a plugin's condition states `route`               | The build        | The build fails, naming the declaration                                                 |
| The `redirect` search names another origin                     | The sign-in page | The page navigates to the product's first page instead                                  |
| A service operation lacks a permission or entitlement check    | Nothing here     | The page hides the action, and the service performs it. The service's review catches it |

## Bounds

- A permission or entitlement check in a condition is one set lookup. The session store builds the
  sets once per session.
- Checks on single resources cost one call to the access source per task that requested any, and
  none for a decision already known or primed.
- A change of session costs one or two `router.invalidate()` calls. Each runs `beforeLoad` for the
  matched routes, which is the depth of the page, two to four routes in a frame.

## Alternatives considered

### A refusal page for a missing permission

**Why not:** a refusal confirms the page exists to a person who may not know it does. ADR-0024
decides a false condition is not found.

### Checking permissions only inside components

Every page renders, and each component checks what it shows.

**Why not:** the menu would list pages the person cannot use, a deep link would open an empty page,
and the router would preload the chunk of a page the person may not see. A route condition prevents
all three before the page loads.

### Conditions that ask a service

A condition member that sends a check to the access source, awaited in `beforeLoad`.

**Why not:** a menu, the palette and a command's `enabled` evaluate conditions during render, where
nothing can wait. A condition that waits on a service would also make every navigation wait on it.
An outage of the access service would then hide the whole product. Conditions read the session, and
a check on one resource goes through `useAccess`.

### Deriving permissions from roles in the browser

The session contains roles. The host maps them to permissions with a table from the product.

**Why not:** the access service maps roles to permissions. A second copy of that mapping in the
browser diverges from the service's at the next change. The session contains the permissions the
service granted.

### Entitlements as feature flags

The licence service writes its plans into the flag service, and a plugin checks a flag.

**Why not:** a flag is temporary and per session, and no service enforces it. An entitlement lasts
the term of a licence, applies to the tenant, and every service checks it. A flag service that
encodes plans copies the licence service's data and diverges from it.

### A guard extension that redirects

A plugin wraps every route and redirects a person who is not signed in.

**Why not:** a wrap renders after the route matched, so the page renders once before the redirect.
An evaluator in `beforeLoad` redirects before anything renders.

## Drawbacks

- Five of the six layers are advisory. A plugin that hides an action and relies on the hiding is
  wrong, and nothing in this design detects it. The service's own review is the check.
- A permission's qualified id is shared with the services. Renaming a permission is a breaking
  change, released in the plugin and in the services that check the old id at once.
- A check on one resource without a primed decision renders its control disabled until the access
  source responds.
- The sign-in redirect covers a condition that requires sign-in at its top level. A condition that
  requires it deeper inside an `anyOf` is not found for a person who is not signed in.

## Unresolved and future work

- A list of every resource of a kind the person may act on, for a filter that the service's list
  does not provide.
- A check that each service operation tests the permission its command's condition names, from the
  access catalogue and the service's own declarations.

## References

| What                                      | Where                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| Refusing a failing condition as not found | `docs/adr/0024-refuse-a-failing-condition-as-not-found.md`                          |
| Conditions and their context              | `docs/rfc/0010-plugin-contracts.md`                                                 |
| TanStack Router's `redirect`              | https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction |
| `useSyncExternalStore`                    | https://react.dev/reference/react/useSyncExternalStore                              |
