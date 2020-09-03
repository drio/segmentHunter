import React from "react";
import { useState, useEffect } from "react";
import { clearCookies } from "../logic/session";
import Slider from "rc-slider";
import moment from "moment";

const MAX_SEGMENT_TEXT_SIZE = 34;

const style = {
  fontSize: 16,
  width: "370px",
  margin: 0,
  background: "rgba(68, 65, 65, 0.9)",
  padding: "14px",
  borderRadius: "10px",
  color: "white",
  display: "inline-block",
  position: "absolute",
  top: 5,
  right: 4,
  zIndex: 2
};

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

function handleClearAll() {
  // FIXME: do not hardcode the key values
  localStorage.removeItem("segment_hunter_weather");
  localStorage.removeItem("segment_hunter_segments");
  handleLogout();
}

const LoggedIn = ({ profile, username, onUpdateLocation }) => {
  return (
    <div
      className="container buttons are-small"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: 5
      }}
    >
      {username === "driodeiros" && (
        <div style={{ paddingRight: "10px" }}>
          <button onClick={handleClearAll} className="button is-black ">
            fresh
          </button>
        </div>
      )}

      <div style={{ paddingRight: "10px" }}>
        <button onClick={onUpdateLocation} className="button is-info">
          Update Location
        </button>
      </div>

      <div style={{ paddingRight: "10px" }}>
        <button href="#" onClick={handleLogout} className="button is-danger">
          logout
        </button>
      </div>

      <div>
        <figure className="image is-32x32">
          <img className="is-rounded" src={`${profile}`} />
        </figure>
      </div>
    </div>
  );
};

//const DATE_FORMAT = "dddd, MMMM Do, h:mm a";
const DATE_FORMAT = "dddd, h:mm a";

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
function WeatherSlider({
  segments,
  weather,
  changeAction,
  username,
  profile,
  onUpdateLocation
}) {
  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);
  const [showSegmentDetails, setShowSegmentDetails] = useState(true);

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
      <LoggedIn
        profile={profile}
        username={username}
        onUpdateLocation={onUpdateLocation}
      />

      <div className="box">
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
          railStyle={{ background: "rgb(74, 81, 84, 0.6)" }}
        />
      </div>

      <div>
        <span>⭐️ {segments.length} segments loaded </span>
        <button
          onClick={() => setShowSegmentDetails(!showSegmentDetails)}
          className="button is-small is-primary"
        >
          {segments.length > 0 && showSegmentDetails ? "hide" : "show"}
        </button>
      </div>

      {showSegmentDetails && (
        <div
          className="containerl"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textOverflow: "Ellipsis"
          }}
        >
          <div>
            {segments.map(s => (
              <div key={s.id}>
                <label className="checkbox">
                  <input type="checkbox" />{" "}
                  {s.name.length > MAX_SEGMENT_TEXT_SIZE
                    ? s.name.slice(0, MAX_SEGMENT_TEXT_SIZE) + " ..."
                    : s.name}{" "}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherSlider;
