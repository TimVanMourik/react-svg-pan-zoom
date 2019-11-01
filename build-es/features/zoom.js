function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { transform, fromObject, translate, scale } from 'transformation-matrix';
import { ACTION_ZOOM, MODE_IDLE, MODE_ZOOMING, ALIGN_CENTER, ALIGN_LEFT, ALIGN_RIGHT, ALIGN_TOP, ALIGN_BOTTOM, NULL_POSITION } from '../constants';
import { getSVGPoint } from './common';
import calculateBox from '../utils/calculateBox';

function lessThanScaleFactorMin(matrix, scaleFactor, scaleFactorMin) {
  return scaleFactorMin && matrix.d * scaleFactor <= scaleFactorMin;
}

function moreThanScaleFactorMax(matrix, scaleFactor, scaleFactorMax) {
  return scaleFactorMax && matrix.d * scaleFactor >= scaleFactorMax;
}

export function isZoomLevelGoingOutOfBounds(matrix, scaleFactor, scaleFactorMin, scaleFactorMax) {
  return lessThanScaleFactorMin(matrix, scaleFactor, scaleFactorMin) && scaleFactor < 1 || moreThanScaleFactorMax(matrix, scaleFactor, scaleFactorMax) && scaleFactor > 1;
}
export function limitZoomLevel(matrix, scaleFactorMin, scaleFactorMax) {
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
export function zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax) {
  if (isZoomLevelGoingOutOfBounds(matrix, scaleFactor, scaleFactorMin, scaleFactorMax)) {
    return {
      matrix: matrix
    };
  }

  var newMatrix = transform(fromObject(matrix), translate(SVGPoint.x, SVGPoint.y), scale(scaleFactor, scaleFactor), translate(-SVGPoint.x, -SVGPoint.y));
  return {
    mode: MODE_IDLE,
    matrix: limitZoomLevel(newMatrix, scaleFactorMin, scaleFactorMax),
    start: NULL_POSITION,
    end: NULL_POSITION,
    last_action: ACTION_ZOOM
  };
}
export function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight, viewerWidth, viewerHeight) {
  var scaleX = viewerWidth / selectionWidth;
  var scaleY = viewerHeight / selectionHeight;
  var scaleLevel = Math.min(scaleX, scaleY);
  var newMatrix = transform(scale(scaleLevel, scaleLevel), //2
  translate(-selectionSVGPointX, -selectionSVGPointY) //1
  );

  if (isZoomLevelGoingOutOfBounds(scaleLevel / newMatrix.d)) {
    // Do not allow scale and translation
    return {
      mode: MODE_IDLE,
      start: NULL_POSITION,
      end: NULL_POSITION
    };
  }

  return {
    mode: MODE_IDLE,
    matrix: limitZoomLevel(newMatrix),
    start: NULL_POSITION,
    end: NULL_POSITION,
    last_action: ACTION_ZOOM
  };
}
export function fitToViewer(viewer, SVGAttributes) {
  var SVGAlignX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ALIGN_LEFT;
  var SVGAlignY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ALIGN_TOP;
  var SVGMinX = SVGAttributes.SVGMinX,
      SVGMinY = SVGAttributes.SVGMinY,
      SVGWidth = SVGAttributes.SVGWidth,
      SVGHeight = SVGAttributes.SVGHeight;
  var viewerWidth = viewer.viewerWidth,
      viewerHeight = viewer.viewerHeight;
  var scaleX = viewerWidth / SVGWidth;
  var scaleY = viewerHeight / SVGHeight;
  var scaleLevel = Math.min(scaleX, scaleY);
  var scaleMatrix = scale(scaleLevel, scaleLevel);
  var translateX = -SVGMinX * scaleX;
  var translateY = -SVGMinY * scaleY; // after fitting, SVG and the viewer will match in width (1) or in height (2)

  if (scaleX < scaleY) {
    //(1) match in width, meaning scaled SVGHeight <= viewerHeight
    var remainderY = viewerHeight - scaleX * SVGHeight;

    switch (SVGAlignY) {
      case ALIGN_TOP:
        translateY = -SVGMinY * scaleLevel;
        break;

      case ALIGN_CENTER:
        translateY = Math.round(remainderY / 2) - SVGMinY * scaleLevel;
        break;

      case ALIGN_BOTTOM:
        translateY = remainderY - SVGMinY * scaleLevel;
        break;
    }
  } else {
    //(2) match in height, meaning scaled SVGWidth <= viewerWidth
    var remainderX = viewerWidth - scaleY * SVGWidth;

    switch (SVGAlignX) {
      case ALIGN_LEFT:
        translateX = -SVGMinX * scaleLevel;
        break;

      case ALIGN_CENTER:
        translateX = Math.round(remainderX / 2) - SVGMinX * scaleLevel;
        break;

      case ALIGN_RIGHT:
        translateX = remainderX - SVGMinX * scaleLevel;
        break;
    }
  }

  var translationMatrix = translate(translateX, translateY);
  var matrix = transform(translationMatrix, //2
  scaleMatrix //1
  );

  if (isZoomLevelGoingOutOfBounds(scaleLevel / matrix.d)) {
    // Do not allow scale and translation
    return {
      mode: MODE_IDLE,
      start: NULL_POSITION,
      end: NULL_POSITION
    };
  }

  return {
    mode: MODE_IDLE,
    matrix: limitZoomLevel(matrix),
    start: NULL_POSITION,
    end: NULL_POSITION,
    last_action: ACTION_ZOOM
  };
}
export function zoomOnViewerCenter(matrix, viewer, scaleFactor, scaleFactorMin, scaleFactorMax) {
  var viewerWidth = viewer.viewerWidth,
      viewerHeight = viewer.viewerHeight;
  var SVGPoint = getSVGPoint(viewerWidth / 2, viewerHeight / 2, matrix);
  return zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax);
}
export function startZooming(viewer) {
  return {
    mode: MODE_ZOOMING,
    start: viewer,
    end: viewer
  };
}
export function updateZooming(mode, cursor) {
  if (mode !== MODE_ZOOMING) throw new Error('update selection not allowed in this mode ' + mode);
  return {
    end: cursor
  };
}
export function stopZooming(cursor, start, end, matrix, scaleFactor, props, viewer) {
  var startPos = getSVGPoint(start.x, start.y, matrix);
  var endPos = getSVGPoint(end.x, end.y, matrix);

  if (Math.abs(startPos.x - endPos.x) > 7 && Math.abs(startPos.y - endPos.y) > 7) {
    // either fit around the box...
    var box = calculateBox(startPos, endPos);
    return fitSelection(box.x, box.y, box.width, box.height, viewer.viewerWidth, viewer.viewerHeight);
  } else {
    // ...or zoom in around the cursor
    var SVGPoint = getSVGPoint(cursor.x, cursor.y, matrix);
    var scaleFactorMin = props.scaleFactorMin,
        scaleFactorMax = props.scaleFactorMax;
    return zoom(matrix, SVGPoint, scaleFactor, scaleFactorMin, scaleFactorMax);
  }
}