import { useState, useEffect } from "react";
import { Observable, interval, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { take, map, catchError } from "rxjs/operators";
import { Segment } from "./types";

const useObservable = (observable) => {
  const [state, setState] = useState();

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
  return new Observable((observer) => {
    /* Cancel requests that are ongoing when the observable is canceled */
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {
      signal,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
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

export { useObservable, createHttpObservable };
