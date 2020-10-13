import { of } from "rxjs";
import store from "./store";
import { genPosition, genWeatherEntries } from "./ut_helpers";

describe("store", () => {
  describe("store/location", () => {
    beforeEach(() => {
      store.init("token", {
        getPositionFn: (succ: PositionCallback) => succ(genPosition(2, 2)),
        weatherAjax$: null,
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
      const entry1 = genWeatherEntries(1)[0];
      const ajaxWeatherMock$ = of([entry1]);

      store.init("token", {
        getPositionFn: (succ: PositionCallback) => succ(genPosition(2, 2)),
        weatherAjax$: ajaxWeatherMock$,
      });
    });

    it("We have access to the weather data if all goes well", (done) => {
      store.getWeatherData().subscribe(
        (weatherData) => {
          expect(weatherData.length).toBe(1);
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
});
