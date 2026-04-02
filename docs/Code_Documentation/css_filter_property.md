# CSS `filter` Property

This file summarises the CSS `filter` property as documented on MDN.  The `filter` property applies graphical effects to an element’s rendering, such as blurring, adjusting contrast, or converting to grayscale.

## Description

The `filter` property allows you to apply **graphical effects like blur or color shift** to an element【751407831210614†L213-L218】.  It is commonly used on images, backgrounds, and borders.  The feature is widely supported across modern browsers and has been available since September 2016【751407831210614†L200-L205】.

## Syntax

The property accepts one or more **filter functions** or the keyword `none`【751407831210614†L312-L314】.  When multiple functions are provided, the effects are applied in the order declared【751407831210614†L318-L320】.

Example syntax:

```css
/* Single filter function */
filter: blur(5px);
filter: contrast(200%);

/* Multiple filters */
filter: contrast(175%) brightness(103%);

/* No filter */
filter: none;

/* Global values */
filter: inherit;
filter: initial;
filter: revert;
filter: unset;
```

You can also reference an external SVG `<filter>` element with `url('file.svg#filter-id')`【751407831210614†L301-L309】.

## Common filter functions

MDN lists several built‑in functions【751407831210614†L321-L417】:

- **`blur(r)`** – Applies a Gaussian blur of radius `r` pixels【751407831210614†L321-L327】.
- **`brightness(p)`** – Multiplies the brightness by `p`.  A value of `0%` produces a black image; `100%` leaves the image unchanged【751407831210614†L331-L334】.
- **`contrast(p)`** – Adjusts contrast.  `0%` results in a gray image; values greater than `100%` increase contrast【751407831210614†L342-L346】.
- **`drop-shadow(offsetX offsetY blurRadius color)`** – Applies a drop shadow following the image’s contour【751407831210614†L349-L356】.
- **`grayscale(p)`** – Converts the image to grayscale.  `100%` is fully gray; `0%` leaves the input unchanged【751407831210614†L361-L365】.
- **`hue-rotate(angle)`** – Rotates the hue by `angle` degrees around the color circle【751407831210614†L371-L379】.
- **`invert(p)`** – Inverts the image colors.  `100%` fully inverts; `0%` leaves the image unchanged【751407831210614†L381-L385】.
- **`opacity(p)`** – Adjusts opacity, where `0%` is fully transparent and `100%` is fully opaque【751407831210614†L392-L399】.
- **`saturate(p)`** – Adjusts color saturation.  `0%` desaturates to grayscale; values above `100%` increase saturation【751407831210614†L400-L404】.
- **`sepia(p)`** – Applies a sepia tone.  `100%` yields a completely sepia image; `0%` leaves the image unchanged【751407831210614†L409-L413】.

### Combining functions

Multiple filter functions may be combined.  For example, `filter: contrast(175%) brightness(103%);` increases the contrast and brightness【751407831210614†L418-L426】.

### Examples

```css
.blurred {
  filter: blur(5px);
}

.grayscale {
  filter: grayscale(100%);
}

.fancy {
  filter: contrast(150%) brightness(120%) hue-rotate(45deg);
}
```

These examples illustrate how to adjust an element’s visual appearance with a single property.

For more advanced usage and a full list of functions, see the [MDN filter documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/filter).