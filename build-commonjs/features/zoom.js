"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isZoomLevelGoingOutOfBounds = isZoomLevelGoingOutOfBounds;
exports.limitZoomLevel = limitZoomLevel;
exports.zoom = zoom;
exports.fitSelection = fitSelection;
exports.fitToViewer = fitToViewer;
exports.zoomOnViewerCenter = zoomOnViewerCenter;
exports.startZooming = startZooming;
exports.updateZooming = updateZooming;
exports.stopZooming = stopZooming;

var _transformationMatrix = require("transformation-matrix");

var _constants = require("../constants");

var _common = require("./common");

var _calculateBox = _interopRequireDefault(require("../utils/calculateBox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function lessThanScaleFactorMin(value, scaleFactor) {
  return value.scaleFactorMin && value.d * scaleFactor <= value.scaleFactorMin;
}

function moreThanScaleFactorMax(value, scaleFactor) {
  return value.scaleFactorMax && value.d * scaleFactor >= value.scaleFactorMax;
}

function isZoomLevelGoingOutOfBounds(value, scaleFactor) {
  return lessThanScaleFactorMin(value, scaleFactor) && scaleFactor < 1 || moreThanScaleFactorMax(value, scaleFactor) && scaleFactor > 1;
}

function limitZoomLevel(value, matrix) {
  var scaleLevel = matrix.a;

  if (value.scaleFactorMin != null) {
    // limit minimum zoom
    scaleLevel = Math.max(scaleLevel, value.scaleFactorMin);
  }

  if (value.scaleFactorMax != null) {
    // limit maximum zoom
    scaleLevel = Math.min(scaleLevel, value.scaleFactorMax);
  }

  return (0, _common.set)(matrix, {
    a: scaleLevel,
    d: scaleLevel
  });
}

function zoom(value, SVGPointX, SVGPointY, scaleFactor) {
  if (isZoomLevelGoingOutOfBounds(value, scaleFactor)) {
    // Do not change translation and scale of value
    return value;
  }

  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.fromObject)(value), (0, _transformationMatrix.translate)(SVGPointX, SVGPointY), (0, _transformationMatrix.scale)(scaleFactor, scaleFactor), (0, _transformationMatrix.translate)(-SVGPointX, -SVGPointY));
  return (0, _common.set)(value, _objectSpread({
    mode: _constants.MODE_IDLE
  }, limitZoomLevel(value, matrix), {
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }), _constants.ACTION_ZOOM);
}

function fitSelection(value, selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;
  var scaleX = viewerWidth / selectionWidth;
  var scaleY = viewerHeight / selectionHeight;
  var scaleLevel = Math.min(scaleX, scaleY);
  var matrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.scale)(scaleLevel, scaleLevel), //2
  (0, _transformationMatrix.translate)(-selectionSVGPointX, -selectionSVGPointY) //1
  );

  if (isZoomLevelGoingOutOfBounds(value, scaleLevel / value.d)) {
    // Do not allow scale and translation
    return (0, _common.set)(value, {
      mode: _constants.MODE_IDLE,
      startX: null,
      startY: null,
      endX: null,
      endY: null
    });
  }

  return (0, _common.set)(value, _objectSpread({
    mode: _constants.MODE_IDLE
  }, limitZoomLevel(value, matrix), {
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }), _constants.ACTION_ZOOM);
}

