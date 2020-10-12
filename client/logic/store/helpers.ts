import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { defaultLocation } from "./location";
import { Coordinate, StoreError, WeatherEntry, Segment } from "../types";

function genErrorObservables(): [
  BehaviorSubject<StoreError>,
  Observable<StoreError>
] {
  const subjectError = new BehaviorSubject<StoreError>({
    msg: "",
    error: false,
  });
  const error$: Observable<StoreError> = subjectError.asObservable();
  return [subjectError, error$];
}

function genLocationObservables(): [
  BehaviorSubject<Coordinate>,
  Observable<Coordinate>
] {
  const subjectLocation = new BehaviorSubject<Coordinate>(defaultLocation);
  const location$: Observable<Coordinate> = subjectLocation.asObservable();
  return [subjectLocation, location$];
}

function genWeatherObservables(): [
  BehaviorSubject<WeatherEntry[]>,
  Observable<WeatherEntry[]>
] {
  const subjectWeather = new BehaviorSubject<WeatherEntry[]>([]);
  const weather$: Observable<WeatherEntry[]> = subjectWeather.asObservable();
  return [subjectWeather, weather$];
}

function genStravaObservables(): [
  BehaviorSubject<Segment[]>,
  Observable<Segment[]>,
  BehaviorSubject<Segment[]>,
  Observable<Segment[]>
] {
  const subjectSegments = new BehaviorSubject<Segment[]>([]);
  const segments$: Observable<Segment[]> = subjectSegments.asObservable();
  const subjectSelectedSegment = new BehaviorSubject<Segment[]>([]);
  const selectedSegment$: Observable<
    Segment[]
  > = subjectSelectedSegment.asObservable();
  return [subjectSegments, segments$, subjectSelectedSegment, selectedSegment$];
}

function genLoadingObservables(): [
  BehaviorSubject<boolean>,
  Observable<boolean>,
  BehaviorSubject<boolean>,
  Observable<boolean>
] {
  const subjectLoadingStrava = new BehaviorSubject<boolean>(true);
  const loadingStrava$: Observable<boolean> = subjectLoadingStrava.asObservable();

  const subjectLoadingWeather = new BehaviorSubject<boolean>(true);
  const loadingWeather$: Observable<boolean> = subjectLoadingWeather.asObservable();
  return [
    subjectLoadingStrava,
    loadingStrava$,
    subjectLoadingWeather,
    loadingWeather$,
  ];
}

export {
  genErrorObservables,
  genLocationObservables,
  genWeatherObservables,
  genStravaObservables,
  genLoadingObservables,
};
