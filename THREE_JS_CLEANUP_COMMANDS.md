# Three.js Fixes - Cleanup Commands

**Date:** 2026-02-18

This file contains the exact commands needed to complete the Three.js fixes.

---

## Step 1: Delete Old Files

### Using Git Bash (Unix-style):
```bash
cd /d/projects/portfolio

# Remove the old WebGpuParticles component
rm components/WebGpuParticles.tsx

# Remove the .disabled files
rm components/Architecture3D.tsx.disabled
rm components/Architecture3DErrorBoundary.tsx.disabled
rm components/ArchitectureViewer.tsx.disabled

# Verify files are gone
ls components/*.disabled 2>/dev/null || echo "All .disabled files removed"
ls components/WebGpuParticles.tsx 2>/dev/null || echo "Old component removed"
```

### Using Windows PowerShell:
```powershell
cd D:\projects\portfolio

# Remove the old WebGpuParticles component
Remove-Item components\WebGpuParticles.tsx

# Remove the .disabled files
Remove-Item components\Architecture3D.tsx.disabled
Remove-Item components\Architecture3DErrorBoundary.tsx.disabled
Remove-Item components\ArchitectureViewer.tsx.disabled

# Verify files are gone
Get-ChildItem components\*.disabled -ErrorAction SilentlyContinue
```

### Using Windows Command Prompt:
```cmd
cd D:\projects\portfolio

del components\WebGpuParticles.tsx
del components\Architecture3D.tsx.disabled
del components\Architecture3DErrorBoundary.tsx.disabled
del components\ArchitectureViewer.tsx.disabled
```

---

## Step 2: Verify the Build

```bash
npm run build
```

Expected output:
- Build completes successfully
- No errors about missing WebGpuParticles
- No TypeScript errors

---

## Step 3: Test Development Server

```bash
npm run dev
```

Then:
1. Open http://localhost:3000
2. Check for particle animation
3. Open browser console (F12)
4. Verify no errors

---

## Step 4: Verify Cleanup

Run this test script to verify cleanup is working:

```javascript
// Paste this in browser console on homepage
let navigationCount = 0;
const startMemory = performance.memory?.usedJSHeapSize || 0;

console.log('Starting cleanup test...');
console.log('Initial memory:', startMemory);

// Navigate away and back 5 times
const interval = setInterval(() => {
  navigationCount++;
  window.location.hash = navigationCount % 2 === 0 ? '' : '#test';

  if (navigationCount >= 10) {
    clearInterval(interval);
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryGrowth = endMemory - startMemory;
    const growthPercent = ((memoryGrowth / startMemory) * 100).toFixed(2);

    console.log('Final memory:', endMemory);
    console.log('Memory growth:', memoryGrowth, 'bytes (' + growthPercent + '%)');

    if (growthPercent < 5) {
      console.log('✓ Cleanup working properly - minimal memory growth');
    } else {
      console.warn('⚠ Possible memory leak detected - significant memory growth');
    }
  }
}, 2000);
```

Expected result:
- Memory growth should be minimal (< 5%)
- No continuous memory increase
- Console shows "✓ Cleanup working properly"

---

## Step 5: Check for Old References

Search for any remaining references to the old component name:

```bash
cd /d/projects/portfolio

# Search for imports of the old component
grep -r "WebGpuParticles" --include="*.tsx" --include="*.ts" app/ components/ lib/ \
  --exclude-dir=deprecated \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  || echo "No references found in active code"
```

---

## Step 6: Git Status Check

```bash
git status
```

Expected changes:
- Modified: `app/layout.tsx`
- New file: `components/CanvasParticles.tsx`
- New file: `components/deprecated/` (directory)
- Deleted: `components/WebGpuParticles.tsx`
- Deleted: `components/*.disabled` files

---

## Step 7: Commit Changes

If everything looks good:

```bash
git add -A
git commit -m "refactor(three.js): Fix component naming and cleanup disabled files

- Rename WebGpuParticles.tsx to CanvasParticles.tsx (uses Canvas 2D, not WebGPU)
- Move disabled Three.js components to components/deprecated/
- Update app/layout.tsx imports
- Enhance cleanup documentation for canvas components

Fixes issues #2 and #11 from FINDINGS.md
"
```

---

## Troubleshooting

### Build Fails
If build fails with "Cannot find module '@/components/WebGpuParticles'":
1. Check that `app/layout.tsx` was updated correctly
2. Verify `components/CanvasParticles.tsx` exists
3. Clear Next.js cache: `rm -rf .next`

### Runtime Error
If you get runtime errors about missing components:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server

### Memory Leaks
If memory growth is significant:
1. Check browser console for errors
2. Verify cleanup is running (add console.log in cleanup function)
3. Check that all event listeners are removed

---

## Verification Checklist

- [ ] Old files deleted
- [ ] Build succeeds
- [ ] Dev server runs without errors
- [ ] Particles visible on homepage
- [ ] Mouse interaction works
- [ ] Memory stable over time
- [ ] No console errors
- [ ] Mobile view works correctly
- [ ] Git status shows expected changes

---

## Summary

**Files Modified:** 1
- `app/layout.tsx`

**Files Created:** 5
- `components/CanvasParticles.tsx`
- `components/deprecated/Architecture3D.tsx`
- `components/deprecated/Architecture3DErrorBoundary.tsx`
- `components/deprecated/ArchitectureViewer.tsx`
- `components/deprecated/README.md`

**Files Deleted:** 4
- `components/WebGpuParticles.tsx`
- `components/Architecture3D.tsx.disabled`
- `components/Architecture3DErrorBoundary.tsx.disabled`
- `components/ArchitectureViewer.tsx.disabled`

**Net Change:** +2 files (better organized, clearer naming)

---

**Status:** Ready for cleanup and testing
