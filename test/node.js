"use strict";

require("run-with-mocha");

const assert = require("assert");
const PluckStringNode = require("..");

describe("PluckStringNode", () => {
  let audioContext;

  beforeEach(() => {
    audioContext = new global.AudioContext();
  });

  describe("constructor", () => {
    it("(audioContext: global.AudioContext)", () => {
      const node = new PluckStringNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("#color", () => {
    it("get: number", () => {
      const node = new PluckStringNode(audioContext);

      assert(typeof node.color === "number");
    });
  });
  describe("#timeConstant", () => {
    it("get: number", () => {
      const node = new PluckStringNode(audioContext);

      assert(typeof node.timeConstant === "number");
    });
  });
});
