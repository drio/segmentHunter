import { ajax } from "rxjs/ajax";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, mergeMap, filter, reduce } from "rxjs/operators";
import { Segment } from "../types";
import createHttpObservable from "./utils";

const LOCAL_KEY_SEGMENTS = "segment_hunter_segments";
const STRAVA_API_URL = "https://www.strava.com/api/v3/segments";

const genStravaRequestHeaders = (token: string | null) => ({
  accept: "application/json",
  authorization: `Bearer ${token}`,
});

function getFromLocalStorage(): Segment[] {
  const storageResult = localStorage.getItem(LOCAL_KEY_SEGMENTS) || "[]";
  return JSON.parse(storageResult);
}

function saveSegments(segments: Segment[]): void {
  localStorage.setItem(LOCAL_KEY_SEGMENTS, JSON.stringify(segments));
}

function genSSObservable(stravaToken: string): Observable<Segment> {
  return createHttpObservable(`${STRAVA_API_URL}/starred`, stravaToken).pipe(
    mergeMap((starredSegments: Segment[]) => from(starredSegments))
  );
  /* Stream of all segments (summary version) that the user has starred. */
}

function genNewDetailedObservable(
  starredSummarySegments$: Observable<Segment>,
  localDetailedSegmentIDs: number[],
  stravaToken: string
): Observable<Segment[]> {
  return starredSummarySegments$
    .pipe(
      filter((s) => !localDetailedSegmentIDs.includes(s.id)),
      mergeMap((segment) =>
        ajax({
          url: `${STRAVA_API_URL}/${segment.id}`,
          headers: genStravaRequestHeaders(stravaToken),
        })
      )
    ) /* stream of ajax requests to get the detailed segments that we don't have locally */
    .pipe(
      map((json) => json.response),
      reduce(
        (listSegments: Segment[], segment: Segment) => [
          ...listSegments,
          segment,
        ],
        []
      )
    ); /* A single value with the list of detailed segments that we are missing locally */
}

interface LoadStravaParams {
  stravaToken: string | null;
  subjectSegments: BehaviorSubject<Segment[]>;
  subjectMustLogin: BehaviorSubject<boolean>;
  localDetailedSegmentMock?: Segment[];
  newDetailedSegmentsMock$?: Observable<Segment[]>;
}

function loadStravaData({
  stravaToken,
  subjectSegments,
  subjectMustLogin,
  localDetailedSegmentMock,
  newDetailedSegmentsMock$,
}: LoadStravaParams): void {
  const inTheBrowser = typeof window !== "undefined";
  if (!inTheBrowser) return;

  if (!stravaToken) {
    subjectMustLogin.next(true);
    return;
  }

  const starredSummarySegments$ = genSSObservable(stravaToken);
  const localDetailedSegments = getFromLocalStorage();
  const localDetailedSegmentIDs = localDetailedSegments.map((s) => s.id);

  const newDetailedSegments$ = genNewDetailedObservable(
    starredSummarySegments$,
    localDetailedSegmentIDs,
    stravaToken
  );

  /* Get new starred segments and merge them to the list we already have locally */
  newDetailedSegments$.subscribe(
    (listNewDetailedSegments: Segment[]) => {
      const detailedSegments = [
        ...listNewDetailedSegments,
        ...localDetailedSegments,
      ];
      saveSegments(detailedSegments);
      subjectSegments.next(detailedSegments);
      subjectMustLogin.next(false);
    },
    (err) => {
      console.log(err);
      subjectMustLogin.next(true);
    }
  );
}

export { loadStravaData, genStravaRequestHeaders };
