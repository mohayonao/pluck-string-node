/* global Float32Array, Symbol, AudioNode, OscillatorNode */

var WS_CURVE_SIZE = 255;
var curve = new Float32Array(WS_CURVE_SIZE);

for (var i = 0; i < WS_CURVE_SIZE; i++) {
  var x = i - (WS_CURVE_SIZE >> 1);
  curve[i] = Math.sin(19 * Math.sin(97 * x) + 47 * Math.sin(31 * Math.sin(23 * x)));
}

function PluckStringNode(audioContext, opts) {
  opts = opts || {};

  var oscillator = audioContext.createOscillator();
  var pluckShaper = audioContext.createWaveShaper();
  var biquadFilter = audioContext.createBiquadFilter();
  var color = typeof opts.color === "number" ? opts.color : 800;
  var timeConstant = typeof opts.timeConstant === "number" ? opts.timeConstant : 5;

  oscillator.type = "triangle";
  oscillator.connect(pluckShaper);

  pluckShaper.oversample = "4x";
  pluckShaper.curve = curve;
  pluckShaper.connect(biquadFilter);

  biquadFilter.type = "lowpass";
  biquadFilter.Q.value = 1;

  function start(t0) {
    OscillatorNode.prototype.start.call(oscillator, t0);

    biquadFilter.frequency.setValueAtTime(color, t0);
    biquadFilter.frequency.setTargetAtTime(color * 0.005, t0, timeConstant);
  }

  Object.defineProperties(oscillator, {
    start: {
      value: start,
      enumerable: false, writable: false, configurable: true
    },
    color: {
      set: function(value) {
        color = Math.max(0, Math.min(+value || 0, audioContext.sampleRate * 0.5));
      },
      get: function() {
        return color;
      },
      enumerable: false, configurable: true
    },
    timeConstant: {
      set: function(value) {
        timeConstant = Math.max(0.001, Math.min(+value || 0, 60));
      },
      get: function() {
        return timeConstant;
      },
      enumerable: false, configurable: true
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

  oscillator.color = color;
  oscillator.timeConstant = timeConstant;

  return oscillator;
}

if (typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol") {
  Object.defineProperty(PluckStringNode, Symbol.hasInstance, {
    value: function(value) {
      return value instanceof AudioNode && typeof value.color === "number" && typeof value.timeConstant === "number";
    }
  });
}

module.exports = PluckStringNode;
