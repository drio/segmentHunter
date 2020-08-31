import polyline from "@mapbox/polyline";
import * as turf from "@turf/turf";

function polyToCoordinates(pline) {
  return polyline.decode(pline).map(p => [p[1], p[0]]); // reverse lat/long
}

/*
  WARNING: the input points have to be in the format [longitude, latitude]
 */
function computeDistance(from, to) {
  const distance = turf.distance(turf.point(from), turf.point(to), {
    units: "kilometers"
  });
  return distance;
}

function computeAngle(p1, p2) {
  const [lon1, lat1] = p1;
  const [lon2, lat2] = p2;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let brng = Math.atan2(y, x);
  brng = brng * (180 / Math.PI);
  brng = (brng + 360) % 360;
  brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise

  return brng;
}

function score(segment, windDirection) {
  const coordinateList = polyToCoordinates(segment.map.polyline);

  let prev = null;
  const distance = [];
  const angles = [];
  coordinateList.forEach(p => {
    if (prev) {
      distance.push(+computeDistance(prev, p).toFixed(2));
      angles.push(
        Math.abs(+(computeAngle(prev, p) - windDirection).toFixed(2))
      );
    }
    prev = p;
  });
  const percentage = distance.map(
    d => +((100 * d) / (segment.distance / 1000)).toFixed(3)
  );
  const windHelpIndex = angles.map(a => {
    if (a < 10) return 1;
    if (a < 20) return 0.75;
    if (a < 30) return 0.5;
    if (a < 40) return 0.25;
    return 0;
  });

  let score = 0;
  windHelpIndex.forEach(
    (h, idx) => (score += +(h * percentage[idx]).toFixed(2))
  );

  return +score.toFixed(2);
}

export default { score, polyToCoordinates };
