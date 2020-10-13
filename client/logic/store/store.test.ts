import { of } from "rxjs";
import store from "./store";
import { genPosition, genWeatherEntries, genSegments } from "./ut_helpers";

describe("store", () => {
  describe("store/location", () => {
    beforeEach(() => {
      const entry1 = genWeatherEntries(1)[0];
      const ajaxWeatherMock$ = of([entry1]);
      const localDetailedSegmentsMock = [];
      const allSegments = genSegments(6);
      const newDetailedSegmentsMock$ = of(allSegments);

      store.init("token", {
        getPositionFn: (succ: PositionCallback) => succ(genPosition(2, 2)),
        weatherAjax$: ajaxWeatherMock$,
        localDetailedSegments: localDetailedSegmentsMock,
        newDetailedSegments$: newDetailedSegmentsMock$,
      });
    });

    it("We get the location without error when the browser has the geolocation API", (done) => {
      store.getLocation().subscribe(
        ({ latitude, longitude }) => {
          expect(latitude).toBe(2);
          expect(longitude).toBe(2);
          store
            .getError()
            .subscribe((val) => (val.error ? done.fail() : done()));
        },
        () => done.fail(),
        () => done.fail()
      );
    });
  });

  describe("store/weatherData", () => {
    beforeEach(() => {
      const entries = genWeatherEntries(2);
      const ajaxWeatherMock$ = of([...entries]);
      const localDetailedSegmentsMock = [];
      const allSegments = genSegments(6);
      const newDetailedSegmentsMock$ = of(allSegments);

      store.init("token", {
        getPositionFn: (succ: PositionCallback) => succ(genPosition(2, 2)),
        weatherAjax$: ajaxWeatherMock$,
        localDetailedSegments: localDetailedSegmentsMock,
        newDetailedSegments$: newDetailedSegmentsMock$,
      });
    });

    it("We have access to the weather data if all goes well", (done) => {
      store.getWeatherData().subscribe(
        (weatherData) => {
          expect(weatherData.length).toBe(2);
          done();
          store
            .getError()
            .subscribe((val) => (val.error ? done.fail() : done()));
        },
        () => done.fail(),
        () => done.fail()
      );
    });
  });

  describe("store/strava", () => {
    beforeEach(() => {
      const entry1 = genWeatherEntries(1)[0];
      const ajaxWeatherMock$ = of([entry1]);
      const localDetailedSegmentsMock = [];
      const allSegments = genSegments(6);
      const newDetailedSegmentsMock$ = of(allSegments);

      store.init("token", {
        getPositionFn: (succ: PositionCallback) => succ(genPosition(2, 2)),
        weatherAjax$: ajaxWeatherMock$,
        localDetailedSegments: localDetailedSegmentsMock,
        newDetailedSegments$: newDetailedSegmentsMock$,
      });
    });

    it("We get the strava segments when everything goes well", (done) => {
      store.getSegments().subscribe(
        (listSegments) => {
          expect(listSegments.length).toBe(6);
          store.getMustLogin().subscribe((v) => {
            expect(v).toBe(false);
            done();
          });
        },
        () => done.fail(),
        () => done.fail()
      );
    });
  });
});
