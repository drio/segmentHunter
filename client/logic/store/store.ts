import { Observable, BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Segment } from "../types";
import { pick } from "lodash";
import { createHttpObservable } from "../utils";

const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";
const SEGMENT_KEYS = [
  "id",
  "start_latitude",
  "start_longitude",
  "end_latitude",
  "end_longitude",
  "name",
  "map",
  "distance",
];

const store = (function () {
  const subjectSegments = new BehaviorSubject<Segment[]>([]);
  const segments$: Observable<Segment[]> = subjectSegments.asObservable();

  const subjectSelectedSegment = new BehaviorSubject<Segment[]>([]);
  const selectedSegment$: Observable<
    Segment[]
  > = subjectSelectedSegment.asObservable();

  function init(stravaToken: string | null) {
    const inTheBrowser = typeof window !== "undefined";
    if (!inTheBrowser) return;

    if (stravaToken) {
      const http$ = createHttpObservable(
        `${STRAVA_API_URL}/starred`,
        stravaToken
      );

      http$.subscribe((segments) => subjectSegments.next(segments));
    }
  }

  function getSegments() {
    return segments$;
  }

  function getSelectedSegment() {
    return selectedSegment$;
  }

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
  };
})();

export default store;
