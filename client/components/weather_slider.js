import { useState, useEffect } from "react";
import Slider from "rc-slider";
import moment from "moment";

import config from "../config.json";

const style = {
  fontSize: 16,
  width: 500,
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

const formatDate = s => moment(s).format(DATE_FORMAT);

const toCelsious = f => ((f - 32) * 0.55).toFixed(1);

const toKmHour = m => {
  const re = /(\d+)\s/;
  const match = m.match(re);
  if (match) {
    const milesPerHour = match[1];
    return (parseFloat(milesPerHour) * parseFloat(1.61)).toFixed(1);
  }
  return 0;
};

function WeatherSlider({ segments, data, changeAction }) {
  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);

  useEffect(() => {
    setMax(data.length - 1);
    setTimeString(formatDate(data[0].startTime));
  }, []);

  const {
    temperature,
    windDirection,
    windSpeed,
    shortForecast,
    startTime
  } = data[value];

  return (
    <div style={style}>
      <div style={{}}>© Segment Hunter (v{config.version})</div>
      <div>⭐️ {segments.length} segments loaded</div>
      <div style={{ fontSize: "20px", paddingBottom: "0px" }}>
        <b>{timeString}</b>
      </div>
      <div>
        🌡 {temperature}F | {toCelsious(temperature)}C 💨 (<b>{windDirection}</b>
        ) {windSpeed} | {toKmHour(windSpeed)} km/h
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
          changeAction(data[v]);
        }}
        style={{ paddingTop: "10px" }}
      />
    </div>
  );
}

export default WeatherSlider;
