
# Glassmorphism Test Guide for Iris Chat Panel

## Manual Testing Steps

### Mobile Test (375px viewport):
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set viewport to 375px x 667px (iPhone SE)
4. Navigate to http://localhost:3002
5. Click the Iris floating button (bottom-right corner)
6. Verify the following:

#### Glassmorphism Effect:
□ Chat panel has backdrop-blur-md (medium blur effect)
□ Background is semi-transparent (bg-bg-secondary/90)
□ Border is visible (border-border-default/50)
□ Content behind panel is blurred but visible
□ Text is clearly readable against the blurred background

#### Responsive Behavior:
□ Panel width uses left-4 right-4 on mobile (32px total margins)
□ Panel max-width is 100% on mobile
□ Panel switches to fixed width (md:w-96 = 384px) on desktop
□ No horizontal overflow occurs
□ Panel stays within viewport bounds

#### Z-Index Layering:
□ Chat panel has z-[10001]
□ Panel appears above particle effects
□ Panel appears above all other content
□ Floating button also has z-[10001]

#### Particle Opacity (Mobile):
□ Particles opacity is reduced to 0.25 (25%)
□ Particles are more subtle on mobile
□ Background is not too busy behind chat panel

### Desktop Test (1280px viewport):
1. Change viewport to 1280px x 720px
2. Navigate to http://localhost:3002
3. Click the Iris floating button
4. Verify the following:

□ Panel width is 384px (md:w-96)
□ Panel is positioned right-6 (24px from right)
□ Panel has same glassmorphism effect
□ Glassmorphism works on larger viewport
□ Responsive width switches correctly

## Console Test Script
Copy and paste this into the browser console:

/**
 * Glassmorphism Test Script for Iris Chat Panel
 * Run this in the browser console after loading the portfolio
 */

