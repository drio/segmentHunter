//import React, { useState } from "react";
//import * as d3 from "d3";
//import ReactDOM from "react-dom";
//import TestLeafLet from "./test-leaflet";
//import "leaflet/dist/leaflet.css";
//import TestMapBox from "./test-mapbox";
//import listOfSegments from "./data/segments/starred.json";
//import segments from "./data/segments/all.json";

const chs = {
  lat: 32.784618,
  lon: -79.940918
};
const leafExample = [51.505, -0.09];
const home = [32.782003, -79.932903];
//const position = [chs.lat, chs.lon];
const position = home;

//console.log(segments[24].end_latlng);

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/test-mb-next"),
  {
    ssr: false
  }
);

export default () => <DynamicComponentWithNoSSR />;
