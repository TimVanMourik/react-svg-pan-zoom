function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HASH_MAP = {
  0: 'SVGMinX',
  1: 'SVGMinY',
  2: 'SVGWidth',
  3: 'SVGHeight'
};
export default function parseViewBox(viewBoxString) {
  // viewBox specs: https://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
  return viewBoxString && viewBoxString.split(/[ ,]/) // split optional comma
  .filter(Boolean) // remove empty strings
  .map(Number) // cast to Number
  .map(function (value, index) {
    return _defineProperty({}, HASH_MAP[index], value);
  }).reduce(function (val, acc) {
    return _objectSpread({}, acc, {}, val);
  }, {});
}