(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PluckStringNode = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/* global Float32Array, Symbol, AudioNode, OscillatorNode */

var ua = (global.navigator && global.navigator.userAgent.toLowerCase()) || "";
var isSafari = ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;

function PluckStringNode(audioContext, opts) {
  opts = opts || {};

  var oscillator = audioContext.createOscillator();
  var pluckShaper = audioContext.createWaveShaper();
  var biquadFilter = audioContext.createBiquadFilter();
  var color = typeof opts.color === "number" ? opts.color : 800;
  var timeConstant = typeof opts.timeConstant === "number" ? opts.timeConstant : 5;
  var curve = createWaveShaperCurve(255);

  oscillator.type = "triangle";
  oscillator.connect(pluckShaper);

  pluckShaper.oversample = "4x";
  pluckShaper.curve = curve;
  pluckShaper.connect(biquadFilter);

  biquadFilter.type = "lowpass";
  biquadFilter.Q.value = 1;

  function start(t0) {
    OscillatorNode.prototype.start.call(oscillator, t0);

    biquadFilter.frequency.value = color;
    biquadFilter.frequency.setTargetAtTime(0, t0, timeConstant);
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

function createWaveShaperCurve(length) {
  var offset = isSafari ? 1 : 0;
  var curve = new Float32Array(length + offset);

  for (var i = 0; i < length; i++) {
    curve[i + offset] = Math.random() * 2 - 1;
  }
  curve[(length >> 1) + offset] = 0;

  if (offset === 1) {
    curve[0] = curve[1];
  }

  return curve;
}

module.exports = PluckStringNode;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});