# Retrospective

Accident narratives for this repo.

Routing: narrative stays here. A project-specific rule that will recur may become one line in `AGENTS.md`. Cross-project lessons go to nmem or a global rule. If it can be checked by a machine, add a hook or test instead of prose.


## 2026-10-02 — Check the exact import before replacing it

The Vitest upgrade reported a missing JSON import attribute in Vite configuration. A guarded replacement initially assumed a default import, but the source used a named version import; the assertion prevented an unintended edit. Read the exact source before constructing a replacement. Add the JSON attribute to the actual import and rerun the checks; never suppress the loader warning or describe checks on the unchanged file as repair validation.
