import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Segment, Coordinate, WeatherEntry } from "../types";
import { loadStravaData } from "./strava";
import { getLocation } from "./location";
import { loadWeatherData } from "./weather";

const subjectSegments = new BehaviorSubject<Segment[]>([]);
const segments$: Observable<Segment[]> = subjectSegments.asObservable();

const subjectSelectedSegment = new BehaviorSubject<Segment[]>([]);
const selectedSegment$: Observable<
  Segment[]
> = subjectSelectedSegment.asObservable();

const subjectMustLogin = new BehaviorSubject<boolean>(false);
const mustLogin$: Observable<boolean> = subjectMustLogin.asObservable();

const subjectLoadingStrava = new BehaviorSubject<boolean>(true);
const loadingStrava$: Observable<boolean> = subjectLoadingStrava.asObservable();

const subjectLoadingWeather = new BehaviorSubject<boolean>(true);
const loadingWeather$: Observable<boolean> = subjectLoadingWeather.asObservable();

const loading$ = combineLatest([loadingWeather$, loadingStrava$]).pipe(
  map(([lweather, lstrava]) => lweather || lstrava)
);

const location$: Observable<Coordinate> = getLocation();

const subjectWeather = new BehaviorSubject<WeatherEntry[]>([]);
const weather$: Observable<WeatherEntry[]> = subjectWeather.asObservable();

const store = (function () {
  function init(stravaToken: string | null) {
    location$.subscribe(
      (location) => loadWeatherData(location, subjectWeather),
      () => console.log("Using default coordinates")
    );

    weather$.subscribe(
      () => subjectLoadingWeather.next(true),
      (error) => console.log(error), // TODO
      () => subjectLoadingWeather.next(false)
    );

    loadStravaData(stravaToken, subjectSegments, subjectMustLogin);
    segments$.subscribe(
      () => subjectLoadingStrava.next(false),
      (error) => console.log(error) // TODO
    );
  }

  const getSegments = () => segments$;

  const getSelectedSegment = () => selectedSegment$;

  const getMustLogin = () => mustLogin$;

  const getLoading = () => loading$;

  const getLocation = () => location$;

  const getWeatherData = () => weather$;

  function setSelectedSegment(id: number) {
    const filteredSegments = subjectSegments
      .getValue()
      .filter((s) => s.id === id);

    const currentSelectedId = subjectSelectedSegment.getValue();
    const selectingSameSegment =
      currentSelectedId.length > 0 && currentSelectedId[0].id === id;

    if (id === -1 || selectingSameSegment) {
      subjectSelectedSegment.next([]);
      return;
    }

    if (filteredSegments.length === 1) {
      segments$
        .pipe(map((listSegments) => listSegments.find((s) => s.id === id)))
        .subscribe((s) => s && subjectSelectedSegment.next([s]));
    }
  }

  return {
    init,
    getSegments,
    setSelectedSegment,
    getSelectedSegment,
    getLocation,
    getMustLogin,
    getLoading,
    getWeatherData,
  };
})();

export default store;
