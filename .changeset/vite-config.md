---
"@stealthscale/vite-config": patch
---

Walk past the scratch below the workspace root as well as the agent worktrees. Both hold a second
copy of this repository, and a coverage run from the main checkout counted every file of one. A
snapshot left under `.scratch` put 1308 of the 2638 files of the root report outside the tree
anybody wrote, and the report read 50.93% against a threshold of 100%. Both globs are anchored at
the root, so a run inside a worktree or a snapshot counts its own files.

Read the options each inventory layer passes from a fixture rather than from the plugin it names.
The layer decides the options and the plugin decides the document, and the document is proved in the
plugin's own package. Loading the plugin proved it a second time and cost a measurement: the loader
names the package in a value, so Node imported its source while its own suite imported the same file
through the bundler, and merging the two readings left two branch counts below zero.
