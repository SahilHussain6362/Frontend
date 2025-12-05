# Sound Effects Guide

This guide explains how to add sound effects to the Spy Game frontend.

## Required Sound Files

Place the following sound files in the `assets/sounds/` directory:

### Sound Effects (SFX)
- `click.mp3` - Button clicks and UI interactions
- `vote.mp3` - Voting actions
- `spy-reveal.mp3` - Spy reveal, game start/end events
- `timer.mp3` - Timer countdown sounds
- `error.mp3` - Error notifications

### Background Music
- `gameplay.mp3` - Background music during gameplay (should loop)

## Recommended Sources

You can find free sound effects at:
- [Freesound.org](https://freesound.org/) - Free sound effects library
- [Zapsplat](https://www.zapsplat.com/) - Free sound effects (requires account)
- [OpenGameArt.org](https://opengameart.org/) - Free game assets

## Audio Format

- **Format**: MP3 (recommended for web compatibility)
- **Bitrate**: 128-192 kbps (good balance of quality and file size)
- **Sample Rate**: 44.1 kHz
- **Duration**: 
  - SFX: 0.5-2 seconds
  - Music: Can be longer, will loop automatically

## File Structure

```
SpyGameFrontend/
  assets/
    sounds/
      click.mp3
      vote.mp3
      spy-reveal.mp3
      timer.mp3
      error.mp3
      gameplay.mp3
```

## Notes

- The audio service will gracefully handle missing files (they just won't play)
- All sounds are automatically loaded when the app starts
- Volume levels can be adjusted in `src/services/audioService.js`
- Background music loops automatically during gameplay

## Testing

After adding sound files:
1. Restart the dev server
2. Test each sound by interacting with the UI
3. Check browser console for any loading errors

