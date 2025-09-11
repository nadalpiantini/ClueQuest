// Audio system for Whispers in the Library adventure
// Handles all audio effects, ambient sounds, and voice recordings

export interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

export class WhispersLibraryAudio {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private playingSounds: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadAudioFiles();
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }

  private async loadAudioFiles() {
    if (!this.audioContext) return;

    const audioFiles = [
      'library-ambience',
      'page-turning',
      'footsteps',
      'morse-code',
      'whispered-poetry',
      'uv-light-hum',
      'book-rustling',
      'candle-flickering',
      'parchment-rustling',
      'microfilm-projector',
      'distorted-voice',
      'film-whirring',
      'wooden-creaking',
      'dramatic-music',
      'mechanical-clicks',
      'distant-voices'
    ];

    for (const filename of audioFiles) {
      try {
        const response = await fetch(`/audio/whispers-library/${filename}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(filename, audioBuffer);
      } catch (error) {
        console.warn(`Failed to load audio file: ${filename}`, error);
      }
    }
  }

  public async playSound(
    soundName: string, 
    config: AudioConfig = { volume: 0.5, loop: false }
  ): Promise<void> {
    if (!this.audioContext || !this.sounds.has(soundName)) {
      console.warn(`Sound not available: ${soundName}`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.sounds.get(soundName)!;
      source.loop = config.loop;
      
      gainNode.gain.value = config.volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Handle fade in
      if (config.fadeIn) {
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          config.volume, 
          this.audioContext.currentTime + config.fadeIn
        );
      }
      
      // Handle fade out
      if (config.fadeOut) {
        const duration = source.buffer.duration;
        gainNode.gain.setValueAtTime(
          config.volume, 
          this.audioContext.currentTime + duration - config.fadeOut
        );
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      }
      
      source.start();
      this.playingSounds.set(soundName, source);
      
      // Clean up when finished
      source.onended = () => {
        this.playingSounds.delete(soundName);
      };
      
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }
  }

  public stopSound(soundName: string): void {
    const source = this.playingSounds.get(soundName);
    if (source) {
      source.stop();
      this.playingSounds.delete(soundName);
    }
  }

  public stopAllSounds(): void {
    this.playingSounds.forEach((source) => {
      source.stop();
    });
    this.playingSounds.clear();
  }

  public setVolume(soundName: string, volume: number): void {
    // Implementation would require storing gain nodes
    // For now, we'll restart the sound with new volume
    this.stopSound(soundName);
    this.playSound(soundName, { volume, loop: false });
  }

  // Scene-specific audio methods
  public playLibraryAmbience(): void {
    this.playSound('library-ambience', { volume: 0.3, loop: true });
  }

  public playPageTurning(): void {
    this.playSound('page-turning', { volume: 0.6, loop: false });
  }

  public playFootsteps(): void {
    this.playSound('footsteps', { volume: 0.4, loop: false });
  }

  public playMorseCode(): void {
    this.playSound('morse-code', { volume: 0.7, loop: false });
  }

  public playWhisperedPoetry(): void {
    this.playSound('whispered-poetry', { volume: 0.5, loop: true });
  }

  public playUVLightHum(): void {
    this.playSound('uv-light-hum', { volume: 0.4, loop: true });
  }

  public playBookRustling(): void {
    this.playSound('book-rustling', { volume: 0.5, loop: false });
  }

  public playCandleFlickering(): void {
    this.playSound('candle-flickering', { volume: 0.3, loop: true });
  }

  public playParchmentRustling(): void {
    this.playSound('parchment-rustling', { volume: 0.6, loop: false });
  }

  public playMicrofilmProjector(): void {
    this.playSound('microfilm-projector', { volume: 0.5, loop: true });
  }

  public playDistortedVoice(): void {
    this.playSound('distorted-voice', { volume: 0.7, loop: false });
  }

  public playFilmWhirring(): void {
    this.playSound('film-whirring', { volume: 0.4, loop: true });
  }

  public playWoodenCreaking(): void {
    this.playSound('wooden-creaking', { volume: 0.5, loop: false });
  }

  public playDramaticMusic(): void {
    this.playSound('dramatic-music', { volume: 0.6, loop: true });
  }

  public playMechanicalClicks(): void {
    this.playSound('mechanical-clicks', { volume: 0.6, loop: false });
  }

  public playDistantVoices(): void {
    this.playSound('distant-voices', { volume: 0.4, loop: true });
  }

  // Morse code specific functionality
  public playMorseSequence(morseCode: string): void {
    const morseTiming = {
      '.': 100,  // dot duration
      '-': 300,  // dash duration
      ' ': 300,  // space between letters
      '  ': 700  // space between words
    };

    let currentTime = 0;
    const audioContext = this.audioContext;
    
    if (!audioContext) return;

    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i];
      
      if (char === '.') {
        setTimeout(() => {
          this.playSound('morse-code', { volume: 0.7, loop: false });
        }, currentTime);
        currentTime += morseTiming['.'];
      } else if (char === '-') {
        setTimeout(() => {
          this.playSound('morse-code', { volume: 0.7, loop: false });
        }, currentTime);
        currentTime += morseTiming['-'];
      } else if (char === ' ') {
        currentTime += morseTiming[' '];
      }
    }
  }

  // Cleanup
  public destroy(): void {
    this.stopAllSounds();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Singleton instance
export const whispersLibraryAudio = new WhispersLibraryAudio();

// Audio cues for different scenes
export const sceneAudioCues = {
  scene1: {
    ambient: 'library-ambience',
    interactions: ['page-turning', 'book-rustling']
  },
  scene2: {
    ambient: 'candle-flickering',
    interactions: ['parchment-rustling']
  },
  scene3: {
    ambient: 'library-ambience',
    interactions: ['morse-code']
  },
  scene4: {
    ambient: 'footsteps',
    interactions: ['book-rustling']
  },
  scene5: {
    ambient: 'whispered-poetry',
    interactions: ['uv-light-hum', 'book-rustling']
  },
  scene6: {
    ambient: 'wooden-creaking',
    interactions: ['mechanical-clicks']
  },
  scene7: {
    ambient: 'microfilm-projector',
    interactions: ['distorted-voice', 'film-whirring']
  },
  scene8: {
    ambient: 'dramatic-music',
    interactions: ['mechanical-clicks', 'distant-voices']
  }
};

export default whispersLibraryAudio;
