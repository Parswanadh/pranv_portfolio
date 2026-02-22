# Gesture Navigation Implementation

## Overview
Mobile users can now navigate the portfolio using swipe gestures (left/right for next/previous page) with visual indicators and haptic feedback.

## Files Created

### 1. `hooks/useGestureNavigation.ts`
Custom hook that manages navigation state and provides:
- `goBack()`: Navigate to previous page in sequence
- `goForward()`: Navigate to next page in sequence
- `canGoBack`: Boolean indicating if previous page exists
- `canGoForward`: Boolean indicating if next page exists
- `currentPage`: Current pathname
- `pages`: Array of all pages in navigation order

### 2. `components/SwipeDetector.tsx`
Reusable swipe detection component with:
- Configurable threshold (default 50px)
- Support for horizontal and vertical swipes
- Hook-based API: `useSwipeDetector()`
- Component wrapper: `<SwipeDetector>`
- Touch-action optimization to prevent scroll interference

### 3. `components/SwipeNavigation.tsx`
Main swipe navigation component with:
- Integration with useGestureNavigation hook
- Haptic feedback on swipe completion
- Automatic detection of Iris chat state
- Configurable threshold (default 80px)

### 4. `components/SwipeIndicators.tsx`
Visual indicators for available navigation:
- Animated chevron buttons (left/right)
- Only visible on mobile touch devices
- Auto-hide when Iris chat is open
- Accessible keyboard support
- Smooth entrance/exit animations

### 5. `components/SwipeNavigationWrapper.tsx`
Client-side wrapper for layout integration:
- Mobile device detection
- Iris chat state monitoring
- Gesture enable/disable logic
- Haptic feedback coordination

## Page Navigation Order

Pages are arranged in this sequence:
1. `/` - Home
2. `/projects` - Projects
3. `/agents` - AI Agents
4. `/about` - About
5. `/contact` - Contact
6. `/leadership` - Leadership
7. `/research` - Research
8. `/tools` - Tools
9. `/resume` - Resume

## Integration

### Layout Integration (`app/layout.tsx`)
```tsx
import { SwipeNavigationWrapper } from '@/components/SwipeNavigationWrapper'

<SwipeNavigationWrapper>
  <div id="main-content">
    {children}
  </div>
</SwipeNavigationWrapper>
```

### Usage in Other Components
```tsx
import { useSwipeDetector } from '@/components/SwipeDetector'
import { useGestureNavigation } from '@/hooks/useGestureNavigation'

function MyComponent() {
  const { goBack, goForward } = useGestureNavigation()
  const handlers = useSwipeDetector({
    threshold: 80,
    onSwipeLeft: goForward,
    onSwipeRight: goBack,
  })

  return <div {...handlers}>Content</div>
}
```

## Features

### 1. Automatic Mobile Detection
- Only active on touch devices (< 768px width)
- Disabled on desktop
- Uses `ontouchstart` and `navigator.maxTouchPoints`

### 2. Iris Chat Integration
- Gestures automatically disabled when Iris chat is open
- Prevents conflict with text selection in chat
- DOM observer monitors chat state changes

### 3. Haptic Feedback
- Short 10ms vibration on successful swipe
- Only on devices that support `navigator.vibrate()`
- Can be disabled via `enableHapticFeedback` prop

### 4. Visual Indicators
- Animated chevron buttons on left/right edges
- Swipe direction hint (chevrons point in direction)
- Only show when navigation is available
- Clickable for direct navigation

### 5. Accessibility
- Keyboard support for indicators (Enter/Space)
- ARIA labels for screen readers
- Respects `prefers-reduced-motion`
- Minimum touch targets (44px - WCAG AAA)

### 6. Touch Optimization
- `touch-action: pan-y pinch-zoom` for smooth scrolling
- Configurable threshold to prevent accidental swipes
- Separate touch handlers for start/move/end events

## CSS Styles

Added to `app/globals.css`:
```css
/* Disable swipe navigation when Iris chat is open */
[data-swipe-enabled="false"] {
  touch-action: auto !important;
}

/* Hide swipe indicators on desktop */
@media (min-width: 768px) {
  .swipe-indicator {
    display: none !important;
  }
}

/* Swipe indicator touch feedback */
.swipe-indicator:active {
  transform: scale(0.95);
}
```

## Testing Recommendations

### 1. Manual Testing (iOS/Android)
```bash
# Test on real devices
npm run dev
# Open on mobile device via local network

# Test on iOS Simulator
# 1. Open Safari Develop menu
# 2. Select simulator
# 3. Test swipe gestures

# Test on Android Emulator
# 1. Run Android Studio emulator
# 2. Open Chrome DevTools
# 3. Toggle device toolbar
# 4. Select mobile device
```

### 2. Chrome DevTools Testing
```javascript
// Open DevTools → Console
// Test haptic feedback
navigator.vibrate(10)

// Test touch detection
'ontouchstart' in window
navigator.maxTouchPoints

// Test viewport
window.matchMedia('(max-width: 768px)').matches
```

### 3. Test Scenarios

#### Scenario 1: Basic Navigation
1. Open home page on mobile
2. Swipe left → should navigate to /projects
3. Swipe left again → should navigate to /agents
4. Swipe right → should navigate back to /projects
5. Verify indicators show correct availability

