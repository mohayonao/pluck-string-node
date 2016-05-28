var AudioContext = global.AudioContext || global.webkitAudioContext;

function PluckNode(audioContext, color, decayTime) {
  color = Math.max(0, Math.min(+color, audioContext.sampleRate * 0.5));
  decayTime = Math.max(0.001, Math.min(+decayTime || 5, 60));

  var oscillator = audioContext.createOscillator();
  var pluckShaper = audioContext.createWaveShaper();
  var biquadFilter = audioContext.createBiquadFilter();
  var curve = new Float32Array(48);

  for (var i = 0, imax = curve.length; i < imax; i++) {
    curve[i] = Math.random() * 2 - 1;
  }

  oscillator.type = "sine";
  oscillator.connect(pluckShaper);

  pluckShaper.oversample = "4x";
  pluckShaper.curve = curve;
  pluckShaper.connect(biquadFilter);

  biquadFilter.type = "lowpass";

  function start(t0) {
    var t1 = t0 + decayTime;

    OscillatorNode.prototype.start.call(oscillator, t0);

    biquadFilter.frequency.setValueAtTime(color, t0);
    biquadFilter.frequency.exponentialRampToValueAtTime(color * 0.005, t1);
  }

  Object.defineProperties(oscillator, {
    start: {
      value: start,
      enumerable: false, writable: false, configurable: true
    },
    connect: {
      value: AudioNode.prototype.connect.bind(biquadFilter),
      enumerable: false, writable: false, configurable: true
    },
    disconnect: {
      value: AudioNode.prototype.disconnect.bind(biquadFilter),
      enumerable: false, writable: false, configurable: true
    }
  });

  return oscillator;
}

module.exports = PluckNode;
