# Gates

Scripts that prove a boundary the specifications beside the source cannot: a cold checkout, a second
process, a tarball in a consumer, a served page. Each runs straight from the shell under Node 26,
which strips the types, so there is nothing to build. Each names the gate it proves in its header,
and each ends with a non-zero code when the proof fails.

The lane is beside `scripts/catalogue`, outside every workspace package. The root configuration runs
`scripts/**/*.spec.ts` as a test project named `scripts`, so a gate that needs a specification of
its own writes one beside it, the way `scripts/trust` does, and `vp test --run --project scripts`
runs it. The coverage policy counts `src/` alone and so counts nothing here.

| Script         | Proves                                                                                                                                                                                                    | Runs                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `bootstrap.ts` | A checkout with no built output builds whole from `pnpm run bootstrap` and `vp run -r build`, generates the theme runtime, packs an inventory, and a second run of the graph hits the cache on every task | `pnpm gate:bootstrap`, at a boundary that touches the build, the configuration packages or the task runner |

The gates section 5 of the build-system plan names and this lane does not yet prove are listed in
the plan's deferred tasks, each with the script that would prove it.
