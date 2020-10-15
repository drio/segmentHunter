import { Observable } from "rxjs";
import { Segment } from "../types";
import { genStravaRequestHeaders } from "./strava";
import { StoreErrorContext, ErrorCode } from "./types";

const knowErrors = [
  "It seems we have problems accessing the weather data.",
  "We cannot access your strava segments.",
  "We cannot get your current location.",
];

function genDetailedMsg(err: StoreErrorContext | null): string {
  if (err && err.code >= 0 && err.code < 3) return knowErrors[err.code];
  return "Crazy, you just hit an unknown error.";
}

function genError(e: ErrorCode): StoreErrorContext {
  return {
    code: e,
  };
}

function createHttpObservable(
  url: string,
  token: string | null
): Observable<Segment[]> {
  // FIXME: will have to return a type any
  return new Observable((observer) => {
    /* Cancel requests that are ongoing when the observable is canceled */
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchImplementation = window && window.fetch ? window.fetch : fetch;

    fetchImplementation(url, {
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

export { genDetailedMsg, genError, createHttpObservable };
