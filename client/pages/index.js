//import React, { useState } from "react";
//import * as d3 from "d3";
//import ReactDOM from "react-dom";
//import TestLeafLet from "./test-leaflet";
//import "leaflet/dist/leaflet.css";
//import TestMapBox from "./test-mapbox";
//import listOfSegments from "./data/segments/starred.json";
import segments from "../data/segments/all.json";

const chs = {
  lat: 32.784618,
  lon: -79.940918
};

import dynamic from "next/dynamic";

const importMap = () => import("../components/test-mb-next");

const DynamicComponentWithNoSSR = dynamic(importMap, {
  ssr: false
});

const Index = () => <DynamicComponentWithNoSSR segments={segments} />;

export default Index;
