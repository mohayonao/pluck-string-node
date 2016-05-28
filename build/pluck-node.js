(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PluckNode = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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

PluckNode.install = function() {
  Object.defineProperty(AudioContext.prototype, "createPluck", {
    value: function(color, decayTime) {
      return new PluckNode(this, color, decayTime);
    },
    enumerable: false, writable: false, configurable: true
  });
};

module.exports = PluckNode;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});