import { Observable } from "rxjs";
import { Segment } from "../types";
import { genStravaRequestHeaders } from "./strava";

export default function createHttpObservable(
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
