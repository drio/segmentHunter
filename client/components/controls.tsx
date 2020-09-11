import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { clearCookies } from "../logic/session";
import { Segment, WeatherEntry } from "../logic/types";
/*import * as Slider from "rc-slider";*/
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

interface LoggedInProps {
  profile: string | "";
  username: string | null;
  onUpdateLocation: () => void;
}

function LoggedIn(props: LoggedInProps) {
  const { profile, username, onUpdateLocation } = props;
  const ifLoggedIn = (
    <>
      <div style={{ paddingRight: "10px" }}>
        <figure className="image is-32x32">
          <img className="is-rounded" src={profile} />
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
        <button onClick={handleLogout} className="button is-danger">
          logout
        </button>
      </div>
    </>
  );

  const ifNotLoggedIn = (
    <div style={{ paddingRight: "10px" }}>
      <button onClick={handleClearAll} className="button is-danger">
        login
      </button>
    </div>
  );

  return (
    <MainRowLoginInfo className="container buttons are-small">
      {username && profile ? ifLoggedIn : ifNotLoggedIn}
    </MainRowLoginInfo>
  );
}

//const DATE_FORMAT = "dddd, MMMM Do, h:mm a";
const DATE_FORMAT = "dddd, h:mm a";

const formatDate = (ts: number) => moment.unix(ts).format(DATE_FORMAT);

const toFahrenheit = (c: number) => +(c * 1.8 + 32.0).toFixed(0);

const toMilesHour = (ms: number) => {
  return +(ms * 0.00062 * 3600).toFixed(1);
};

function degToCompass(num: number) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
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
    "NNW",
  ];
  return arr[val % 16];
}

interface ControlProps {
  segments: Segment[];
  weather: WeatherEntry[];
  username: string | null;
  profile: string | "";
  changeAction: (e: WeatherEntry) => void;
  onUpdateLocation: () => void;
  onSegmentClick: (s: Segment | null) => void;
}

// https://en.wikipedia.org/wiki/Cardinal_direction#/media/File:Brosen_windrose.svg
function Controls(props: ControlProps) {
  const {
    segments,
    weather,
    username,
    profile,
    changeAction,
    onUpdateLocation,
    onSegmentClick,
  } = props;

  const [value, setValue] = useState(0);
  const [timeString, setTimeString] = useState("init");
  const [max, setMax] = useState(0);
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setMax(weather.length - 1);
    setTimeString(formatDate(weather[0].dt));
    setShowSegmentDetails(false);
  }, []);

  function handleSegmentClick(selSegment: Segment) {
    const { id } = selSegment;
    const somethingSelected = id === selectedId ? false : true;
    onSegmentClick(somethingSelected ? selSegment : null);
    setSelectedId(somethingSelected ? id : null);
  }

  const { temp, wind_deg, wind_speed, dt } = weather[value];
  const description = weather[value].weather.description;

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
                paddingBottom: "5px",
              }}
            >
              <b>Time Selection</b>
            </div>
            <div style={{ paddingBottom: "0px" }}>
              <b>Time</b>: {timeString}
            </div>

            <div>
              <b>Temperature</b>: {temp.toFixed(0)}C | {toFahrenheit(temp)}F{" "}
            </div>

            <div>
              <b>Wind direction</b>: {degToCompass(wind_deg)} / {wind_deg}°
            </div>

            <div>
              <b>Wind speed</b>: {toMilesHour(wind_speed)} miles/h |{" "}
              {wind_speed} m/s
            </div>

            <div>{description} </div>
            {/*
            <Slider
              value={value}
              min={0}
              max={max}
              step={1}
              style={{ paddingTop: "10px" }}
              railStyle={{ background: "rgb(74, 81, 84, 0.6)" }}
            />
            */}
            <input
              style={{ width: "100%" }}
              step="1"
              min="0"
              max={max}
              value={value}
              onChange={(e) => {
                const v = +e.target.value;
                setValue(v);
                setTimeString(formatDate(dt));
                changeAction(weather[v]);
              }}
              type="range"
            />
          </div>
        </>
      )}

      <div>
        <span>⭐️ {segments.length} segments loaded </span>
        <button
          onClick={() => setShowSegmentDetails(!showSegmentDetails)}
          className="button is-small is-warning is-rounded"
        >
          {segments.length > 0 && showSegmentDetails ? "hide" : "show"}
        </button>
        {showSegmentDetails && (
          <div
            className="containerl"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "5px",
              textOverflow: "Ellipsis",
              maxHeight: "65vh",
              overflow: "scroll",
            }}
          >
            <div>
              {segments.map((s) => (
                <div key={s.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      onClick={() => handleSegmentClick(s)}
                      id={`input-${s.id}`}
                      checked={s.id === selectedId}
                      readOnly
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
      </div>
    </ControlsDiv>
  );
}

export default Controls;
