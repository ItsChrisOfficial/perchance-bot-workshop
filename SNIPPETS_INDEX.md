# Snippets Index

Operational index for reusable snippet assets and snippet-adjacent workflow references used in this repository.  
Use this file to track what exists, where it lives, and how it should be reused safely.

## Snippet fields (required)

Every snippet entry must include:

- **name**: human-readable snippet name
- **path**: repository-relative file path
- **category**: one of:
  - `export-envelope`
  - `custom-code-ui`
  - `validation`
  - `json-serialization`
  - `message-objects`
  - `shortcut-buttons`
  - `workflow-docs`
- **purpose**: what the snippet/reference is for
- **intended reuse**: when and where to reuse it
- **caveats**: constraints, limits, or required checks before reuse

## Entry format (example)

| name | path | category | purpose | intended reuse | caveats |
|---|---|---|---|---|---|
| Example Message Object Snippet | `snippets/message-objects/example.md` | message-objects | Valid seeded message object patterns | Reuse when authoring `initialMessages` or system/user/ai message rows | Verify author enum and field types against import standard |

## Index entries

| name | path | category | purpose | intended reuse | caveats |
|---|---|---|---|---|---|
| Snippets Workspace Guide | `snippets/README.md` | workflow-docs | Defines what belongs in `snippets/`, naming rules, and maintenance expectations | Read before adding or reorganizing snippet files | Guidance-only; does not replace import validation requirements |

## Category coverage notes

- Defined categories above are canonical for this repository and must be used for new entries.
- Categories may be empty until matching snippet files are added.
- Do not add filler rows; only index files that actually exist.

## Update rules

1. Add an entry for each new snippet file at creation time.
2. Update or remove entries when snippet files are moved, renamed, or deleted.
3. Keep category values restricted to the canonical list in this document.
4. Keep paths repository-relative and verify each path exists before committing.
5. Keep purpose/reuse/caveats concise and operational so agents can apply snippets safely.
6. If a file is documentation-only but drives snippet usage workflow, categorize it as `workflow-docs`.
