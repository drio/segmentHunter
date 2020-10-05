import { createHttpObservable } from "../utils";
import { BehaviorSubject } from "rxjs";
import { Segment } from "../types";

const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";

function loadStravaData(
  stravaToken: string | null,
  subjectSegments: BehaviorSubject<Segment[]>,
  subjectMustLogin: BehaviorSubject<boolean>
): void {
  const inTheBrowser = typeof window !== "undefined";
  if (!inTheBrowser) return;

  if (stravaToken) {
    createHttpObservable(`${STRAVA_API_URL}/starred`, stravaToken).subscribe(
      (segments) => subjectSegments.next(segments),
      () => subjectMustLogin.next(true),
      () => subjectSegments.complete()
    );
  } else {
    subjectMustLogin.next(true);
  }
}

export { loadStravaData };