function fitToViewer(value) {
  var SVGAlignX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants.ALIGN_LEFT;
  var SVGAlignY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constants.ALIGN_TOP;
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight,
      SVGViewBoxX = value.SVGViewBoxX,
      SVGViewBoxY = value.SVGViewBoxY,
      SVGWidth = value.SVGWidth,
      SVGHeight = value.SVGHeight;
  var scaleX = viewerWidth / SVGWidth / 2;
  var scaleY = viewerHeight / SVGHeight / 2;
  var scaleLevel = Math.min(scaleX, scaleY);
  var scaleMatrix = (0, _transformationMatrix.scale)(scaleLevel, scaleLevel);
  var translateX = -SVGViewBoxX * scaleX / 2;
  var translateY = -SVGViewBoxY * scaleY / 2; // after fitting, SVG and the viewer will match in width (1) or in height (2)

  if (scaleX < scaleY) {
    //(1) match in width, meaning scaled SVGHeight <= viewerHeight
    var remainderY = viewerHeight - scaleX * SVGHeight;

    switch (SVGAlignY) {
      case _constants.ALIGN_TOP:
        translateY = -SVGViewBoxY * scaleY / 2;
        break;

      case _constants.ALIGN_CENTER:
        translateY = Math.round(remainderY / 2) - SVGViewBoxY * scaleY / 2;
        break;

      case _constants.ALIGN_BOTTOM:
        translateY = remainderY - SVGViewBoxY * scaleY / 2;
        break;
    }
  } else {
    //(2) match in height, meaning scaled SVGWidth <= viewerWidth
    var remainderX = viewerWidth - scaleY * SVGWidth;

    switch (SVGAlignX) {
      case _constants.ALIGN_LEFT:
        translateX = -SVGViewBoxX * scaleX / 2;
        break;

      case _constants.ALIGN_CENTER:
        translateX = Math.round(remainderX / 2) - SVGViewBoxX * scaleX / 2;
        break;

      case _constants.ALIGN_RIGHT:
        translateX = remainderX - SVGViewBoxX * scaleX / 2;
        break;
    }
  }

  var translationMatrix = (0, _transformationMatrix.translate)(translateX, translateY);
  var matrix = (0, _transformationMatrix.transform)(translationMatrix, //2
  scaleMatrix //1
  );

  if (isZoomLevelGoingOutOfBounds(value, scaleLevel / value.d)) {
    // Do not allow scale and translation
    return (0, _common.set)(value, {
      mode: _constants.MODE_IDLE,
      startX: null,
      startY: null,
      endX: null,
      endY: null
    });
  }

  return (0, _common.set)(value, _objectSpread({
    mode: _constants.MODE_IDLE
  }, limitZoomLevel(value, matrix), {
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }), _constants.ACTION_ZOOM);
}

function zoomOnViewerCenter(value, scaleFactor) {
  var viewerWidth = value.viewerWidth,
      viewerHeight = value.viewerHeight;
  var SVGPoint = (0, _common.getSVGPoint)(value, viewerWidth / 2, viewerHeight / 2);
  return zoom(value, SVGPoint.x, SVGPoint.y, scaleFactor);
}

function startZooming(value, viewerX, viewerY) {
  return (0, _common.set)(value, {
    mode: _constants.MODE_ZOOMING,
    startX: viewerX,
    startY: viewerY,
    endX: viewerX,
    endY: viewerY
  });
}

function updateZooming(value, viewerX, viewerY) {
  if (value.mode !== _constants.MODE_ZOOMING) throw new Error('update selection not allowed in this mode ' + value.mode);
  return (0, _common.set)(value, {
    endX: viewerX,
    endY: viewerY
  });
}

function stopZooming(value, viewerX, viewerY, scaleFactor, props) {
  var startX = value.startX,
      startY = value.startY,
      endX = value.endX,
      endY = value.endY;
  var start = (0, _common.getSVGPoint)(value, startX, startY);
  var end = (0, _common.getSVGPoint)(value, endX, endY);

  if (Math.abs(startX - endX) > 7 && Math.abs(startY - endY) > 7) {
    var box = (0, _calculateBox.default)(start, end);
    return fitSelection(value, box.x, box.y, box.width, box.height);
  } else {
    var SVGPoint = (0, _common.getSVGPoint)(value, viewerX, viewerY);
    return zoom(value, SVGPoint.x, SVGPoint.y, scaleFactor, props);
  }
}