#### Scenario 2: Boundary Testing
1. Open home page (/)
2. Try swiping right → should NOT navigate (no previous page)
3. Navigate to /resume
4. Try swiping left → should NOT navigate (no next page)

#### Scenario 3: Iris Chat Integration
1. Open any page on mobile
2. Swipe left → should navigate to next page
3. Open Iris chat (click floating button)
4. Try swiping → should NOT navigate
5. Close Iris chat
6. Swipe left → should navigate again

#### Scenario 4: Visual Indicators
1. Open home page on mobile
2. Verify left indicator NOT shown (no previous page)
3. Verify right indicator shown (can go forward)
4. Navigate to /resume
5. Verify right indicator NOT shown (no next page)

#### Scenario 5: Haptic Feedback
1. Open on device with vibration support
2. Swipe left → should feel short vibration
3. Navigate and swipe again
4. Verify vibration on each successful swipe

#### Scenario 6: Reduced Motion
1. Enable prefers-reduced-motion in OS settings
2. Reload page
3. Swipe → should navigate
4. Verify indicators don't animate (static display)

#### Scenario 7: Touch Action Conflicts
1. Open a page with vertical scrolling
2. Scroll vertically → should work normally
3. Swipe horizontally → should trigger navigation
4. Verify no conflict between scroll and swipe

#### Scenario 8: Text Selection
1. Open any page with text content
2. Long press on text → should select text
3. Drag selection → should NOT trigger navigation
4. Swipe with short touch → should trigger navigation

### 4. Debug Mode

Add to browser console:
```javascript
// Check swipe state
document.querySelector('[data-swipe-enabled]')?.dataset

// Monitor touch events
document.addEventListener('touchstart', (e) => {
  console.log('Touch start:', e.touches[0].clientX, e.touches[0].clientY)
})

document.addEventListener('touchend', (e) => {
  console.log('Touch end:', e.changedTouches[0].clientX, e.changedTouches[0].clientY)
})

// Check Iris chat state
setInterval(() => {
  const chatPanel = document.querySelector('[class*="fixed bottom-6 right-6"][class*="z-[9999]"]')
  console.log('Iris open:', chatPanel?.children.length > 1)
}, 1000)
```

## Configuration Options

### SwipeDetector Component
```tsx
<SwipeDetector
  threshold={80}              // Min swipe distance in px
  disabled={false}            // Disable detection
  onSwipeLeft={() => {}}      // Left swipe callback
  onSwipeRight={() => {}}     // Right swipe callback
  onSwipeUp={() => {}}        // Up swipe callback
  onSwipeDown={() => {}}      // Down swipe callback
>
  {children}
</SwipeDetector>
```

### useSwipeDetector Hook
```tsx
const handlers = useSwipeDetector({
  threshold: 80,
  disabled: false,
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
})
```

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Touch Events | ✅ | ✅ | ✅ | ✅ |
| Vibration API | ✅ | ❌ | ❌ | ✅ |
| Touch Action | ✅ | ✅ | ✅ | ✅ |
| MutationObserver | ✅ | ✅ | ✅ | ✅ |

## Known Limitations

1. **Haptic Feedback**: Not supported on iOS Safari or Firefox (gracefully degrades)
2. **Dynamic Routes**: Current implementation doesn't handle dynamic routes like `/projects/[slug]`
3. **Horizontal Scrolling**: Pages with horizontal scrolling may conflict with swipe gestures
4. **Text Selection**: Long-press for text selection may accidentally trigger navigation

## Future Enhancements

1. Add configuration for custom page sequences
2. Support for dynamic routes in navigation order
3. Add swipe-to-go-back within project detail pages
4. Add gesture settings panel (enable/disable, adjust threshold)
5. Add visual feedback trail during swipe gesture
6. Support for multi-finger gestures (e.g., 2-finger swipe)

## Troubleshooting

### Issue: Swipe not working
**Solutions:**
- Verify device has touch capability: `'ontouchstart' in window`
- Check viewport width is < 768px
- Ensure Iris chat is closed
- Check console for errors

### Issue: Accidental navigation while scrolling
**Solutions:**
- Increase threshold (default 80px)
- Check `touch-action` CSS property
- Verify no horizontal scrollable elements

### Issue: Indicators not showing
**Solutions:**
- Verify on mobile device (< 768px)
- Check page has previous/next in navigation order
- Ensure Iris chat is closed
- Check Framer Motion is loaded

### Issue: Conflicts with horizontal scrolling
**Solutions:**
- Add `touch-action: pan-x` to horizontal scroll containers
- Increase swipe threshold
- Disable gestures on specific pages

## Performance Considerations

- MutationObserver for Iris chat state has minimal overhead
- Touch event handlers are passive by default
- Haptic feedback is async and non-blocking
- Indicator animations use GPU-accelerated transforms
- No layout thrashing from touch calculations

## Accessibility

- WCAG AAA compliant (44px minimum touch targets)
- Keyboard navigation support for indicators
- ARIA labels for screen readers
- Respects prefers-reduced-motion
- No focus traps from gesture handlers
