"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openMiniature = openMiniature;
exports.closeMiniature = closeMiniature;

function openMiniature() {
  return {
    miniatureOpen: true
  };
}

function closeMiniature() {
  return {
    miniatureOpen: false
  };
}