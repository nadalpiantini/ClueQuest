# Audio Files for Whispers in the Library

This directory should contain the following audio files for the adventure:

## Required Audio Files (16 total)

### Ambient Sounds
- `library-ambience.mp3` - Background library atmosphere
- `candle-flickering.mp3` - Candle flame sounds
- `whispered-poetry.mp3` - Whispered poem recitation

### Interaction Sounds
- `page-turning.mp3` - Book page turning
- `footsteps.mp3` - Footsteps in library
- `book-rustling.mp3` - Book handling sounds
- `parchment-rustling.mp3` - Parchment paper sounds

### Special Effects
- `morse-code.mp3` - Morse code beeps
- `uv-light-hum.mp3` - UV flashlight hum
- `microfilm-projector.mp3` - Projector mechanical sounds
- `film-whirring.mp3` - Film reel sounds
- `wooden-creaking.mp3` - Wooden furniture sounds
- `mechanical-clicks.mp3` - Mechanical lock sounds

### Dramatic Audio
- `distorted-voice.mp3` - Distorted voice from microfilm
- `dramatic-music.mp3` - Climactic music
- `distant-voices.mp3` - Background voices

## File Requirements
- Format: MP3
- Quality: 128kbps minimum
- Duration: 10-30 seconds for most files
- Volume: Normalized to prevent clipping

## Usage
These files are automatically loaded by the `WhispersLibraryAudio` class and played based on scene context and user interactions.

## Note
If audio files are not available, the adventure will still function but without audio effects. The system includes fallbacks for missing audio files.
