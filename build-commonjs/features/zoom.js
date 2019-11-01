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

function lessThanScaleFactorMin(matrix, scaleFactor, scaleFactorMin) {
  return scaleFactorMin && matrix.d * scaleFactor <= scaleFactorMin;
}

function moreThanScaleFactorMax(matrix, scaleFactor, scaleFactorMax) {
  return scaleFactorMax && matrix.d * scaleFactor >= scaleFactorMax;
}

function isZoomLevelGoingOutOfBounds(matrix, scaleFactor, scaleFactorMin, scaleFactorMax) {
  return lessThanScaleFactorMin(matrix, scaleFactor, scaleFactorMin) && scaleFactor < 1 || moreThanScaleFactorMax(matrix, scaleFactor, scaleFactorMax) && scaleFactor > 1;
}

function limitZoomLevel(matrix, scaleFactorMin, scaleFactorMax) {
  var scaleLevel = matrix.a;

  if (scaleFactorMin != null) {
    // limit minimum zoom
    scaleLevel = Math.max(scaleLevel, scaleFactorMin);
  }

  if (scaleFactorMax != null) {
    // limit maximum zoom
    scaleLevel = Math.min(scaleLevel, scaleFactorMax);
  }

  return _objectSpread({}, matrix, {
    a: scaleLevel,
    d: scaleLevel
  });
}

function zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax) {
  if (isZoomLevelGoingOutOfBounds(matrix, scaleFactor, scaleFactorMin, scaleFactorMax)) {
    return {
      matrix: matrix
    };
  }

  var newMatrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.fromObject)(matrix), (0, _transformationMatrix.translate)(SVGPoint.x, SVGPoint.y), (0, _transformationMatrix.scale)(scaleFactor, scaleFactor), (0, _transformationMatrix.translate)(-SVGPoint.x, -SVGPoint.y));
  return {
    mode: _constants.MODE_IDLE,
    matrix: limitZoomLevel(newMatrix, scaleFactorMin, scaleFactorMax),
    start: _constants.NULL_POSITION,
    end: _constants.NULL_POSITION,
    last_action: _constants.ACTION_ZOOM
  };
}

function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight, viewerWidth, viewerHeight) {
  var scaleX = viewerWidth / selectionWidth;
  var scaleY = viewerHeight / selectionHeight;
  var scaleLevel = Math.min(scaleX, scaleY);
  var newMatrix = (0, _transformationMatrix.transform)((0, _transformationMatrix.scale)(scaleLevel, scaleLevel), //2
  (0, _transformationMatrix.translate)(-selectionSVGPointX, -selectionSVGPointY) //1
  );

  if (isZoomLevelGoingOutOfBounds(scaleLevel / newMatrix.d)) {
    // Do not allow scale and translation
    return {
      mode: _constants.MODE_IDLE,
      start: _constants.NULL_POSITION,
      end: _constants.NULL_POSITION
    };
  }

  return {
    mode: _constants.MODE_IDLE,
    matrix: limitZoomLevel(newMatrix),
    start: _constants.NULL_POSITION,
    end: _constants.NULL_POSITION,
    last_action: _constants.ACTION_ZOOM
  };
}

function fitToViewer(viewer, SVGAttributes) {
  var SVGAlignX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constants.ALIGN_LEFT;
  var SVGAlignY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _constants.ALIGN_TOP;
  var SVGMinX = SVGAttributes.SVGMinX,
      SVGMinY = SVGAttributes.SVGMinY,
      SVGWidth = SVGAttributes.SVGWidth,
      SVGHeight = SVGAttributes.SVGHeight;
  var viewerWidth = viewer.viewerWidth,
      viewerHeight = viewer.viewerHeight;
  var scaleX = viewerWidth / SVGWidth;
  var scaleY = viewerHeight / SVGHeight;
  var scaleLevel = Math.min(scaleX, scaleY);
  var scaleMatrix = (0, _transformationMatrix.scale)(scaleLevel, scaleLevel);
  var translateX = -SVGMinX * scaleX;
  var translateY = -SVGMinY * scaleY; // after fitting, SVG and the viewer will match in width (1) or in height (2)

  if (scaleX < scaleY) {
    //(1) match in width, meaning scaled SVGHeight <= viewerHeight
    var remainderY = viewerHeight - scaleX * SVGHeight;

    switch (SVGAlignY) {
      case _constants.ALIGN_TOP:
        translateY = -SVGMinY * scaleLevel;
        break;

      case _constants.ALIGN_CENTER:
        translateY = Math.round(remainderY / 2) - SVGMinY * scaleLevel;
        break;

      case _constants.ALIGN_BOTTOM:
        translateY = remainderY - SVGMinY * scaleLevel;
        break;
    }
  } else {
    //(2) match in height, meaning scaled SVGWidth <= viewerWidth
    var remainderX = viewerWidth - scaleY * SVGWidth;

    switch (SVGAlignX) {
      case _constants.ALIGN_LEFT:
        translateX = -SVGMinX * scaleLevel;
        break;

      case _constants.ALIGN_CENTER:
        translateX = Math.round(remainderX / 2) - SVGMinX * scaleLevel;
        break;

      case _constants.ALIGN_RIGHT:
        translateX = remainderX - SVGMinX * scaleLevel;
        break;
    }
  }

  var translationMatrix = (0, _transformationMatrix.translate)(translateX, translateY);
  var matrix = (0, _transformationMatrix.transform)(translationMatrix, //2
  scaleMatrix //1
  );

  if (isZoomLevelGoingOutOfBounds(scaleLevel / matrix.d)) {
    // Do not allow scale and translation
    return {
      mode: _constants.MODE_IDLE,
      start: _constants.NULL_POSITION,
      end: _constants.NULL_POSITION
    };
  }

  return {
    mode: _constants.MODE_IDLE,
    matrix: limitZoomLevel(matrix),
    start: _constants.NULL_POSITION,
    end: _constants.NULL_POSITION,
    last_action: _constants.ACTION_ZOOM
  };
}

function zoomOnViewerCenter(matrix, viewer, scaleFactor, scaleFactorMin, scaleFactorMax) {
  var viewerWidth = viewer.viewerWidth,
      viewerHeight = viewer.viewerHeight;
  var SVGPoint = (0, _common.getSVGPoint)(viewerWidth / 2, viewerHeight / 2, matrix);
  return zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax);
}

function startZooming(viewer) {
  return {
    mode: _constants.MODE_ZOOMING,
    start: viewer,
    end: viewer
  };
}

function updateZooming(mode, cursor) {
  if (mode !== _constants.MODE_ZOOMING) throw new Error('update selection not allowed in this mode ' + mode);
  return {
    end: cursor
  };
}

function stopZooming(cursor, start, end, matrix, scaleFactor, props, viewer) {
  var startPos = (0, _common.getSVGPoint)(start.x, start.y, matrix);
  var endPos = (0, _common.getSVGPoint)(end.x, end.y, matrix);

  if (Math.abs(startPos.x - endPos.x) > 7 && Math.abs(startPos.y - endPos.y) > 7) {
    // either fit around the box...
    var box = (0, _calculateBox.default)(startPos, endPos);
    return fitSelection(box.x, box.y, box.width, box.height, viewer.viewerWidth, viewer.viewerHeight);
  } else {
    // ...or zoom in around the cursor
    var SVGPoint = (0, _common.getSVGPoint)(cursor.x, cursor.y, matrix);
    var scaleFactorMin = props.scaleFactorMin,
        scaleFactorMax = props.scaleFactorMax;
    return zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax);
  }
}