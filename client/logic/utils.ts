import { useState, useEffect } from "react";
import { Observable, interval, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { take, map, catchError } from "rxjs/operators";

const useObservable = (observable) => {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable.subscribe(setState);
    return () => sub.unsubscribe();
  }, [observable]);

  return state;
};

export { useObservable };
