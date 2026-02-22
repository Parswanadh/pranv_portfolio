@echo off
echo ========================================
echo Clearing Next.js and Build Caches
echo ========================================
echo.

REM Stop any running Next.js processes
echo Stopping any running Next.js processes...
taskkill /F /IM node.exe 2>nul

REM Clear Next.js cache
echo Clearing .next cache...
if exist .next (
    rmdir /s /q .next
    echo .next cache cleared
)

REM Clear node_modules/.cache
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo node_modules\.cache cleared
)

echo.
echo ========================================
echo Caches cleared successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
echo 3. Test the navigation links
echo.
pause
