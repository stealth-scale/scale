# RFCs

An RFC makes the argument for a design. Write one when the proposal changes a contract, when more
than one approach is worth comparing, or when the reasoning still matters after the code has
changed. Write an architecture decision record instead when there is one decision and no credible
alternative.

An RFC is not edited once it is accepted, except to change its status. The record it produces holds
the decision, and the standards hold the rules that are refined.

| RFC                                                   | Title                                                          | Status   |
| ----------------------------------------------------- | -------------------------------------------------------------- | -------- |
| [0001](0001-one-grammar-for-config-packages.md)       | One grammar for config and plugin packages                     | Accepted |
| [0002](0002-conformance-suite-for-config-packages.md) | A conformance suite for config and plugin packages             | Accepted |
| [0003](0003-theming.md)                               | Theming: the vocabulary, recipes, themes and scopes            | Accepted |
| [0004](0004-the-form-of-a-component.md)               | The form of a component                                        | Accepted |
| [0005](0005-data.md)                                  | The data foundation                                            | Draft    |
| [0006](0006-routing.md)                               | Routing: the pieces an application builds a router from        | Draft    |
| [0007](0007-forms.md)                                 | Forms: a form built from a schema                              | Draft    |
| [0008](0008-specimens.md)                             | Specimens: the page, the index and the props a catalogue draws | Accepted |
| [0009](0009-plugins.md)                               | Plugins: an application composed from plugins                  | Draft    |
| [0010](0010-plugin-contracts.md)                      | Plugin contracts and manifests                                 | Draft    |
| [0011](0011-composing-a-product.md)                   | Composing a product from plugins at build                      | Draft    |
| [0012](0012-plugin-host.md)                           | The plugin host: state, evaluation and failure                 | Draft    |
| [0013](0013-plugin-pages-and-contributions.md)        | Plugin pages, the frame and contributions                      | Draft    |
| [0014](0014-plugin-access.md)                         | Plugin access: sessions, permissions and entitlements          | Draft    |
| [0015](0015-plugin-feature-flags.md)                  | Plugin feature flags                                           | Draft    |
| [0016](0016-plugin-commands-and-events.md)            | Plugin commands, events and notifications                      | Draft    |
| [0017](0017-plugin-settings.md)                       | Plugin settings, switches and placements                       | Draft    |
| [0018](0018-plugin-words-and-styles.md)               | A plugin's words and styles                                    | Draft    |
| [0019](0019-plugin-testing-and-tools.md)              | Testing plugins, and the tools of a plugin's author            | Draft    |
| [0020](0020-plugin-data.md)                           | Plugin data                                                    | Draft    |

## Status

An RFC opens as `Draft`, moves to `Review` when the pull request is open, and reaches one of
`Accepted`, `Rejected` or `Withdrawn`. An accepted RFC becomes `Superseded` when a later one
replaces it.

A rejected or withdrawn RFC stays on disk. It records why the proposal was turned down, which stops
the same one arriving again.
