import { Observable, of, throwError } from "rxjs";
import { loadWeatherData } from "./weather";
import { genWeatherObservables, genErrorObservables } from "./helpers";
import { WeatherEntry } from "../types";

describe("store/weather", () => {
  it("We get weather data when all goes well", (done) => {
    const entry1: WeatherEntry = {
      temp: 1,
      wind_deg: 1,
      wind_speed: 1,
      weather: {
        description: "foo",
      },
      dt: 1,
    };

    const ajaxMock = of([entry1]);
    const aCoordinate = { latitude: 1, longitude: 2 };
    const [subjectWeather, weather$] = genWeatherObservables();
    const subjectError = genErrorObservables()[0];
    loadWeatherData(aCoordinate, subjectWeather, subjectError, ajaxMock);

    weather$.subscribe(
      (entries) => {
        expect(entries.length).toBe(1);
        expect(entries[0].temp).toBe(1);
        done();
      },
      () => done.fail(),
      () => done.fail()
    );
  });

  it("We get an error if the ajax call fails", (done) => {
    const ajaxMock = throwError(new Error("msg here"));
    const aCoordinate = { latitude: 1, longitude: 2 };
    const [subjectWeather, weather$] = genWeatherObservables();
    const [subjectError, error$] = genErrorObservables();
    loadWeatherData(aCoordinate, subjectWeather, subjectError, ajaxMock);

    error$.subscribe(
      (err) => {
        expect(err.error).toBe(true);
        done();
      },
      () => done.fail(),
      () => done.fail()
    );

    weather$.subscribe(
      (entries) => {
        expect(entries.length).toBe(0);
        done();
      },
      () => done.fail(),
      () => done.fail()
    );
  });
});
