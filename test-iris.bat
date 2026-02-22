@echo off
REM IRIS CHAT FEATURE - QUICK TEST
REM Run this to verify the Iris chat feature is properly configured

echo ========================================
echo IRIS CHAT FEATURE - QUICK TEST
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js first
    pause
    exit /b 1
)

REM Check if .env.local exists
echo [1/4] Checking environment configuration...
if exist .env.local (
    echo OK: .env.local found

    REM Check for API keys
    findstr /C:"GROQ_API_KEY=" .env.local >nul
    if errorlevel 1 (
        echo WARNING: GROQ_API_KEY not found in .env.local
    ) else (
        echo OK: GROQ_API_KEY present
    )

    findstr /C:"DEEPGRAM_API_KEY=" .env.local >nul
    if errorlevel 1 (
        echo WARNING: DEEPGRAM_API_KEY not found in .env.local
    ) else (
        echo OK: DEEPGRAM_API_KEY present
    )
) else (
    echo WARNING: .env.local not found
    echo Please create .env.local with your API keys
    echo.
    echo Example .env.local:
    echo   GROQ_API_KEY=your_groq_key_here
    echo   DEEPGRAM_API_KEY=your_deepgram_key_here
)

echo.
echo [2/4] Checking component files...
if exist components\IrisAssistant.tsx (
    echo OK: IrisAssistant.tsx found
) else (
    echo ERROR: IrisAssistant.tsx not found
)

if exist app\layout.tsx (
    echo OK: app\layout.tsx found
) else (
    echo ERROR: app\layout.tsx not found
)

if exist app\page.tsx (
    echo OK: app\page.tsx found
) else (
    echo ERROR: app\page.tsx not found
)

echo.
echo [3/4] Checking API routes...
if exist app\api\chat\route.ts (
    echo OK: Chat API route found
) else (
    echo ERROR: Chat API route not found
)

if exist app\api\tts\route.ts (
    echo OK: TTS API route found
) else (
    echo ERROR: TTS API route not found
)

echo.
echo [4/4] Checking library dependencies...
set LIBS_OK=1
if not exist lib\groq.ts (
    echo ERROR: lib\groq.ts not found
    set LIBS_OK=0
)
if not exist lib\deepgram.ts (
    echo ERROR: lib\deepgram.ts not found
    set LIBS_OK=0
)
if not exist lib\iris-session.ts (
    echo ERROR: lib\iris-session.ts not found
    set LIBS_OK=0
)
if not exist lib\voice-optimizer.ts (
    echo ERROR: lib\voice-optimizer.ts not found
    set LIBS_OK=0
)
if not exist lib\page-context.ts (
    echo ERROR: lib\page-context.ts not found
    set LIBS_OK=0
)
if not exist lib\navigation-intent.ts (
    echo ERROR: lib\navigation-intent.ts not found
    set LIBS_OK=0
)
if not exist lib\proactive-suggestions.ts (
    echo ERROR: lib\proactive-suggestions.ts not found
    set LIBS_OK=0
)

if %LIBS_OK%==1 (
    echo OK: All library dependencies found
)

echo.
echo ========================================
echo TEST COMPLETE
echo ========================================
echo.
echo Next Steps:
echo 1. Ensure .env.local has API keys:
echo    GROQ_API_KEY=your_key_here
echo    DEEPGRAM_API_KEY=your_key_here
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Open browser to:
echo    http://localhost:3000
echo.
echo 4. Click "Chat with Iris" button (bottom right)
echo.
echo 5. Send a test message:
echo    "What are Balcha's top skills?"
echo.
echo ========================================
pause
