/**
 * Starts the host: recovery first, then registration, then the page.
 *
 * @remarks
 *   The order is the whole of this file. Recovery is subscribed before anything else, because the
 *   remote is deployed on its own schedule and the chunks this page was told about can already be
 *   gone. Registration is awaited before the first render, because a module imported from a remote
 *   that has not been registered fails at that import rather than here.
 */

import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import { Dashboard } from "#dashboard.ts";
import { endpoints, join, where } from "#endpoints.ts";
import { Shell } from "#shell.tsx";
import { watching } from "#stale.ts";

/**
 * Locates the file the deployment serves to say where the remotes are, beside the documents.
 */
const WHERE = where(import.meta.env.BASE_URL);

/**
 * Looks up the element the host mounts its shell in, or null on a page without one.
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
