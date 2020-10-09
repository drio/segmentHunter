import { useState, useEffect } from "react";
import moment from "moment";

import { clearCookies } from "./session";

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

const useObservable = (observable: any, defaultValue?: any) => {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const sub = observable.subscribe(setState);
    return () => sub.unsubscribe();
  }, [observable]);

  return state;
};

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

export {
  useObservable,
  degToCompass,
  formatDate,
  toFahrenheit,
  toMilesHour,
  handleLogout,
};
