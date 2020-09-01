import { useState, useEffect } from "react";
import Slider from "rc-slider";
import moment from "moment";

import config from "../config.json";

const style = {
  fontSize: 16,
  width: "50vw",
  margin: 10,
  background: "rgba(68, 65, 65, 0.84)",
  padding: "14px",
  borderRadius: "4px",
  color: "white",
  display: "inline-block",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 2
};

const DATE_FORMAT = "dddd, MMMM Do YYYY, h:mm:ss a";

const formatDate = ts => moment.unix(ts).format(DATE_FORMAT);

const toFahrenheit = c => +(c * 1.8 + 32.0).toFixed(0);

const toMilesHour = ms => {
  return +(ms * 0.00062 * 3600).toFixed(1);
};

function degToCompass(num) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
  ];
  return arr[val % 16];
}

// https://en.wikipedia.org/wiki/Cardinal_direction#/media/File:Brosen_windrose.svg
function WeatherSlider({ segments, weather, changeAction }) {
  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);

  useEffect(() => {
    setMax(weather.length - 1);
    setTimeString(formatDate(weather[0].startTime));
  }, []);

  const {
    temperature,
    windDirection,
    windSpeed,
    shortForecast,
    startTime
  } = weather[value];

  return (
    <div style={style}>
      <div style={{}}>© Segment Hunter (v{config.version})</div>
      <div>⭐️ {segments.length} segments loaded</div>
      <div style={{ fontSize: "20px", paddingBottom: "0px" }}>
        <b>{timeString}</b>
      </div>

      <div>
        🌡 {temperature.toFixed(0)}C | {toFahrenheit(temperature)}F{" "}
      </div>

      <div>
        💨{" "}
        <b>
          ({degToCompass(windDirection)} / {windDirection}°)
        </b>{" "}
        {toMilesHour(windSpeed)} miles/h | {windSpeed} m/s
      </div>

      <div>{shortForecast} </div>
      <Slider
        value={value}
        min={0}
        max={max}
        step={1}
        onChange={v => {
          setValue(v);
          setTimeString(formatDate(startTime));
          changeAction(weather[v]);
        }}
        style={{ paddingTop: "10px" }}
      />
    </div>
  );
}

export default WeatherSlider;
