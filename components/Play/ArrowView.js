import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { roundCorners } from 'svg-round-corners';


const arrowheadPathSVG = (from, to, radius, curveFactor = 1) => {
    const xCenter = to.x;
    const yCenter = to.y;

    // Angle from 'from' to 'to'
    const angleTo = Math.atan2(to.y - from.y, to.x - from.x);

    // Vertices of the "ideal" equilateral triangle
    const angleTip = angleTo;
    const angleLeftBase = angleTo + (2 * Math.PI) / 3; // 120 degrees
    const angleRightBase = angleTo + (4 * Math.PI) / 3; // 240 degrees

    const pTip = {
        x: radius * Math.cos(angleTip) + xCenter,
        y: radius * Math.sin(angleTip) + yCenter
    };
    const pLeft = {
        x: radius * Math.cos(angleLeftBase) + xCenter,
        y: radius * Math.sin(angleLeftBase) + yCenter
    };
    const pRight = {
        x: radius * Math.cos(angleRightBase) + xCenter,
        y: radius * Math.sin(angleRightBase) + yCenter
    };

    // --- Calculate Control Points for Bezier Curves ---

    // The 'curveFactor' determines how far the control points are from the direct line.
    // Higher values make the curves "fuller" or "pointier" depending on direction.
    // A factor of 0.5 (halfway) often works well for a gentle curve.

    // Control points for the curve from pRight to pTip (right side of arrowhead)
    const cpRight1 = {
        x: pRight.x + (pTip.x - pRight.x) * curveFactor,
        y: pRight.y + (pTip.y - pRight.y) * curveFactor
    };
    const cpRight2 = {
        x: pTip.x - (pTip.x - pRight.x) * curveFactor,
        y: pTip.y - (pTip.y - pRight.y) * curveFactor
    };

    // Control points for the curve from pTip to pLeft (left side of arrowhead)
    const cpLeft1 = {
        x: pTip.x + (pLeft.x - pTip.x) * curveFactor,
        y: pTip.y + (pLeft.y - pTip.y) * curveFactor
    };
    const cpLeft2 = {
        x: pLeft.x - (pLeft.x - pTip.x) * curveFactor,
        y: pLeft.y - (pLeft.y - pTip.y) * curveFactor
    };

    // Control points for the curve from pLeft to pRight (base of arrowhead)
    const cpBase1 = {
        x: pLeft.x + (pRight.x - pLeft.x) * curveFactor,
        y: pLeft.y + (pRight.y - pLeft.y) * curveFactor
    };
    const cpBase2 = {
        x: pRight.x - (pRight.x - pLeft.x) * curveFactor,
        y: pRight.y - (pRight.y - pLeft.y) * curveFactor
    };

    // --- Build the SVG Path ---
    let pathString = "";

    // Start at pTip
    pathString += `M ${pTip.x} ${pTip.y}`;

    // Curve from pTip to pLeft
    // C controlPoint1.x controlPoint1.y, controlPoint2.x controlPoint2.y, endPoint.x endPoint.y
    pathString += ` C ${cpLeft1.x} ${cpLeft1.y}, ${cpLeft2.x} ${cpLeft2.y}, ${pLeft.x} ${pLeft.y}`;

    // Curve from pLeft to pRight (the base)
    pathString += ` C ${cpBase1.x} ${cpBase1.y}, ${cpBase2.x} ${cpBase2.y}, ${pRight.x} ${pRight.y}`;

    // Curve from pRight back to pTip
    pathString += ` C ${cpRight1.x} ${cpRight1.y}, ${cpRight2.x} ${cpRight2.y}, ${pTip.x} ${pTip.y}`;

    // Close the path
    pathString += " Z";

    return pathString;
};

const ArrowView = ({ curveDelta, dash, cap, color, width, debug, from, to}) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const lineSVGPath = `M ${from.x} ${from.y} ${to.x} ${to.y}`;
  const path = arrowheadPathSVG(from, to, 8, 3)

    return(
    <View style={{position: 'absolute', zIndex: 1000}} pointerEvents='none'>
    <Svg width={windowWidth} height={windowHeight}>
    <G>
      {/* Rendering the line */}
      <Path
        d={lineSVGPath} // 'line' should be an SVG path string (e.g., "M x1 y1 L x2 y2")
        strokeWidth={width}
        stroke={color}
        strokeDasharray={dash} // ART's strokeDash is react-native-svg's strokeDasharray
        strokeLinecap={cap} // ART's strokeCap is react-native-svg's strokeLinecap
        fill="none" // Lines typically have no fill
        style={{zIndex: 1000}}
      />
      <Path
        d={path} // 'this.arrowheadPath' should return an SVG path string
        strokeWidth={width} // Apply stroke width to the arrowhead outline if needed
        stroke={color} // Apply stroke color to the arrowhead outline if needed
        fill={color} // Fill the arrowhead with the specified color
        style={{zIndex: 1000}}
      />
    </G>
  </Svg>
  </View>
    )
}

export default ArrowView