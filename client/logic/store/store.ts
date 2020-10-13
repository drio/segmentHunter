import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { InitMockFunctions } from "./types";
import { Coordinate } from "../types";
import { loadStravaData } from "./strava";
import { loadLocation } from "./location";
import { loadWeatherData } from "./weather";
import {
  genErrorObservables,
  genLocationObservables,
  genWeatherObservables,
  genStravaObservables,
  genLoadingObservables,
} from "./helpers";

const store = (function () {
  const [subjectError, error$] = genErrorObservables();
  const [subjectLocation, location$] = genLocationObservables();
  const [subjectWeather, weather$] = genWeatherObservables();
  const [
    subjectSegments,
    segments$,
    subjectSelectedSegment,
    selectedSegment$,
  ] = genStravaObservables();
  const [
    subjectLoadingStrava,
    loadingStrava$,
    subjectLoadingWeather,
    loadingWeather$,
  ] = genLoadingObservables();

  const loading$ = combineLatest([loadingWeather$, loadingStrava$]).pipe(
    map(([lweather, lstrava]) => lweather || lstrava)
  );

  const subjectMustLogin = new BehaviorSubject<boolean>(false);
  const mustLogin$: Observable<boolean> = subjectMustLogin.asObservable();

  const subjectWindAngle = new BehaviorSubject<number>(0);
  const windAngle$: Observable<number> = subjectWindAngle.asObservable();

  function init(stravaToken: string | null, mocks?: InitMockFunctions | null) {
    loadLocation(
      subjectLocation,
      subjectError,
      (mocks && mocks.getPositionFn) || null
    );

    location$.subscribe(
      (location: Coordinate) => {
        loadWeatherData(
          location,
          subjectWeather,
          subjectError,
          (mocks && mocks.weatherAjax$) || null
        );
        //loadStravaData(stravaToken, subjectSegments, subjectMustLogin);
      },
      () => console.log("Using default coordinates")
    );

    /*
    weather$.subscribe(
      () => subjectLoadingWeather.next(true),
      (error) => console.log(error), // TODO
      () => subjectLoadingWeather.next(false)
    );

    segments$.subscribe(
      () => subjectLoadingStrava.next(false),
      (error) => console.log(error) // TODO
    );
		*/
  }

  const getSegments = () => segments$;

  const getSelectedSegment = () => selectedSegment$;

  const getMustLogin = () => mustLogin$;

  const getLoading = () => loading$;

  const getError = () => error$;

  const getLocation = () => location$;

  const getWeatherData = () => weather$;

  const getWindAngle = () => windAngle$;

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
})();

export default store;
