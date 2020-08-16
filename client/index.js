import React, { useState } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import TestMap from "./test-map";
import "leaflet/dist/leaflet.css";
import listOfSegments from "./data/segments/starred.json";
import segments from "./data/segments/all.json";

const chs = {
  lat: 32.784618,
  lon: -79.940918
};
const position = [chs.lat, chs.lon];

console.log(segments[24]);

function HelloMessage(props) {
  return (
    <div>
      <div># of segments {segments.length}</div>
      <div>
        <TestMap position={segments[24].end_latlng} />
      </div>
    </div>
  );
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage name="Jane" />, mountNode);
