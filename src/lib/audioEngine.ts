"use client";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private thrusterNoise: AudioBufferSourceNode | null = null;
  private thrusterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.setupDrone();
    this.setupThrusterNoise();

    this.isInitialized = true;
  }

  private setupDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Filter for atmospheric evolution
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = "lowpass";
    this.droneFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.droneFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);
    this.droneFilter.connect(this.masterGain);

    // Dual detuned oscillators for rich warm drone
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = "sawtooth";
    this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = "triangle";
    this.droneOsc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Detuned A2

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    this.droneOsc1.connect(droneGain);
    this.droneOsc2.connect(droneGain);
    droneGain.connect(this.droneFilter);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  private setupThrusterNoise() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 5 seconds of procedural white noise buffer
    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.thrusterNoise = this.ctx.createBufferSource();
    this.thrusterNoise.buffer = noiseBuffer;
    this.thrusterNoise.loop = true;

    // Filter noise to sound like rocket ion thrust
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.thrusterGain = this.ctx.createGain();
    this.thrusterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

    this.thrusterNoise.connect(noiseFilter);
    noiseFilter.connect(this.thrusterGain);
    this.thrusterGain.connect(this.masterGain);

    this.thrusterNoise.start();
  }

  public toggleMute(): boolean {
    if (!this.isInitialized) {
      this.init();
    }
    if (!this.ctx || !this.masterGain) return this.isMuted;

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    if (this.isMuted) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    } else {
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.masterGain.gain.exponentialRampToValueAtTime(0.3, now + 1.5);
    }
    return this.isMuted;
  }

  public setMute(mute: boolean) {
    if (this.isMuted === mute) return;
    this.toggleMute();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Real-time modulation based on scroll progress and velocity
  public updateEnvironment(progress: number, velocity: number) {
    if (this.isMuted || !this.ctx || !this.droneFilter || !this.thrusterGain) return;

    const now = this.ctx.currentTime;

    // 1. Modulate Drone Filter frequency based on Chapter
    let targetFreq = 400; // Act I warm
    if (progress >= 0.45 && progress < 0.70) {
      targetFreq = 1200; // Act II crystalline high tech
    } else if (progress >= 0.70 && progress < 0.78) {
      targetFreq = 2200; // Wormhole warp resonance
    } else if (progress >= 0.78) {
      targetFreq = 650;  // Builder station harmonic
    }
    this.droneFilter.frequency.setTargetAtTime(targetFreq, now, 0.5);

    // 2. Modulate thruster noise gain with scroll velocity
    const targetThruster = Math.min(0.25, 0.01 + Math.abs(velocity) * 2.0);
    this.thrusterGain.gain.setTargetAtTime(targetThruster, now, 0.1);
  }

  // UI Micro-Audio Trigger: Hover Ping
  public playHoverPing() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // UI Micro-Audio Trigger: Standard Click / Tab Switch
  public playClick() {
    this.playHoverPing();
  }

  // UI Micro-Audio Trigger: Modal Open
  public playModalOpen() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // UI Micro-Audio Trigger: Proximity Warning Klaxon
  public playKlaxon() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, now); // A4 warning
    osc.frequency.setValueAtTime(880, now + 0.1); // A5 jump
    osc.frequency.setValueAtTime(440, now + 0.2); // A4 return

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // UI Micro-Audio Trigger: Crystalline Matrix Modulation
  public playCrystallinePing(freq: number = 880) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const audioEngine = new AudioEngine();


