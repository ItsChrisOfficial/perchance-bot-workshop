# Perchance AI Character Chat – Message Styling

This document summarises the **Message Styling** section of the Perchance AI Character Chat documentation.  Message styling allows you to customise how your character’s messages appear to the user by applying CSS rules.

## Overview

Within the advanced character editor, there is an input field labeled **message style**.  The value of this field is CSS applied to every message by default.  You can style fonts, colors, borders, alignment, margins, and many other aspects of how messages are rendered.

### Light and dark mode

The chat interface supports both light and dark themes, automatically selected based on the user’s device or OS settings.  To ensure readability, use the `light-dark(a, b)` function in your CSS values.  For example:

```css
color: light-dark(blue, red);
```

This sets the text color to blue in light mode and red in dark mode.  Always test your styles in both themes to avoid poor contrast.

## Common styling examples

Below are some common CSS snippets to customise message appearance.  You can combine these or adapt them for your character.

* **Change text color and weight**

  ```css
  color: light-dark(#333333, #dddddd);
  font-weight: bold;
  ```

* **Add a border and padding**

  ```css
  border: 2px solid light-dark(#444, #bbb);
  padding: 0.5rem;
  border-radius: 8px;
  ```

* **Center-align messages and limit width**

  ```css
  display: block;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  ```

* **Change font family**

  ```css
  font-family: 'Georgia', serif;
  ```

* **Alternate colors for code blocks**

  ```css
  code {
    background-color: light-dark(#f0f0f0, #202020);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  ```

## Tips

* Keep CSS simple and avoid hard‑coded colors that only work in one theme.
* Use responsive units (e.g., rem, %, vh) rather than absolute pixel values where possible.
* Test on both desktop and mobile to ensure readability.
* Consider accessibility: ensure sufficient contrast and avoid flashing colors or animations that may cause discomfort.

## See also

For more advanced styling options and examples, refer to CSS references such as [MDN’s CSS documentation](css_filter_property.md) and general web design resources.  The Perchance community often shares creative styling snippets on forums and example generators.