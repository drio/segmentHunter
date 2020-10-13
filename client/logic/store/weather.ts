import { Observable, BehaviorSubject } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { StoreError, WeatherEntry, Coordinate } from "../types";

const OPEN_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/onecall";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

function generateOpenWeatherURL(location: Coordinate) {
  return (
    `${OPEN_WEATHER_API_URL}` +
    `?lat=${location.latitude}&lon=${location.longitude}` +
    `&APPID=${OPEN_WEATHER_KEY}` +
    `&exclude=minutely&current&units=metric`
  );
}

function loadWeatherData(
  location: Coordinate,
  subjectWeather: BehaviorSubject<WeatherEntry[]>,
  subjectError: BehaviorSubject<StoreError>,
  paramAjax$?: Observable<WeatherEntry[]>
): void {
  const inTheBrowser = typeof window !== "undefined";
  if (!inTheBrowser) return;

  const url = generateOpenWeatherURL(location);
  const defaultAjax$ = ajax(url).pipe(map(({ response }) => response.hourly));

  const ajaxToUse$ = paramAjax$ || defaultAjax$;

  ajaxToUse$.subscribe(
    (hourlyWeatherData: WeatherEntry[]) =>
      subjectWeather.next(hourlyWeatherData),
    (error: string) =>
      subjectError.next({
        msg: "I couldn't download the weather data.",
        error: true,
        details: error,
      })
  );
}

export { loadWeatherData };
