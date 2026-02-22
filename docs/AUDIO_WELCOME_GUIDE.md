# Audio Welcome System

## Overview
The Audio Welcome System provides a "spark moment" for visitors by playing a pre-recorded welcome message after the terminal boot animation completes. This creates a memorable first impression and introduces visitors to Balcha's portfolio in an engaging way.

## How It Works

### Component: `AudioWelcome.tsx`
- Listens for `terminal-boot-complete` event
- Checks if audio has already played this session (localStorage)
- Respects user sound preferences (soundEnabled)
- Shows visual indicator while playing
- Plays audio once per session

### Integration Points
1. **TerminalBoot.tsx**: Dispatches `terminal-boot-complete` event when boot completes
2. **app/layout.tsx**: Includes AudioWelcome component in root layout
3. **Audio File**: `/public/welcome-message.mp3` (to be added)

## Audio Recording Guide

### Script for Welcome Message

```
"Hi there! Welcome to Balcha's portfolio.

I'm Iris, Balcha's AI assistant, and I'm here to help you explore his work in AI and embedded systems.

Feel free to ask me anything about his projects, skills, or how we can collaborate.

Use the command palette with CMD+K to navigate quickly, or scroll down to see his featured projects.

Let's get started!"
```

**Estimated duration**: 12-15 seconds
**Word count**: ~55 words

### Recommended Voice Services

#### 1. ElevenLabs (Recommended)
- **Why**: Most natural AI voices available
- **Voice Suggestions**:
  - `Rachel` - Warm, professional, authentic
  - `Domi` - Friendly, energetic
  - `Bella` - Clear, articulate
- **Settings**:
  - Stability: 0.5 (balanced consistency)
  - Similarity Boost: 0.75 (high quality)
  - Style Exaggeration: 0.0 (natural delivery)
- **Cost**: Free tier available (10,000 characters/month)
- **Website**: https://elevenlabs.io

#### 2. Play.ht
- **Why**: Good variety of voices, easy to use
- **Voice Suggestions**:
  - `Jennifer (US)` - Professional, warm
  - `Mark (US)` - Friendly, approachable
- **Settings**:
  - Speed: 0.9 (slightly slower for clarity)
  - Pitch: 0 (natural)
- **Cost**: Free tier available
- **Website**: https://play.ht

#### 3. Narakeet
- **Why**: Affordable, reliable quality
- **Voice Suggestions**:
  - `Dempsey` - Professional, clear
  - `Hazel` - Warm, friendly
- **Cost**: Pay-as-you-go, very affordable
- **Website**: https://www.narakeet.com

### Voice Style Guidelines

**Tone**: Warm, welcoming, professional, authentic
**Pace**: Slightly slower than natural speech (for clarity)
**Emotion**: Friendly, enthusiastic but not over-the-top
**Articulation**: Clear, easy to understand
**Energy**: Moderate-high energy (engaging but not tiring)

### Recording Steps

#### Using ElevenLabs (Recommended):

1. **Create Account**:
   - Go to https://elevenlabs.io
   - Sign up for free tier

2. **Select Voice**:
   - Choose `Rachel` or `Domi` from voice library
   - Preview different voices to find best fit

3. **Configure Settings**:
   - Stability: 0.5
   - Similarity Boost: 0.75
   - Style Exaggeration: 0.0

4. **Generate Audio**:
   - Paste the script
   - Click "Generate"
   - Download as MP3

5. **Quality Check**:
   - Duration should be 12-15 seconds
   - Audio should be clear, no background noise
   - Voice should sound natural, not robotic
   - Volume should be consistent throughout

6. **Save File**:
   - Save as `welcome-message.mp3`
   - Place in `/public/` folder of portfolio

### Audio Quality Specifications

- **Format**: MP3
- **Bitrate**: 128 kbps (minimum), 192 kbps (recommended)
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Channels**: Mono or Stereo (Mono preferred for speech)
- **Duration**: 10-15 seconds maximum
- **File Size**: Under 500 KB (for fast loading)

### Testing

1. **Local Testing**:
   - Place `welcome-message.mp3` in `/public/`
   - Clear browser localStorage
   - Refresh page
   - Wait for terminal boot to complete
   - Audio should play automatically

2. **Sound Preference Testing**:
   - Open Iris chat
   - Click sound toggle to mute
   - Refresh page and clear localStorage
   - Audio should NOT play when sound is muted

3. **Session Testing**:
   - Play audio once
   - Refresh page
   - Audio should NOT play again (localStorage check)

### Troubleshooting

**Audio doesn't play**:
- Check browser console for errors
- Verify `/public/welcome-message.mp3` exists
- Check if sound is enabled in Iris
- Clear localStorage and try again

**Audio plays multiple times**:
- Check localStorage key `audioWelcomePlayed`
- Verify event listener cleanup

**Audio quality issues**:
- Re-generate with higher bitrate
- Check voice settings
- Try different voice model

**Autoplay blocked**:
- Browsers may block autoplay
- Consider adding "Click to enable sound" fallback
- Check browser autoplay policies

## Future Enhancements

1. **Personalized Messages**: Different messages based on time of day
2. **Multiple Takes**: A/B test different versions
3. **Interactive Audio**: User can click to replay
4. **Background Music**: Subtle ambient music during message
5. **Voice Options**: Multiple voice choices for accessibility

## File Locations

- Component: `/components/AudioWelcome.tsx`
- Integration: `/app/layout.tsx`
- Event Dispatch: `/components/TerminalBoot.tsx`
- Audio File: `/public/welcome-message.mp3` (TO BE ADDED)
- Documentation: `/docs/AUDIO_WELCOME_GUIDE.md`

## Browser Support

Audio autoplay is supported in most modern browsers, but may be blocked:
- Chrome: Autoplay allowed after user interaction
- Firefox: Autoplay allowed after user interaction
- Safari: Autoplay blocked, requires user interaction
- Mobile: Varies by device and browser

**Fallback**: If autoplay is blocked, the system gracefully handles the error and logs to console.
