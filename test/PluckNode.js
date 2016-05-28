"use strict";

const assert = require("assert");
const PluckNode = require("../lib/PluckNode");

describe("PluckNode", () => {
  let audioContext;

  beforeEach(() => {
    audioContext = new global.AudioContext();
  });

  describe("constructor(audioContext: global.AudioContext, [color: number, decayTime: number])", () => {
    it("works", () => {
      const node = new PluckNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("#frequency: AudioParam", () => {
    it("works", () => {
      const node = new PluckNode(audioContext);

      assert(node.frequency instanceof global.AudioParam);
    });
  });
  describe("#detune: AudioParam", () => {
    it("works", () => {
      const node = new PluckNode(audioContext);

      assert(node.detune instanceof global.AudioParam);
    });
  });
  describe("#start(when: number): void", () => {
    it("works", () => {
      const node = new PluckNode(audioContext);

      assert(typeof node.start === "function");
    });
  });
  describe("#stop(when: number): void", () => {
    it("works", () => {
      const node = new PluckNode(audioContext);

      assert(typeof node.stop === "function");
    });
  });
});
