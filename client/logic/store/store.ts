import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { InitMockFunctions, ErrorCode, StoreErrorContext } from "./types";
import { Coordinate, Segment, WeatherEntry } from "../types";
import { genError } from "./utils";
import { loadStravaData } from "./strava";
import { loadLocation } from "./location";
import { loadWeatherData } from "./weather";

function store() {
  const subjectError = new BehaviorSubject<StoreErrorContext | null>(
    genError(ErrorCode.Ok)
  );
  const error$ = subjectError.asObservable();

  /* Observables for the three data sources */
  let subjectLocation: BehaviorSubject<Coordinate | null>;
  const subjectWeather = new BehaviorSubject<WeatherEntry[] | null>(null);
  const subjectSegments = new BehaviorSubject<Segment[] | null>(null);
  const subjectSelectedSegment = new BehaviorSubject<Segment | null>(null);

  /* Observables for the loading states */
  const subjectLoadingLocation = new BehaviorSubject<boolean>(false);
  const loadingLocation$: Observable<boolean> = subjectLoadingLocation.asObservable();
  const subjectLoadingStrava = new BehaviorSubject<boolean>(false);
  const loadingStrava$: Observable<boolean> = subjectLoadingStrava.asObservable();
  const subjectLoadingWeather = new BehaviorSubject<boolean>(false);
  const loadingWeather$: Observable<boolean> = subjectLoadingWeather.asObservable();
  const loading$ = combineLatest([
    loadingLocation$,
    loadingWeather$,
    loadingStrava$,
  ]).pipe(
    map(([llocation, lweather, lstrava]) => lweather || llocation || lstrava)
  );

  const subjectMustLogin = new BehaviorSubject<boolean>(false);
  const subjectWindAngle = new BehaviorSubject<number>(0);

  function init(stravaToken: string, mocks: InitMockFunctions = {}) {
    subjectLocation =
      mocks.subjectLocation || new BehaviorSubject<Coordinate | null>(null);

    subjectLoadingLocation.next(true);
    subjectLoadingWeather.next(true);
    subjectLoadingStrava.next(true);

    /* Subscribe to the three data observables and act accordingly */
    getLocation().subscribe(
      (location: Coordinate | null) => {
        if (location) {
          subjectLoadingLocation.next(false);
          loadWeatherData(location, subjectWeather, mocks.weatherAjax$);
        }
      },
      (error) =>
        subjectError.next({
          ...genError(ErrorCode.Location),
          ...{ details: error },
        })
    );

    getWeatherData().subscribe(
      (data) => data && subjectLoadingWeather.next(false),
      (error) =>
        subjectError.next({
          ...genError(ErrorCode.Weather),
          ...{ details: error },
        })
    );

    getSegments().subscribe(
      (segments) => {
        segments && subjectLoadingStrava.next(false);
        subjectMustLogin.next(false);
      },
      () => subjectMustLogin.next(true)
    );

    /* Try to load data */
    loadLocation(subjectLocation, mocks.getPositionFn);

    loadStravaData({
      stravaToken,
      subjectSegments,
      localDetailedSegmentsMock: mocks.localDetailedSegments,
      newDetailedSegmentsMock$: mocks && mocks.newDetailedSegments$,
    });
  }

  const getSegments = () => subjectSegments.asObservable();

  const getSelectedSegment = () => subjectSelectedSegment.asObservable();

  const getLocation = () => subjectLocation.asObservable();

  const getWeatherData = () => subjectWeather.asObservable();

  const getWindAngle = () => subjectWindAngle.asObservable();

  const getMustLogin = () => subjectMustLogin.asObservable();

  const getLoading = () => loading$;

  const getError = () => error$;

  function setSelectedSegment(id: number) {
    const segments = subjectSegments.getValue() || [];
    const filteredSegments = segments.filter((s) => s.id === id);

    const currentSelectedId = subjectSelectedSegment.getValue();
    const selectingSameSegment =
      currentSelectedId && currentSelectedId.id === id;

    if (id === -1 || selectingSameSegment) {
      subjectSelectedSegment.next(null);
      return;
    }

    if (filteredSegments.length === 1) {
      getSegments()
        .pipe(
          map((listSegments) => listSegments || []),
          map((listSegments) => listSegments.find((s) => s.id === id))
        )
        .subscribe((s) => s && subjectSelectedSegment.next(s));
    }
  }

  function setWindAngle(angle: number) {
    subjectWindAngle.next(angle);
  }

  return {
    init,
    getSegments,
    setSelectedSegment,
    getSelectedSegment,
    getLocation,
    getMustLogin,
    getLoading,
    getError,
    getWeatherData,
    getWindAngle,
    setWindAngle,
  };
}

const createStore = () => store();

export { createStore };
