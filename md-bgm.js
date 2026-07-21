/**
 * メガドライブ風（FM/PSG寄せ）Web Audio シーケンサー
 * プロローグ / ご褒美 / エンディング用
 */
(function (global) {
  const NOTE = {
    C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
    C6: 1046.5, D6: 1174.66, E6: 1318.51,
    REST: 0
  };

  /** [beatStart, noteName, durationBeats, (optional)vol] */
  const THEMES = {
    // 暗い・物語調（A minor 寄り）
    prologue: {
      bpm: 88,
      loop: true,
      gain: 0.11,
      tracks: [
        {
          type: 'square',
          notes: [
            [0, 'A3', 1.5], [1.5, 'E4', 1.5], [3, 'C4', 1], [4, 'B3', 2],
            [6, 'A3', 1], [7, 'G3', 1], [8, 'A3', 2], [10, 'E4', 1], [11, 'F4', 1],
            [12, 'E4', 2], [14, 'D4', 1], [15, 'C4', 1],
            [16, 'A3', 1.5], [17.5, 'C4', 1.5], [19, 'E4', 1], [20, 'A4', 2],
            [22, 'G4', 1], [23, 'F4', 1], [24, 'E4', 2], [26, 'D4', 2],
            [28, 'C4', 2], [30, 'B3', 2]
          ]
        },
        {
          type: 'triangle',
          notes: [
            [0, 'A2', 2], [2, 'E2', 2], [4, 'F2', 2], [6, 'G2', 2],
            [8, 'A2', 2], [10, 'C3', 2], [12, 'E2', 2], [14, 'G2', 2],
            [16, 'A2', 2], [18, 'F2', 2], [20, 'E2', 2], [22, 'D2', 2],
            [24, 'C3', 2], [26, 'G2', 2], [28, 'A2', 2], [30, 'E2', 2]
          ]
        },
        {
          type: 'square',
          duty: 0.25,
          notes: [
            [1, 'E5', 0.25, 0.35], [3, 'C5', 0.25, 0.3], [5, 'B4', 0.25, 0.3],
            [9, 'A4', 0.25, 0.35], [13, 'E5', 0.25, 0.3], [17, 'C5', 0.25, 0.3],
            [21, 'A5', 0.25, 0.4], [25, 'E5', 0.25, 0.3], [29, 'C5', 0.25, 0.3]
          ]
        }
      ]
    },

    // 明るいご褒美ジングル（C major、ループ短め）
    reward: {
      bpm: 140,
      loop: true,
      gain: 0.12,
      tracks: [
        {
          type: 'square',
          notes: [
            [0, 'C5', 0.5], [0.5, 'E5', 0.5], [1, 'G5', 0.5], [1.5, 'C6', 0.5],
            [2, 'G5', 0.5], [2.5, 'E5', 0.5], [3, 'F5', 0.5], [3.5, 'A5', 0.5],
            [4, 'C6', 0.5], [4.5, 'A5', 0.5], [5, 'G5', 0.5], [5.5, 'E5', 0.5],
            [6, 'D5', 0.5], [6.5, 'G5', 0.5], [7, 'C5', 1]
          ]
        },
        {
          type: 'triangle',
          notes: [
            [0, 'C3', 1], [1, 'G2', 1], [2, 'A2', 1], [3, 'F2', 1],
            [4, 'C3', 1], [5, 'E2', 1], [6, 'G2', 1], [7, 'C3', 1]
          ]
        },
        {
          type: 'square',
          duty: 0.125,
          notes: [
            [0.25, 'G4', 0.25, 0.25], [1.25, 'C5', 0.25, 0.25],
            [2.25, 'E5', 0.25, 0.25], [4.25, 'A4', 0.25, 0.25],
            [6.25, 'B4', 0.25, 0.25]
          ]
        }
      ]
    },

    // エンディング勝利（壮大め・ループ）
    ending: {
      bpm: 112,
      loop: true,
      gain: 0.13,
      tracks: [
        {
          type: 'square',
          notes: [
            [0, 'C4', 1], [1, 'E4', 1], [2, 'G4', 1], [3, 'C5', 1.5],
            [4.5, 'B4', 0.5], [5, 'A4', 1], [6, 'G4', 1], [7, 'E4', 1],
            [8, 'F4', 1], [9, 'A4', 1], [10, 'C5', 1], [11, 'F5', 1.5],
            [12.5, 'E5', 0.5], [13, 'D5', 1], [14, 'C5', 1], [15, 'G4', 1],
            [16, 'A4', 1], [17, 'C5', 1], [18, 'E5', 1], [19, 'A5', 2],
            [21, 'G5', 1], [22, 'E5', 1], [23, 'C5', 1],
            [24, 'D5', 1], [25, 'F5', 1], [26, 'A5', 1], [27, 'G5', 1],
            [28, 'E5', 2], [30, 'C5', 2]
          ]
        },
        {
          type: 'triangle',
          notes: [
            [0, 'C3', 2], [2, 'G2', 2], [4, 'A2', 2], [6, 'E2', 2],
            [8, 'F2', 2], [10, 'C3', 2], [12, 'D3', 2], [14, 'G2', 2],
            [16, 'A2', 2], [18, 'E3', 2], [20, 'C3', 2], [22, 'G2', 2],
            [24, 'F2', 2], [26, 'G2', 2], [28, 'C3', 4]
          ]
        },
        {
          type: 'sawtooth',
          notes: [
            [3, 'E5', 0.5, 0.2], [11, 'A5', 0.5, 0.2],
            [19, 'C6', 1, 0.22], [28, 'G5', 1, 0.2], [30, 'E5', 1, 0.18]
          ]
        }
      ]
    }
  };

  class MegaDriveBgm {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.current = null;
      this.loopTimer = null;
      this.muted = false;
      this.volumeScale = 1;
    }

    ensure() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.0001;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    }

    setMuted(muted) {
      this.muted = muted;
      if (muted) this.stop();
    }

    setVolumeScale(scale) {
      this.volumeScale = Math.max(0, Math.min(1, scale));
      if (this.master && this.current && !this.muted) {
        const theme = THEMES[this.current];
        const g = (theme ? theme.gain : 0.1) * this.volumeScale;
        this.master.gain.setTargetAtTime(g, this.ctx.currentTime, 0.05);
      }
    }

    stop() {
      if (this.loopTimer) {
        clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      this.current = null;
      if (this.master && this.ctx) {
        const t = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(t);
        this.master.gain.setTargetAtTime(0.0001, t, 0.04);
      }
    }

    play(themeName) {
      if (this.muted) return;
      const theme = THEMES[themeName];
      if (!theme) return;
      this.ensure();
      this.stop();
      this.current = themeName;

      const startGain = theme.gain * this.volumeScale;
      const t0 = this.ctx.currentTime + 0.02;
      this.master.gain.cancelScheduledValues(t0);
      this.master.gain.setValueAtTime(0.0001, t0);
      this.master.gain.exponentialRampToValueAtTime(Math.max(0.001, startGain), t0 + 0.12);

      const beat = 60 / theme.bpm;
      let maxBeat = 0;
      theme.tracks.forEach((track) => {
        track.notes.forEach((n) => {
          const end = n[0] + n[2];
          if (end > maxBeat) maxBeat = end;
        });
        this._scheduleTrack(track, t0, beat);
      });

      if (theme.loop) {
        const loopMs = maxBeat * beat * 1000 + 40;
        this.loopTimer = setTimeout(() => {
          if (this.current === themeName && !this.muted) this.play(themeName);
        }, loopMs);
      }
    }

    _scheduleTrack(track, t0, beat) {
      track.notes.forEach((n) => {
        const [startBeat, name, durBeats, noteVol = 1] = n;
        const freq = NOTE[name];
        if (!freq) return;
        const start = t0 + startBeat * beat;
        const dur = Math.max(0.05, durBeats * beat * 0.92);
        this._tone(freq, start, dur, track.type, noteVol, track.duty);
      });
    }

    _tone(freq, start, dur, type, noteVol, duty) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type === 'sawtooth' ? 'sawtooth' : type === 'triangle' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, start);

      // 疑似デューティ感：軽いデチューン
      if (type === 'square' && duty && duty < 0.3) {
        osc.detune.setValueAtTime(8, start);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'triangle' ? 1200 : 2800, start);
      filter.Q.setValueAtTime(0.7, start);

      const peak = 0.22 * noteVol;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(peak * 0.7, start + dur * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + dur + 0.03);
    }
  }

  global.MegaDriveBgm = MegaDriveBgm;
})(window);
