# GitHub Markdown: Basic Writing and Formatting Syntax

This document distills key points from GitHub’s “Basic writing and formatting syntax” guide.  It covers the core Markdown features used in README files, issues, and pull requests on GitHub.

## Headings

To create a heading, prefix your heading text with one to six `#` symbols.  The number of `#` marks determines the level and typeface size【839170744428519†L189-L193】.  For example:

```markdown
# First‑level heading
## Second‑level heading
### Third‑level heading
```

When your document includes two or more headings, GitHub automatically generates a table of contents accessible via the “Outline” menu in the file header【839170744428519†L202-L205】.

## Styling text

GitHub supports several ways to emphasize text【839170744428519†L210-L224】:

| Style             | Syntax                             | Example output                      |
|-------------------|------------------------------------|-------------------------------------|
| **Bold**          | `**text**` or `__text__`           | **text**                            |
| *Italic*          | `*text*` or `_text_`               | *text*                              |
| ~~Strikethrough~~ | `~~text~~`                         | ~~text~~                            |
| Bold & italic     | `***text***`                       | ***text***                          |
| Subscript         | `<sub>text</sub>`                  | text with subscript                 |
| Superscript       | `<sup>text</sup>`                  | text with superscript               |
| Underline         | `<ins>text</ins>`                  | text with underline                 |

Nested emphasis is also supported: `**This text is _extremely_ important**` becomes **This text is _extremely_ important**【839170744428519†L222-L224】.

## Quoting text and code

Use the `>` symbol to quote text【839170744428519†L233-L241】:

```markdown
> This is quoted text.
```

For inline code within a sentence, wrap the text in single backticks【839170744428519†L254-L262】.  To create a code block, use triple backticks before and after the code【839170744428519†L268-L276】:

```markdown
Use `git status` to list changed files.

```
git status
git add
git commit
```
```

GitHub also offers built‑in syntax highlighting when you specify the language after the opening backticks (for example, ````python```).

## Links

To insert a link, wrap the link text in brackets and the URL in parentheses【839170744428519†L316-L326】:

```markdown
This site was built using [GitHub Pages](https://pages.github.com/).
```

GitHub auto‑links plain URLs in comments and can create links to sections by hovering over a heading and copying the anchor【839170744428519†L336-L344】.

## Images

Images use a similar syntax to links but are prefixed with an exclamation mark.  For example:

```markdown
![Alt text](url/to/image.png)
```

## Lists and tasks

Use hyphens (`-`), asterisks (`*`), or numbers (`1.`, `2.`) to create unordered and ordered lists.  Task lists are created by including brackets and a space before the list text:

```markdown
- [ ] Incomplete task
- [x] Completed task
1. First item
2. Second item
```

## Color model highlighting

In issues and pull requests, GitHub renders colors when you wrap HEX, RGB, or HSL values in backticks【839170744428519†L286-L303】.  For example, `` `#0969DA` `` displays a blue color swatch.

## Additional features

GitHub Markdown supports many other features, including tables, task lists, mentions, emoji, and embedded HTML.  See the full GitHub Docs for more details.  This summary focuses on the basics: headings, emphasis, quoting, code blocks, links, lists, and images.