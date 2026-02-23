# Theme Color Reference Guide

## Quick Reference

### Primary Accent Colors
```css
/* Electric Indigo - Primary */
--color-accent-primary: #6366f1
accent-primary: #6366f1
rgba(99, 102, 241, <opacity>)

/* Purple - Secondary */
--color-accent-secondary: #8b5cf6
accent-secondary: #8b5cf6
rgba(139, 92, 246, <opacity>)

/* Cyan - Tertiary */
--color-accent-tertiary: #06b6d4
accent-tertiary: #06b6d4
rgba(6, 182, 212, <opacity>)

/* Glow Effect */
--color-accent-glow: rgba(99, 102, 241, 0.4)
accent-glow: rgba(99, 102, 241, 0.4)
```

### Tailwind Utility Classes

```jsx
// Text colors
text-accent-primary      // #6366f1
text-accent-secondary    // #8b5cf6
text-accent-tertiary     // #06b6d4

// Background colors
bg-accent-primary        // #6366f1
bg-accent-secondary      // #8b5cf6
bg-accent-tertiary       // #06b6d4

// Border colors
border-accent-primary    // #6366f1

// Hover states
hover:text-accent-primary
hover:bg-accent-primary
hover:border-accent-primary
```

### CSS Variables
```css
var(--color-accent-primary)    /* #6366f1 */
var(--color-accent-secondary)  /* #8b5cf6 */
var(--color-accent-tertiary)   /* #06b6d4 */
var(--color-accent-glow)       /* rgba(99, 102, 241, 0.4) */
var(--color-text-accent)       /* #6366f1 */
var(--color-border-accent)     /* rgba(99, 102, 241, 0.3) */
```

## Usage Examples

### React Components
```jsx
// Tailwind classes
<button className="bg-accent-primary hover:bg-accent-secondary text-white">
  Click Me
</button>

// Inline styles with CSS variables
<div style={{ color: 'var(--color-accent-primary)' }}>
  Highlighted text
</div>

// Direct hex values
<span style={{ color: '#6366f1' }}>Accent text</span>
```

### Canvas Drawing
```javascript
// Solid color
ctx.strokeStyle = '#6366f1'
ctx.fillStyle = '#6366f1'

// With opacity
ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)'
ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'

// Gradients
const gradient = ctx.createLinearGradient(0, 0, width, 0)
gradient.addColorStop(0, '#6366f1')
gradient.addColorStop(0.5, '#8b5cf6')
gradient.addColorStop(1, '#06b6d4')
ctx.fillStyle = gradient
```

### CSS Styles
```css
.custom-element {
  color: var(--color-accent-primary);
  background: var(--color-accent-glow);
  border: 1px solid var(--color-border-accent);
  box-shadow: 0 0 20px var(--color-accent-glow);
}

.custom-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
}

.custom-glow {
  text-shadow: 0 0 10px var(--color-accent-glow);
}
```

## Color Variations

### Opacity Levels
```css
/* Primary Accent - Various Opacities */
rgba(99, 102, 241, 1.0)    /* Full opacity */
rgba(99, 102, 241, 0.8)    /* 80% - Particle effect */
rgba(99, 102, 241, 0.6)    /* 60% - Active edges */
rgba(99, 102, 241, 0.4)    /* 40% - Glow effect */
rgba(99, 102, 241, 0.3)    /* 30% - Border accent */
rgba(99, 102, 241, 0.15)   /* 15% - Subtle edges */
rgba(99, 102, 241, 0.1)    /* 10% - Background tint */
rgba(99, 102, 241, 0)      /* Transparent */
```

### Hover States
```css
/* Node hover (QuantumGraph) */
#6366f1 → #818cf8 (lighter indigo)

/* Button hover */
#6366f1 → #8b5cf6 (purple)

/* Link hover */
#6366f1 → #06b6d4 (cyan)
```

## Gradient Presets

### Linear Gradients
```css
/* Horizontal fade */
linear-gradient(90deg, #6366f1 0%, rgba(99, 102, 241, 0) 100%)

/* Diagonal spectrum */
linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)

/* Vertical fade */
linear-gradient(180deg, #6366f1 0%, rgba(99, 102, 241, 0) 100%)

/* Subtle tint */
linear-gradient(rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 100%)
```

### Radial Gradients
```css
/* Glow effect */
radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0) 70%)

/* Center focus */
radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 100%)

/* Node glow */
radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 100%)
```

## Best Practices

### DO
- Use CSS variables for consistency
- Maintain opacity for depth and layering
- Use gradients for visual interest
- Test contrast ratios for accessibility
- Use lighter shades (#818cf8) for hover states

### DON'T
- Hardcode hex values in components (use Tailwind or CSS vars)
- Use the old orange color (#f5a623)
- Mix opacity levels inconsistently
- Forget to update canvas drawing code
- Ignore accessibility in color choices

## Component-Specific Usage

### Buttons
```jsx
<button className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-lg transition-all">
  Primary Action
</button>
```

### Links
```jsx
<a href="#" className="text-accent-primary hover:text-accent-secondary transition-colors">
  Link text
</a>
```

### Cards
```jsx
<div className="border border-border-default hover:border-accent-primary transition-all">
  Card content
</div>
```

### Glows/Effects
```jsx
<div className="shadow-[0_0_20px_rgba(99,102,241,0.4)]">
  Glowing element
</div>
```

## Accessibility

### Contrast Requirements
- Minimum contrast: 4.5:1 (AA)
- Enhanced contrast: 7:1 (AAA)
- All accent colors meet AAA on dark backgrounds

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Respect user's motion preferences */
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## Migration from Old Colors

| Old Color | New Color | Context |
|-----------|-----------|---------|
| `#f5a623` | `#6366f1` | Primary accent |
| `#d4a574` | `#8b5cf6` | Secondary accent |
| `#8b7355` | `#06b6d4` | Tertiary accent |
| `rgba(245, 166, 35, 0.4)` | `rgba(99, 102, 241, 0.4)` | Glow effect |
| `#ffd700` | `#818cf8` | Hover state |

**Updated**: 2026-02-23
