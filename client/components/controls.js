import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { clearCookies } from "../logic/session";
import Slider from "rc-slider";
import moment from "moment";

const MAX_SEGMENT_TEXT_SIZE = 35;

const ControlsDiv = styled.div`
  font-size: 16px;
  width: 370px;
  margin: 0;
  background: rgba(68, 65, 65, 0.9);
  padding: 14px;
  border-radius: 10px;
  color: white;
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 4px;
  z-index: 2;
`;

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

const MainRowLoginInfo = styled.div`
  display: "flex";
  justify-content: "flex-end";
  align-items: "center";
  margin: 5;
`;

const LoggedIn = ({ profile, username, onUpdateLocation }) => {
  const ifLoggedIn = (
    <>
      <div style={{ paddingRight: "10px" }}>
        <figure className="image is-32x32">
          <img className="is-rounded" src={`${profile}`} />
        </figure>
      </div>

      {username === "driodeiros" && (
        <>
          <div style={{ paddingRight: "10px" }}>
            <button onClick={handleClearAll} className="button is-black ">
              fresh
            </button>
          </div>

          <div style={{ paddingRight: "10px" }}>
            <button onClick={onUpdateLocation} className="button is-info">
              Update Location
            </button>
          </div>
        </>
      )}

      <div>
        <button href="#" onClick={handleLogout} className="button is-danger">
          logout
        </button>
      </div>
    </>
  );

  const ifNotLoggedIn = (
    <div style={{ paddingRight: "10px" }}>
      <button href="#" onClick={handleClearAll} className="button is-danger">
        login
      </button>
    </div>
  );

  return (
    <MainRowLoginInfo className="container buttons are-small">
      {username && profile ? ifLoggedIn : ifNotLoggedIn}
    </MainRowLoginInfo>
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
function Controls(props) {
  const segments = props.segments || [];
  const weather = props.weather || [];
  const username = props.username || null;
  const profile = props.profile || "";
  const changeAction = props.changeAction || (() => null);
  const onUpdateLocation = props.onUpdateLocation || (() => null);
  const onSegmentClick = props.onSegmentClick || (() => null);

  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setMax(weather.length - 1);
    setTimeString(formatDate(weather[0].startTime));
  }, []);

  function handleSegmentClick(id) {
    onSegmentClick(id);
    setSelectedId(id === selectedId ? null : id);
  }

  const {
    temperature,
    windAngle,
    windSpeed,
    shortForecast,
    startTime
  } = weather[value];

  return (
    <ControlsDiv>
      <LoggedIn
        profile={profile}
        username={username}
        onUpdateLocation={onUpdateLocation}
      />

      {weather.length > 0 && (
        <>
          <div className="box" style={{ padding: 12 }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                paddingBottom: "5px"
              }}
            >
              <b>Time Selection</b>
            </div>
            <div style={{ paddingBottom: "0px" }}>
              <b>Time</b>:{timeString}
            </div>

            <div>
              <b>Temperature</b>:{temperature.toFixed(0)}C |{" "}
              {toFahrenheit(temperature)}F{" "}
            </div>

            <div>
              <b>Wind direction</b>: {degToCompass(windAngle)} / {windAngle}°
            </div>

            <div>
              <b>Wind speed</b>:{toMilesHour(windSpeed)} miles/h | {windSpeed}{" "}
              m/s
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
        </>
      )}

      <div>
        <span>⭐️ {segments.length} segments loaded </span>
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
                  <input
                    type="checkbox"
                    onClick={() => handleSegmentClick(s.id)}
                    id={`input-${s.id}`}
                    checked={s.id === selectedId}
                  />{" "}
                  {s.name.length > MAX_SEGMENT_TEXT_SIZE
                    ? s.name.slice(0, MAX_SEGMENT_TEXT_SIZE) + " ..."
                    : s.name}{" "}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </ControlsDiv>
  );
}

export default Controls;
