import { Observable, BehaviorSubject } from "rxjs";
import { loadLocation, defaultLocation } from "./location";
import { Coordinate } from "../types";

const timeoutError = {
  code: 1,
  message: "",
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 1,
  TIMEOUT: 1,
};

function genPosition(latitude: number, longitude: number): Position {
  return {
    coords: {
      latitude,
      longitude,
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 1,
  };
}

describe("location", () => {
  it("We get the user location when all goes well", (done) => {
    const subjectLocation = new BehaviorSubject<Coordinate>({
      latitude: 1,
      longitude: 1,
    });
    const location$: Observable<Coordinate> = subjectLocation.asObservable();
    const getCurrentPos = (succ: PositionCallback) => {
      succ(genPosition(2, 2));
    };

    loadLocation(subjectLocation, getCurrentPos);
    location$.subscribe(
      ({ latitude, longitude }) => {
        expect(latitude).toBe(2);
        expect(longitude).toBe(2);
        done();
      },
      () => done.fail(),
      () => done.fail()
    );
  }, 100);

  it("Default coordinates when we cannot get them from the browser", (done) => {
    const subjectLocation = new BehaviorSubject<Coordinate>({
      latitude: 1,
      longitude: 1,
    });
    const location$: Observable<Coordinate> = subjectLocation.asObservable();
    const getCurrentPos = (successCallback, errorCallback) =>
      errorCallback(timeoutError);

    loadLocation(subjectLocation, getCurrentPos);
    location$.subscribe(
      ({ latitude, longitude }) => {
        expect(latitude).toBe(defaultLocation.latitude);
        expect(longitude).toBe(defaultLocation.longitude);
        done();
      },
      () => done.fail(),
      () => done.fail()
    );
  }, 100);

  it("we get an error if the browser does not support locations", (done) => {
    const subjectLocation = new BehaviorSubject<Coordinate>({
      latitude: 1,
      longitude: 1,
    });
    const location$: Observable<Coordinate> = subjectLocation.asObservable();

    loadLocation(subjectLocation);
    location$.subscribe(
      () => done.fail(),
      () => done(),
      () => done.fail()
    );
  }, 100);
});