import { BehaviorSubject } from "rxjs";
import { Coordinate, GeoResult } from "../types";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

/* CHS */
const defaultLocation = {
  latitude: 32.784618,
  longitude: -79.940918,
};

interface getPosFunction {
  (
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ): void;
}

function loadLocation(
  subjectLocation: BehaviorSubject<Coordinate>,
  gpFuncImp?: getPosFunction
): void {
  let getPosition: getPosFunction | null;
  const inBrowser =
    typeof window !== "undefined" &&
    window.navigator &&
    window.navigator.geolocation;

  if (gpFuncImp) {
    getPosition = gpFuncImp;
  } else if (inBrowser) {
    getPosition = window.navigator.geolocation.getCurrentPosition;
  } else {
    getPosition = null;
  }

  if (getPosition) {
    /* horrible HACK to avoid getting a type error when pointing getPosition to the
      browser's implementation */
    const [succ, err, opts] = [
      (result: GeoResult) => {
        const location: Coordinate = result.coords;
        subjectLocation.next(location);
      },
      () => subjectLocation.next(defaultLocation),
      options,
    ];
    if (inBrowser)
      window.navigator.geolocation.getCurrentPosition(succ, err, opts);
    else getPosition(succ, err, opts);
  } else {
    subjectLocation.error("Unsupported browser"); // TODO
  }
}

export { loadLocation, defaultLocation };
