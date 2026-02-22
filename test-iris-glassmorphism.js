// This script will be executed in the browser console to test Iris glassmorphism
console.log('=== Testing Iris Glassmorphism Effect ===');

// 1. Find and click the Iris button
const irisButton = document.querySelector('button[aria-label*="Chat with Iris"]');
if (!irisButton) {
  console.log('Iris button not found, trying alternative selectors...');
  const allButtons = Array.from(document.querySelectorAll('button'));
  const chatButton = allButtons.find(btn => btn.textContent.includes('Chat with Iris') || btn.getAttribute('aria-label')?.includes('Iris'));
  if (chatButton) {
    console.log('Found Iris button via text content');
    chatButton.click();
  } else {
    console.error('Iris button not found!');
  }
} else {
  console.log('Clicking Iris button...');
  irisButton.click();
}

// Wait a moment for the panel to open
setTimeout(() => {
  // 2. Check for glassmorphism effect
  const chatPanel = document.querySelector('[class*="chat"][class*="panel"]') || 
                    document.querySelector('[class*="iris"][class*="chat"]') ||
                    document.querySelector('[role="dialog"]');
  
  if (chatPanel) {
    console.log('Chat panel found!');
    
    // Check computed styles for glassmorphism
    const styles = window.getComputedStyle(chatPanel);
    console.log('Background:', styles.background);
    console.log('Backdrop Filter:', styles.backdropFilter);
    console.log('Webkit Backdrop Filter:', styles.webkitBackdropFilter);
    console.log('Border Radius:', styles.borderRadius);
    console.log('Border:', styles.border);
    console.log('Box Shadow:', styles.boxShadow);
    console.log('Z-Index:', styles.zIndex);
    
    // Check if backdrop blur is applied
    const hasBackdropBlur = styles.backdropFilter.includes('blur') || 
                           styles.webkitBackdropFilter.includes('blur');
    console.log('Has backdrop blur:', hasBackdropBlur);
    
    // Check width for responsiveness
    console.log('Width:', styles.width);
    console.log('Max Width:', styles.maxWidth);
    console.log('Min Width:', styles.minWidth);
  } else {
    console.log('Chat panel not found. Checking for any modal/dialog...');
    const dialogs = document.querySelectorAll('[role="dialog"], dialog, .modal');
    console.log('Found dialogs/modals:', dialogs.length);
    dialogs.forEach((d, i) => {
      console.log(`Dialog ${i}:`, d.className);
    });
  }
  
  // 3. Check particles opacity
  const particles = document.querySelector('[class*="particle"]') || 
                   document.querySelector('[class*="Particle"]') ||
                   document.querySelector('#webgpu-particles');
  
  if (particles) {
    const particleStyles = window.getComputedStyle(particles);
    console.log('Particles opacity:', particleStyles.opacity);
    
    // Check if opacity is reduced on mobile
    const isMobile = window.innerWidth < 768;
    console.log('Is mobile viewport:', isMobile, '(width:', window.innerWidth + ')');
    
    if (isMobile) {
      const expectedOpacity = 0.25;
      const actualOpacity = parseFloat(particleStyles.opacity);
      console.log('Expected opacity on mobile:', expectedOpacity);
      console.log('Actual opacity:', actualOpacity);
      console.log('Opacity reduction verified:', actualOpacity <= expectedOpacity);
    }
  } else {
    console.log('Particles element not found');
  }
  
  // 4. Check for horizontal overflow
  const body = document.body;
  console.log('Body scrollWidth:', body.scrollWidth);
  console.log('Body clientWidth:', body.clientWidth);
  console.log('Has horizontal overflow:', body.scrollWidth > body.clientWidth);
  
  // 5. Log viewport info
  console.log('Viewport width:', window.innerWidth);
  console.log('Viewport height:', window.innerHeight);
  
}, 1000);
