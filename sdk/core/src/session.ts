/**
 * Describes the session a host reads, the source that provides it, and the subject it applies to.
 */

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
export const NOBODY: Session = {
  authenticated: false,
  entitlements: [],
  permissions: [],
  roles: [],
};

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
 * Stops nothing, because a constant source never calls its listeners.
 */
function unsubscribed(): void {}

/**
 * Returns a source whose session never changes: for a server request, a test or the standalone
 * host.
 *
 * @param session - The session the source returns.
 * @returns A source that never calls a listener.
 */
export function constantSession(session: Session): SessionSource {
  return { read: () => session, subscribe: () => unsubscribed };
}

/**
 * Returns the person and the tenant a session applies to, or undefined for nobody.
 *
 * @remarks
 *   A token renewed for the same person returns the same subject. A sign-in, a sign-out and a
 *   tenant switch return another.
 * @param session - The session to read the person and the tenant from.
 * @returns `<userId>@<tenantId>`, or undefined where nobody is signed in.
 */
export function subjectOf(session: Session): string | undefined {
  return session.authenticated ? `${session.userId ?? ""}@${session.tenantId ?? ""}` : undefined;
}
