# Hero Role Loop

Reusable hero text animation for portfolio sites.

## Plain HTML usage

Include the CSS and JS:

```html
<link rel="stylesheet" href="/plugins/hero-role-loop/hero-role-loop.css">
<script src="/plugins/hero-role-loop/hero-role-loop.js"></script>
```

Add a mount element:

```html
<div
  data-hero-role-loop
  data-label="I AM A(N)"
  data-roles="Product,Interactive,Motion"
  data-fixed="Designer"
  data-interval="2100"
></div>
```

The plugin auto-mounts on page load. If GSAP exists, it uses GSAP for blur/slide/spring motion; otherwise it still renders the first role.

## Framer usage

Copy `HeroRoleLoop.framer.tsx` into a Framer code file, then drag the component into the hero section above the Spline embed.
