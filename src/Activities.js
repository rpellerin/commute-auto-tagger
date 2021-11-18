import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivityMap from "./ActivityMap";
import { hydrateActivity, toggleCommuteMark } from "./services/activity";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "full",
  hourCycle: "h23",
});

const CommuteTagAndAction = ({ activity, accessToken, onEditActivity }) => {
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
          className={`commute-tag ${
            activity.potentialCommute ? "potential-commute" : ""
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

const filters = {
  "Potential commute": (activity) => activity.potentialCommute,
  Commute: (activity) => activity.commute,
  "Non commute": (activity) => !activity.commute,
};

const Filters = ({
  children,
  activities,
  loadNextPage,
  stopInfiniteScroll,
  loading,
}) => {
  const [checkedFilters, setCheckeFilters] = useState(filters);
  const bottomDiv = useRef();
  useEffect(() => {
    if (stopInfiniteScroll || activities.length === 0) return () => null;
    let observer;

    let options = {
      threshold: 1.0,
    };

    const callback = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadNextPage();
      }
    };

    observer = new IntersectionObserver(callback, options);
    observer.observe(bottomDiv.current);
    return () => observer.disconnect();
  }, [checkedFilters, activities, loadNextPage, stopInfiniteScroll]);

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
                setCheckeFilters((checkedFilters) => ({
                  ...checkedFilters,
                  [labelString]: checkedFilters[labelString] ? undefined : fn,
                }))
              }
            />
          </label>
        ))}
      </div>
      {children(
        activities.filter((activity) =>
          Object.values(checkedFilters)
            .filter(Boolean)
            .reduce((acc, fn) => acc || fn(activity), false)
        )
      )}
      <div ref={bottomDiv}>
        {loading ? "Loading..." : "No more activities to display"}
      </div>
    </>
  );
};

const Activities = ({ accessToken, zones, checkedDays }) => {
  const [_activities, setActivities] = useState([]);
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
        console.log("Activities", activities);
        if (activities.errors) throw new Error(activities.message);
        if (activities.length === 0) stopInfiniteScroll.current = true;
        setActivities((oldActivities) => [...oldActivities, ...activities]);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, [accessToken, currentPage]);

  const hydratedActivities = useMemo(
    () =>
      _activities.map((activity) =>
        hydrateActivity(activity, zones, checkedDays)
      ),
    [_activities, zones, checkedDays]
  );
  return (
    <Filters
      activities={hydratedActivities}
      loadNextPage={loadNextPage}
      stopInfiniteScroll={stopInfiniteScroll.current}
      loading={loading}
    >
      {(filteredActivities) => (
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
                      onEditActivity={(editedActivity) =>
                        setActivities((activities) =>
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
    </Filters>
  );
};

export default Activities;
