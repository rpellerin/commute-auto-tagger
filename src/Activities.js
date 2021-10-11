import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map from "./Map";
import { hydateActivity, toggleCommuteMark } from "./services/activity";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "full",
  hourCycle: "h23",
});

const CommuteTagAndAction = ({ activity, accessToken, onEditActivity }) => {
  const children = activity.commute
    ? "Marked as commute "
    : activity.potentialCommute
    ? "POTENTIAL COMMUTE"
    : "Not a commute";

  const style = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "orange",
    display: "inline-block",
    fontFamily: "sans-serif",
  };
  if (activity.potentialCommute) {
    style.backgroundColor = "green";
    style.color = "white";
    style.fontWeight = "bold";
  }

  return (
    <>
      <div style={style}>{children}</div>
      <div>
        <button
          onClick={() =>
            toggleCommuteMark({ activity, accessToken }).then((activity) =>
              onEditActivity({ commute: activity.commute })
            )
          }
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
}) => {
  const [checkedFilters, setCheckeFilters] = useState(filters);

  useEffect(() => {
    let observer;

    let options = {
      threshold: 1.0,
    };
    const lastItem = document.querySelector("ul li:last-child");
    if (!lastItem || stopInfiniteScroll) return () => null;
    const callback = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadNextPage();
      }
    };

    observer = new IntersectionObserver(callback, options);
    observer.observe(lastItem);
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
    </>
  );
};

const Activities = ({ accessToken }) => {
  const [_activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const stopInfiniteScroll = useRef(false);

  const loadNextPage = useCallback(() => {
    setLoading(true);
    setCurrentPage((page) => page + 1);
  }, []);

  useEffect(() => {
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
        if (activities.length === 0) stopInfiniteScroll.current = true;
        setActivities((oldActivities) => [...oldActivities, ...activities]);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, [accessToken, currentPage]);

  const hydratedActivities = useMemo(
    () => _activities.map(hydateActivity),
    [_activities]
  );
  return (
    <Filters
      activities={hydratedActivities}
      loadNextPage={loadNextPage}
      stopInfiniteScroll={stopInfiniteScroll.current}
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
                  <Map activity={activity} />
                </li>
              );
            })}
          </ul>
          {loading ? <div>Loading ...</div> : null}
        </>
      )}
    </Filters>
  );
};

export default Activities;
