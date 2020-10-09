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

  if (gpFuncImp) {
    getPosition = gpFuncImp;
  } else if (
    typeof window !== "undefined" &&
    window.navigator &&
    window.navigator.geolocation
  ) {
    getPosition = window.navigator.geolocation.getCurrentPosition;
  } else {
    getPosition = null;
  }

  if (getPosition) {
    getPosition(
      (result: GeoResult) => {
        const location: Coordinate = result.coords;
        subjectLocation.next(location);
      },
      () => subjectLocation.next(defaultLocation),
      options
    );
  } else {
    subjectLocation.error("Unsupported browser"); // TODO
  }
}

export { loadLocation, defaultLocation };
