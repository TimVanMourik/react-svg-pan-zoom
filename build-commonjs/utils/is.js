"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNullOrUndefined = isNullOrUndefined;
exports.isEmpty = isEmpty;

function isNullOrUndefined(value) {
  return typeof value === 'undefined' || value === null;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}