(async function testIrisGlassmorphism() {
  console.log('=== Testing Iris Chat Panel Glassmorphism ===\n');

  // Test 1: Find and click Iris button
  console.log('1. Looking for Iris button...');
  const irisButton = Array.from(document.querySelectorAll('button')).find(btn =>
    btn.getAttribute('aria-label')?.includes('Chat with Iris') ||
    btn.textContent.includes('Chat with Iris')
  );

  if (!irisButton) {
    console.error('❌ Iris button not found!');
    return;
  }

  console.log('✓ Found Iris button');
  console.log('  - Button classes:', irisButton.className);
  console.log('  - Button aria-label:', irisButton.getAttribute('aria-label'));

  // Test 2: Click to open chat
  console.log('\n2. Clicking Iris button to open chat...');
  irisButton.click();

  // Wait for chat panel to appear
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Test 3: Find chat panel
  console.log('\n3. Looking for chat panel...');
  const chatPanel = document.querySelector('[class*="fixed"][class*="backdrop-blur-md"]') ||
                   document.querySelector('[class*="fixed"][class*="z-\\[10001\\]"]');

  if (!chatPanel) {
    console.error('❌ Chat panel not found!');
    console.log('Searching for any fixed dialogs...');
    const allFixed = Array.from(document.querySelectorAll('[class*="fixed"]'));
    console.log('Found fixed elements:', allFixed.length);
    return;
  }

  console.log('✓ Found chat panel');

  // Test 4: Check glassmorphism styles
  console.log('\n4. Checking glassmorphism styles...');
  const styles = window.getComputedStyle(chatPanel);

  console.log('  Background:', styles.background);
  console.log('  Backdrop Filter:', styles.backdropFilter);
  console.log('  Webkit Backdrop Filter:', styles.webkitBackdropFilter);
  console.log('  Border:', styles.border);
  console.log('  Border Radius:', styles.borderRadius);
  console.log('  Box Shadow:', styles.boxShadow);
  console.log('  Z-Index:', styles.zIndex);
  console.log('  Width:', styles.width);
  console.log('  Max Width:', styles.maxWidth);
  console.log('  Height:', styles.height);
  console.log('  Max Height:', styles.maxHeight);

  // Test 5: Verify glassmorphism properties
  console.log('\n5. Verifying glassmorphism properties...');

  const hasBackdropBlur = styles.backdropFilter.includes('blur') ||
                         styles.webkitBackdropFilter.includes('blur');
  console.log(`  Backdrop blur present: ${hasBackdropBlur ? '✓' : '❌'}`);

  const hasTranslucentBg = styles.background.includes('rgba') ||
                          styles.background.includes('/') ||
                          parseFloat(styles.opacity) < 1;
  console.log(`  Translucent background: ${hasTranslucentBg ? '✓' : '❌'}`);

  const hasBorder = styles.border !== 'none';
  console.log(`  Border present: ${hasBorder ? '✓' : '❌'}`);

  const hasShadow = styles.boxShadow !== 'none';
  console.log(`  Shadow present: ${hasShadow ? '✓' : '❌'}`);

  const highZIndex = parseInt(styles.zIndex) > 1000;
  console.log(`  High z-index (${styles.zIndex}): ${highZIndex ? '✓' : '❌'}`);

  // Test 6: Check responsive width
  console.log('\n6. Checking responsive width...');
  const viewportWidth = window.innerWidth;
  console.log(`  Viewport width: ${viewportWidth}px`);

  if (viewportWidth < 768) {
    // Mobile
    console.log('  ✓ Mobile viewport detected');
    const expectedWidth = `calc(${viewportWidth}px - 32px)`; // left-4 right-4 = 16px each side
    console.log(`  Expected width: ${expectedWidth} (with 32px margins)`);
    console.log(`  Actual width: ${styles.width}`);
    console.log(`  Max width: ${styles.maxWidth}`);
  } else {
    // Desktop
    console.log('  ✓ Desktop viewport detected');
    console.log(`  Expected width: 384px (md:w-96)`);
    console.log(`  Actual width: ${styles.width}`);
    console.log(`  Max width: ${styles.maxWidth}`);
  }

  // Test 7: Check particles opacity
  console.log('\n7. Checking particles opacity...');
  const particlesContainer = document.querySelector('[class*="particle"]') ||
                            document.querySelector('#webgpu-particles') ||
                            document.querySelector('[class*="WebGPU"]');

  if (particlesContainer) {
    const particleStyles = window.getComputedStyle(particlesContainer);
    const opacity = particleStyles.opacity;
    console.log(`  Particles opacity: ${opacity}`);

    if (viewportWidth < 768) {
      const expectedOpacity = 0.25;
      const actualOpacity = parseFloat(opacity);
      console.log(`  Expected opacity on mobile: ${expectedOpacity}`);
      console.log(`  Actual opacity: ${actualOpacity}`);
      console.log(`  Particles opacity reduction: ${actualOpacity <= expectedOpacity ? '✓' : '❌'}`);
    }
  } else {
    console.log('  ⚠ Particles container not found');
  }

  // Test 8: Check for horizontal overflow
  console.log('\n8. Checking for horizontal overflow...');
  const body = document.body;
  const html = document.documentElement;

  console.log(`  Body scrollWidth: ${body.scrollWidth}px`);
  console.log(`  Body clientWidth: ${body.clientWidth}px`);
  console.log(`  HTML scrollWidth: ${html.scrollWidth}px`);
  console.log(`  HTML clientWidth: ${html.clientWidth}px`);

  const hasOverflow = body.scrollWidth > body.clientWidth || html.scrollWidth > html.clientWidth;
  console.log(`  Horizontal overflow: ${hasOverflow ? '❌ YES' : '✓ NO'}`);

  // Test 9: Verify z-index layering
  console.log('\n9. Verifying z-index layering...');
  const floatingButton = Array.from(document.querySelectorAll('button')).find(btn =>
    btn.getAttribute('aria-label')?.includes('Chat with Iris')
  );

  if (floatingButton) {
    const buttonZIndex = window.getComputedStyle(floatingButton).zIndex;
    console.log(`  Floating button z-index: ${buttonZIndex}`);
    console.log(`  Chat panel z-index: ${styles.zIndex}`);
    console.log(`  Same z-index: ${buttonZIndex === styles.zIndex ? '✓' : '❌'}`);
  }

  // Test 10: Visual verification points
  console.log('\n10. Visual verification checklist:');
  console.log('  Manual checks needed:');
  console.log('    □ Chat panel has frosted glass effect (blur behind content)');
  console.log('    □ Background content is visible through the panel');
  console.log('    □ Panel is clearly readable despite transparency');
  console.log('    □ Panel appears above particles (z-index check)');
  console.log('    □ Panel doesn\'t overflow horizontally on mobile');
  console.log('    □ Panel width is responsive (mobile vs desktop)');
  console.log('    □ Particles are more subtle on mobile (25% opacity)');

  console.log('\n=== Test Complete ===');
  console.log('\nTo take a screenshot for visual verification, run:');
  console.log('  - In DevTools: Cmd+Shift+P > "Capture full size screenshot"');
  console.log('  - Or use Playwright MCP: browser_take_screenshot');

  // Return test results for programmatic access
  return {
    chatPanelFound: !!chatPanel,
    hasGlassmorphism: hasBackdropBlur && hasTranslucentBg,
    hasBackdropBlur,
    hasTranslucentBg,
    zIndex: styles.zIndex,
    width: styles.width,
    maxWidth: styles.maxWidth,
    hasHorizontalOverflow: hasOverflow,
    viewportWidth
  };
})();

