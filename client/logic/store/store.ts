import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Segment } from "../types";
import { loadStravaData } from "./strava";

const subjectSegments = new BehaviorSubject<Segment[]>([]);
const segments$: Observable<Segment[]> = subjectSegments.asObservable();

const subjectSelectedSegment = new BehaviorSubject<Segment[]>([]);
const selectedSegment$: Observable<
  Segment[]
> = subjectSelectedSegment.asObservable();

const subjectMustLogin = new BehaviorSubject<boolean>(false);
const mustLogin$: Observable<boolean> = subjectMustLogin.asObservable();

const subjectLoading = new BehaviorSubject<boolean>(true);
const loading$: Observable<boolean> = subjectLoading.asObservable();

const store = (function () {
  function init(stravaToken: string | null) {
    loadStravaData(stravaToken, subjectSegments, subjectMustLogin);
    segments$.subscribe({
      next: () => subjectLoading.next(true),
      complete: () => subjectLoading.next(false),
    });
  }

  const getSegments = () => segments$;

  const getSelectedSegment = () => selectedSegment$;

  const getMustLogin = () => mustLogin$;

  const getLoading = () => loading$;

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
    getMustLogin,
    getLoading,
  };
})();

export default store;
