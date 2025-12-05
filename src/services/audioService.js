import { Howl, Howler } from "howler";

class AudioService {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.masterVolume = 0.8;
    this.sfxVolume = 0.6;
    this.musicVolume = 0.4;
    // NOTE: actual sound files should be placed under /assets/sounds
    this.init();
  }

  init() {
    // Try to load sounds, but handle missing files gracefully
    const soundFiles = {
      click: "/assets/sounds/click.mp3",
      vote: "/assets/sounds/vote.mp3",
      spyReveal: "/assets/sounds/spy-reveal.mp3",
      timer: "/assets/sounds/timer.mp3",
      error: "/assets/sounds/error.mp3",
    };

    Object.keys(soundFiles).forEach((name) => {
      this.sounds[name] = new Howl({
        src: [soundFiles[name]],
        volume: this.sfxVolume,
        onloaderror: () => {
          console.warn(`Sound file not found: ${soundFiles[name]}. Sound will be silent.`);
        },
      });
    });

    this.music = new Howl({
      src: ["/assets/sounds/gameplay.mp3"],
      loop: true,
      volume: this.musicVolume,
      onloaderror: () => {
        console.warn("Music file not found. Music will be silent.");
      },
    });
  }

  play(name) {
    const s = this.sounds[name];
    if (s) s.play();
  }

  playMusic() {
    if (this.music && !this.music.playing()) this.music.play();
  }

  stopMusic() {
    if (this.music) this.music.stop();
  }

  setMasterVolume(v) {
    this.masterVolume = Math.max(0, Math.min(1, v));
    Howler.volume(this.masterVolume);
  }
  mute() {
    Howler.mute(true);
  }
  unmute() {
    Howler.mute(false);
  }
}

export default new AudioService();
