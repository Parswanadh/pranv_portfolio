# Bento Grid System - Quick Reference

## Import Statements

```tsx
// Core grid system
import { BentoGrid, BentoItem, BentoSize } from '@/components/BentoGrid'

// Pre-built cards
import {
  BentoHeroCard,
  BentoWideCard,
  BentoTallCard,
  BentoSmallCard,
  BentoMediumCard,
  BentoInfoCard,
  BentoCtaCard,
} from '@/components/BentoCard'

// Agent cards
import { BentoAgentCard } from '@/components/BentoAgentCard'

// Layout patterns
import {
  heroSectionPattern,
  featuredProjectsPattern,
  statsDashboardPattern,
} from '@/lib/bentoPatterns'
```

## Size Reference

| Size  | Mobile | Tablet | Desktop | Use Case                  |
|-------|--------|--------|---------|---------------------------|
| small | 1x1    | 1x1    | 1x1     | Stats, status, badges     |
| medium| 1x1    | 2x1    | 2x1     | Standard content          |
| large | 1x2    | 2x2    | 2x2     | Featured, important       |
| wide  | 2x1    | 2x1    | 2x1     | Horizontal content        |
| tall  | 1x2    | 1x2    | 1x2     | Vertical content, lists   |
| hero  | 2x2    | 2x2    | 2x2     | Main featured content     |

## Common Patterns

### Homepage Hero
```tsx
<BentoGrid items={heroSectionPattern({
  profile: { id: 'profile', content: <ProfileImage /> },
  name: { id: 'name', content: <NameCard /> },
  status: { id: 'status', content: <StatusCard /> },
  // ... etc
})} />
```

### Project Showcase
```tsx
<BentoGrid items={[
  BentoHeroCard(featuredProject, [
    { label: 'Stars', value: '1.2K' },
    { label: 'Forks', value: '234' },
  ]),
  BentoWideCard(project2, 'Featured'),
  BentoTallCard({ project: project3 }),
  BentoSmallCard({ project: project4 }),
]} />
```

### Stats Dashboard
```tsx
<BentoGrid items={[
  BentoInfoCard({
    id: 'stat1',
    title: 'Projects',
    value: '25+',
    icon: Code2,
    size: 'small',
  }),
  BentoInfoCard({
    id: 'stat2',
    title: 'Users',
    value: '1.2K',
    icon: Users,
    size: 'small',
    trend: { value: '+12%', positive: true },
  }),
]} />
```

### Agent Display
```tsx
<BentoGrid items={[
  BentoAgentCard({ agent: agent1, size: 'large' }),
  BentoAgentCard({ agent: agent2, size: 'medium' }),
  BentoAgentCard({ agent: agent3, size: 'small' }),
]} />
```

## Styling Utilities

### Gradients
```tsx
// Subtle gradient
className="bg-gradient-to-br from-bg-secondary to-bg-elevated"

// Accent gradient
className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10"

// Strong accent
className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20"
```

### Borders
```tsx
// Default
className="border border-border-default"

// Hover effect
className="hover:border-accent-primary transition-colors"

// Strong border
className="border-2 border-accent-primary/30"
```

### Animations
```tsx
// Scale on hover
whileHover={{ scale: 1.02 }}

// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

## Responsive Tips

1. **Mobile First**: Design for 1 column first
2. **Progressive Enhancement**: Add complexity at larger breakpoints
3. **Content Priority**: Most important content gets larger cards
4. **Touch Targets**: Minimum 44px for interactive elements
5. **Text Scaling**: Use `line-clamp` to truncate long text

## Best Practices

✅ **DO:**
- Use hero size for most important content
- Maintain visual hierarchy
- Keep content concise
- Use consistent spacing
- Test on all screen sizes
- Add hover effects for interactive cards

❌ **DON'T:**
- Overcrowd cards with content
- Use too many different sizes
- Ignore accessibility
- Make cards too small to read
- Forget responsive behavior
- Use jarring color combinations

## Common Issues & Solutions

### Issue: Cards not aligning properly
**Solution**: Ensure all cards in a row have compatible sizes

### Issue: Content overflowing
**Solution**: Use `line-clamp` and `overflow-hidden`

### Issue: Hover effects not working
**Solution**: Check z-index and pointer-events

### Issue: Mobile layout broken
**Solution**: Test with actual device, not just browser resize

## Migration Checklist

- [ ] Replace standard grid with BentoGrid
- [ ] Assign appropriate sizes to cards
- [ ] Test responsive behavior
- [ ] Verify accessibility
- [ ] Check performance
- [ ] Update documentation
- [ ] Test on multiple devices
