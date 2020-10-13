import { Observable, BehaviorSubject } from "rxjs";
import { WeatherEntry, Segment } from "../types";

export interface GetPosFunction {
  (
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ): void;
}

export interface LoadStravaParams {
  stravaToken: string | null;
  subjectSegments: BehaviorSubject<Segment[]>;
  subjectMustLogin: BehaviorSubject<boolean>;
  localDetailedSegmentsMock?: Segment[];
  newDetailedSegmentsMock$?: Observable<Segment[]>;
}

export interface InitMockFunctions {
  getPositionFn: GetPosFunction | null;
  weatherAjax$: Observable<WeatherEntry[]> | null;
}
