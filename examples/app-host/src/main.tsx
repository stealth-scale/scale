/**
 * Starts the host: stale chunk recovery first, then remote registration, then the first render.
 *
 * @remarks
 *   The order is the point of this file. Recovery subscribes before anything else, because the
 *   remote deploys independently and the chunks this document names can already be gone.
 *   Registration is awaited before the first render, because a module imported from an
 *   unregistered remote fails at that import.
 */

import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import { Dashboard } from "#dashboard.ts";
import { endpoints, join, where } from "#endpoints.ts";
import { Shell } from "#shell.tsx";
import { watching } from "#stale.ts";

/**
 * The path the remotes file is fetched from, derived from the base the bundler was given.
 */
const WHERE = where(import.meta.env.BASE_URL);

/**
 * The element the host mounts the shell in, or null in a document without `#root`.
 */
const root = document.querySelector("#root");

watching({
  held: sessionStorage,
  reload: () => {
    globalThis.location.reload();
  },
});

join(await endpoints(WHERE));

if (root !== null) {
  createRoot(root).render(
    <Shell>
      <Suspense fallback={"Loading the other application."}>
        <Dashboard count={3} />
      </Suspense>
    </Shell>,
  );
}
