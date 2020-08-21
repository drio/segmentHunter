//import React, { useState } from "react";
//import * as d3 from "d3";
//import ReactDOM from "react-dom";
//import TestLeafLet from "./test-leaflet";
//import "leaflet/dist/leaflet.css";
//import TestMapBox from "./test-mapbox";
//import listOfSegments from "./data/segments/starred.json";

//import moment from "moment";
import dynamic from "next/dynamic";
import segments from "../data/segments/all.json";
import weather from "../data/weather/hourly.json";
import WeatherSlider from "../components/weather_slider";

const chs = {
  lat: 32.784618,
  lon: -79.940918
};

const importMap = () => import("../components/test-mb-next");

const Map = dynamic(importMap, {
  ssr: false
});

const sc_segments_only = segments.filter(s => s.state == "SC");

const Index = () => <Map segments={sc_segments_only} weather={weather} />;

const TestWeather = () => {
  function action(d) {
    console.log(d);
  }
  return (
    <div>
      <WeatherSlider data={weather} changeAction={action} />
      <Map segments={sc_segments_only} weather={weather} />
    </div>
  );
};

export default TestWeather;
