import { Observable, BehaviorSubject } from "rxjs";
import { loadLocation, defaultLocation } from "./location";
import { Coordinate } from "../types";
import { genErrorObservables } from "./helpers";
import { genPosition } from "./ut_helpers";

const timeoutError = {
  code: 1,
  message: "",
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 1,
  TIMEOUT: 1,
};

describe("store/location", () => {
  it("We get the user location when all goes well", (done) => {
    const subjectLocation = new BehaviorSubject<Coordinate>({
      latitude: 1,
      longitude: 1,
    });
    const location$: Observable<Coordinate> = subjectLocation.asObservable();

    const getCurrentPos = (succ: PositionCallback) => {
      succ(genPosition(2, 2));
    };

    const [subjectError, error$] = genErrorObservables();
    loadLocation(subjectLocation, subjectError, getCurrentPos);
    location$.subscribe(
      ({ latitude, longitude }) => {
        expect(latitude).toBe(2);
        expect(longitude).toBe(2);
        error$.subscribe((val) => (val.error ? done.fail() : done()));
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
    const getCurrentPosForceFail = (successCallback, errorCallback) =>
      errorCallback(timeoutError);

    const [subjectError, error$] = genErrorObservables();
    loadLocation(subjectLocation, subjectError, getCurrentPosForceFail);
    location$.subscribe(
      ({ latitude, longitude }) => {
        expect(latitude).toBe(defaultLocation.latitude);
        expect(longitude).toBe(defaultLocation.longitude);
        error$.subscribe((val) => (val.error ? done.fail() : done()));
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

    const [subjectError, error$] = genErrorObservables();
    loadLocation(subjectLocation, subjectError);

    error$.subscribe(
      (val) => (val.error ? done() : done.fail()),
      () => done.fail(),
      () => done.fail()
    );
  }, 100);
});
