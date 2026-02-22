# Refactoring Quick Reference

## IrisAssistant - File Structure

```
components/iris/
├── types.ts                    # All TypeScript interfaces
├── constants.ts                # EXAMPLE_QUESTIONS, QUICK_ACTIONS, prompts
├── IrisMessageItem.tsx         # Single message display
├── IrisHeader.tsx              # Top bar with avatar, sound, close
├── IrisInput.tsx               # Text input + send button
├── IrisSuggestions.tsx         # Onboarding + suggestion chips
├── IrisClearConfirm.tsx        # Clear conversation dialog
├── IrisSessionInfo.tsx         # Current page + topics display
└── hooks/
    ├── useIrisChat.ts          # API calls, streaming, navigation
    ├── useIrisAudio.ts         # TTS playback, audio events
    ├── useIrisSession.ts       # Session state, preferences
    └── useIrisSuggestions.ts   # Suggestion logic
```

## ProjectDemo - File Structure

```
components/project-demo/
├── types.ts                    # ProjectId, DemoType, interfaces
├── demo-content.ts             # DEMO_CONTENT with all code snippets
└── demos/
    ├── WhisperSTTDemo.tsx      # Waveform canvas + transcription
    ├── CLITourDemo.tsx         # Terminal mockup
    ├── AutoGitDemo.tsx         # Multi-agent log simulation
    ├── MultimodalDemo.tsx      # Image analysis
    └── index.ts                # Barrel export
```

## Key Improvements

### Before
```
IrisAssistant.tsx   883 lines  ❌ Too large
ProjectDemo.tsx     1395 lines  ❌ Way too large
```

### After
```
IrisAssistant (main)      ~300 lines  ✅
└── Largest file:         180 lines  ✅

ProjectDemo (main)        ~250 lines  ✅
└── Largest file:         320 lines  ✅
```

## Migration Commands

```bash
# 1. Backup originals
cp components/IrisAssistant.tsx components/IrisAssistant.tsx.backup
cp components/ProjectDemo.tsx components/ProjectDemo.tsx.backup

# 2. Test refactored versions
# (Update imports temporarily to test)

# 3. Replace when ready
mv components/IrisAssistant.refactored.tsx components/IrisAssistant.tsx
mv components/ProjectDemo.refactored.tsx components/ProjectDemo.tsx

# 4. Clean up backups
rm components/IrisAssistant.tsx.backup
rm components/ProjectDemo.tsx.backup
```

## Import Changes Required

None! The refactored components export the same API.

```tsx
// This still works
import IrisAssistant from '@/components/IrisAssistant'
import ProjectDemo from '@/components/ProjectDemo'

// Usage unchanged
<IrisAssistant />
<ProjectDemo projectId="whisper-stt" demoType="interactive" />
```

## Testing Checklist

- [ ] Chat functionality works
- [ ] Audio playback works
- [ ] Suggestions appear correctly
- [ ] Navigation from chat works
- [ ] All demo types render
- [ ] Code snippets display
- [ ] Interactive demos function
- [ ] No console errors
- [ ] Responsive design intact
