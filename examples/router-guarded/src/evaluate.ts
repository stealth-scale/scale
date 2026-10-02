/**
 * Builds the evaluator the compiler asks before it routes a page.
 */

import { redirect } from "@stealthscale/provider-router";

import { type Condition, holds, type Session } from "#session.ts";

/**
 * Builds the evaluator every compiled route runs before it is entered.
 *
 * @remarks
 *   Returning false makes the route not found, because a route nobody may open does not exist. The
 *   one case that is not a 404 is somebody who has not signed in, whom the evaluator sends to sign
 *   in. It throws that redirect itself, because it alone knows which condition failed. It reads the
 *   session on each call, so a person who signs in changes what is routed without the tree being
 *   built again. It reads nothing from the router's context, so it takes the condition alone, and
 *   `compileRoutes` accepts it all the same.
 * @param read - Returns who is reading at the moment the condition is checked.
 * @returns The evaluator, for `compileRoutes`.
 * @throws {@link Error} A redirect to the sign-in page, where nobody has signed in.
 */
export function evaluator(read: () => Session): (when: Condition) => boolean {
  return (when) => {
    const reading = read();

    if (when.kind === "signedIn" && !reading.signedIn) {
      // eslint-disable-next-line typescript/only-throw-error -- the library's redirect is a response, not an Error subclass
      throw redirect({ to: "/sign-in" });
    }

    return holds(reading, when);
  };
}
