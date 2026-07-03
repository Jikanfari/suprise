/**
 * A beautiful Web Audio API synthesizer that plays romantic ambient sounds.
 * This is an elegant, pure-JS acoustic fallback when music.mp3 is not loaded.
 */

export class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private intervalId: any = null;

  // Romantic chord progression frequencies (in Hz)
  // Chord 1: Fmaj9 (F3, A3, C4, E4, G4)
  // Chord 2: Cmaj9 (C3, G3, B3, D4, E4)
  // Chord 3: Am9 (A2, E3, G3, C4, B4)
  // Chord 4: G11 (G2, D3, F3, A3, B3, D4)
  private chords = [
    [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
    [130.81, 196.00, 246.94, 293.66, 329.63], // Cmaj9
    [110.00, 164.81, 196.00, 261.63, 493.88], // Am9
    [98.00, 146.83, 174.61, 220.00, 246.94, 293.66] // G11
  ];

  private currentChordIndex = 0;

  constructor() {}

  public start() {
    if (this.isPlaying) return;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();
      
      // Main output gain (for volume control and fade in)
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3); // Soft fade-in

      // Elegant low-pass filter to make it sound warm and analogue
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Connect nodes: Synth -> Filter -> Gain -> Destination
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.isPlaying = true;
      
      // Start chord loop
      this.playChord(this.chords[this.currentChordIndex]);
      
      this.intervalId = setInterval(() => {
        this.nextChord();
      }, 7000); // Change chords every 7 seconds for a slow, peaceful ambient breathing rhythm
    } catch (e) {
      console.error("Failed to start synthesizer audio", e);
    }
  }

  private playChord(frequencies: number[]) {
    if (!this.ctx || !this.filterNode) return;

    // Fade out previous oscillators
    const oldOscillators = [...this.oscillators];
    const fadeTime = 2.5; // Soft 2.5 second overlap
    
    const now = this.ctx.currentTime;
    oldOscillators.forEach(osc => {
      try {
        // Find its gain node and fade it out
        const oscGain = (osc as any).gainNode as GainNode;
        if (oscGain) {
          oscGain.gain.setValueAtTime(oscGain.gain.value, now);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeTime);
        }
        setTimeout(() => {
          try { osc.stop(); } catch(e){}
        }, fadeTime * 1000 + 100);
      } catch (e) {}
    });

    this.oscillators = [];

    // Create new oscillators for the new chord
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;

      const osc = this.ctx.createOscillator();
      // Triangle wave gives a soft, flute-like, woody warm synth tone
      // We alternate triangle and sine wave for depth
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Create local gain node for each note to control volume and detune
      const noteGain = this.ctx.createGain();
      
      // Slightly detune or offset the frequencies to make it sound rich and chorus-like
      const detuneAmount = (Math.random() - 0.5) * 8; // gentle pitch chorus
      osc.detune.setValueAtTime(detuneAmount, now);

      // Bass notes are quieter, higher notes are soft
      const volumeScale = freq < 150 ? 0.08 : freq > 350 ? 0.02 : 0.05;
      noteGain.gain.setValueAtTime(0, now);
      // Soft individual note attack
      noteGain.gain.linearRampToValueAtTime(volumeScale, now + 1.5 + Math.random() * 1.5);

      osc.connect(noteGain);
      noteGain.connect(this.filterNode);
      
      // Attach reference to gainNode to clean up on chord change
      (osc as any).gainNode = noteGain;
      
      osc.start(now);
      this.oscillators.push(osc);
    });

    // Slowly modulate filter frequency (LFO effect) to make the sound breathe
    const filterSweep = 400 + Math.random() * 250;
    this.filterNode.frequency.cancelScheduledValues(now);
    this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, now);
    this.filterNode.frequency.exponentialRampToValueAtTime(filterSweep, now + 5.5);
  }

  private nextChord() {
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    this.playChord(this.chords[this.currentChordIndex]);
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const now = this.ctx ? this.ctx.currentTime : 0;
    
    // Slow master fade out
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    }

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e){}
      });
      this.oscillators = [];
      if (this.ctx) {
        try { this.ctx.close(); } catch(e){}
        this.ctx = null;
      }
      this.isPlaying = false;
    }, 1600);
  }
}
