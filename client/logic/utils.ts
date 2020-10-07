import { useState, useEffect } from "react";
import { Observable, interval, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import moment from "moment";
import { take, map, catchError } from "rxjs/operators";

import { Segment } from "./types";
import { clearCookies } from "./session";

function handleLogout() {
  clearCookies();
  window.location.replace("/");
}

const genStravaRequestHeaders = (token) => ({
  accept: "application/json",
  authorization: `Bearer ${token}`,
});

const useObservable = (observable: any, defaultValue?: any) => {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const sub = observable.subscribe(setState);
    return () => sub.unsubscribe();
  }, [observable]);

  return state;
};

function createHttpObservable(
  url: string,
  token: string | null
): Observable<Segment[]> {
  // FIXME: will have to return a type any
  return new Observable((observer) => {
    /* Cancel requests that are ongoing when the observable is canceled */
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {
      signal,
      headers: genStravaRequestHeaders(token),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request failed with status code: " + response.status);
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    /* Cancelation function of our observable */
    return () => controller.abort();
  });
}

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
  createHttpObservable,
  degToCompass,
  formatDate,
  toFahrenheit,
  toMilesHour,
  genStravaRequestHeaders,
  handleLogout,
};
