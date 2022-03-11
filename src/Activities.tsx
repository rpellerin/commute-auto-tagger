import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivityMap from "./ActivityMap";
import { hydrateActivity, toggleCommuteMark, Zone } from "./services/activity";
import { Activity, ActivityEnhanced } from "./services/types/activity";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "full",
  hourCycle: "h23",
});

const CommuteTagAndAction = ({ activity, accessToken, onEditActivity }: { activity: ActivityEnhanced, accessToken: string, onEditActivity: Function }) => {
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);

  const children = activity.commute
    ? "Marked as commute "
    : activity.potentialCommute
      ? "POTENTIAL COMMUTE"
      : null;

  return (
    <>
      {children && (
        <div
          className={`commute-tag ${activity.potentialCommute ? "potential-commute" : ""
            }`}
        >
          {children}
        </div>
      )}
      <div>
        <button
          disabled={actionButtonDisabled}
          onClick={() => {
            setActionButtonDisabled(true);
            toggleCommuteMark({ activity, accessToken }).then((activity) => {
              setActionButtonDisabled(false);
              onEditActivity({ commute: activity.commute });
            });
          }}
        >
          {activity.commute ? "Unmark" : "Mark"} as commute ride
        </button>
      </div>
    </>
  );
};

type Filters = {
  "Potential commute"?: Function
  Commute?: Function
  "Non commute"?: Function
}

const filters: Filters = {
  "Potential commute": (activity: ActivityEnhanced) => activity.potentialCommute,
  Commute: (activity: ActivityEnhanced) => activity.commute,
  "Non commute": (activity: ActivityEnhanced) => !activity.commute,
};

const checkedFiltersFromLocalStorage =
  window.localStorage.getItem("checkedFilters");
const defaultFiltersState = checkedFiltersFromLocalStorage
  ? JSON.parse(checkedFiltersFromLocalStorage).reduce(
    (acc: Object, filterName: string) => ({ ...acc, [filterName]: (filters as any)[filterName] }),
    {}
  )
  : filters;

const FiltersBar = ({
  children,
  activities,
  loadNextPage,
  stopInfiniteScroll,
  loading,
}: { children: any, activities: ActivityEnhanced[], loadNextPage: Function, stopInfiniteScroll: boolean, loading: boolean }) => {
  const [checkedFilters, setCheckeFilters] = useState(defaultFiltersState);
  const bottomDiv = useRef();
  useEffect(() => {
    if (stopInfiniteScroll || activities.length === 0) return () => null;
    let observer: any;

    let options = {
      threshold: 1.0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadNextPage();
      }
    };

    observer = new IntersectionObserver(callback, options);
    observer.observe(bottomDiv.current);
    return () => observer.disconnect();
  }, [checkedFilters, activities, loadNextPage, stopInfiniteScroll]);

  useEffect(() => {
    window.localStorage.setItem(
      "checkedFilters",
      JSON.stringify(Object.keys(checkedFilters))
    );
  }, [checkedFilters]);

  return (
    <>
      <div id="filters">
        {Object.entries(filters).map(([labelString, fn]) => (
          <label key={labelString}>
            {`${labelString} `}
            <input
              type="checkbox"
              checked={!!checkedFilters[labelString]}
              onChange={() =>
                setCheckeFilters((checkedFilters: any) => {
                  const newCheckedFilters = { ...checkedFilters };
                  if (checkedFilters[labelString])
                    delete newCheckedFilters[labelString];
                  else newCheckedFilters[labelString] = fn;
                  return newCheckedFilters;
                })
              }
            />
          </label>
        ))}
      </div>
      {children(
        activities.filter((activity) =>
          Object.values(checkedFilters).reduce(
            (acc: boolean, fn: any) => acc || fn(activity),
            false
          )
        )
      )}
      <div ref={bottomDiv as any}>
        {loading ? "Loading..." : "No more activities to display"}
      </div>
    </>
  );
};

const Activities = ({ accessToken, zones, checkedDays }: { accessToken: string, zones: Zone[], checkedDays: number[] }) => {
  const [_activities, setActivities]: [Activity[], Function] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const stopInfiniteScroll = useRef(false);

  const loadNextPage = useCallback(() => {
    setLoading(true);
    setCurrentPage((page) => page + 1);
  }, []);

  useEffect(() => {
    console.log(`Fetching page ${currentPage}`);
    fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=100&page=${currentPage}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((activities) => {
        if (activities.errors) throw new Error(activities.message);
        if (activities.length === 0) stopInfiniteScroll.current = true;
        const rideActivities = activities.filter((activity: Activity) => activity.type === "Ride")
        setActivities((oldActivities: Activity[]) => [...oldActivities, ...rideActivities]);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, [accessToken, currentPage]);

  const hydratedActivities: ActivityEnhanced[] = useMemo(
    () =>
      _activities.map((activity) =>
        hydrateActivity(activity, zones, checkedDays)
      ),
    [_activities, zones, checkedDays]
  );
  return (
    <FiltersBar
      activities={hydratedActivities}
      loadNextPage={loadNextPage}
      stopInfiniteScroll={stopInfiniteScroll.current}
      loading={loading}
    >
      {(filteredActivities: ActivityEnhanced[]) => (
        <>
          <ul>
            {filteredActivities.map((activity) => {
              const startDate = new Date(activity.start_date);
              return (
                <li key={activity.id}>
                  <div>
                    <h2>
                      <a
                        href={`https://www.strava.com/activities/${activity.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {activity.name}
                      </a>
                    </h2>
                    <div>
                      <time dateTime={startDate.toISOString()}>
                        {dateTimeFormat.format(startDate)}
                      </time>
                    </div>
                    <div>
                      Distance: {(activity.distance / 1000).toFixed(2)} km
                    </div>
                    <CommuteTagAndAction
                      activity={activity}
                      accessToken={accessToken}
                      onEditActivity={(editedActivity: ActivityEnhanced) =>
                        setActivities((activities: Activity[]) =>
                          activities.map((_activity) =>
                            _activity.id === activity.id
                              ? { ..._activity, ...editedActivity }
                              : _activity
                          )
                        )
                      }
                    />
                  </div>
                  <ActivityMap activity={activity} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </FiltersBar>
  );
};

export default Activities;
