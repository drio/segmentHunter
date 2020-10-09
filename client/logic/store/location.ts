import { Observable } from "rxjs";
import { Coordinate, GeoResult } from "../types";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const defaultLocation = {
  latitude: 32.784618 /* CHS */,
  longitude: -79.940918,
};

function getLocation(): Observable<Coordinate> {
  return new Observable((observer) => {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (result: GeoResult) => {
          const location: Coordinate = result.coords;
          observer.next(location);
          observer.complete();
        },
        () => observer.next(defaultLocation),
        options
      );
    } else {
      observer.error("Unsupported browser"); // TODO
    }
  });
}

export { getLocation, defaultLocation };
