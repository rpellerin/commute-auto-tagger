import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivityMap from "./ActivityMap";
import { hydrateActivity, Zone } from "./services/activity";
import { Activity, ActivityEnhanced } from "./services/types/activity";
import CommuteTagAndAction from "./CommuteTagAndAction";
import FiltersBar from "./FiltersBar";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
  dateStyle: "full",
  hourCycle: "h23",
});

const Activities = ({ accessToken, zones, checkedDays }: { accessToken: string, zones: Zone[], checkedDays: number[] }) => {
  const [_activities, setActivities]: [Activity[], Function] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const stopInfiniteScroll = useRef(false);

  const nonCommuteActivitiesFromLocalStorage =
    window.localStorage.getItem("nonCommuteActivities");
  const defaultNonCommuteActivities: string[] = nonCommuteActivitiesFromLocalStorage
    ? JSON.parse(nonCommuteActivitiesFromLocalStorage)
    : [];
  const [nonCommuteActivities, setNonCommuteActivities] = useState(defaultNonCommuteActivities);

  useEffect(() => {
    window.localStorage.setItem(
      "nonCommuteActivities",
      JSON.stringify(nonCommuteActivities)
    );
  }, [nonCommuteActivities]);

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
                      setNonCommuteActivities={setNonCommuteActivities}
                      nonCommuteActivities={nonCommuteActivities}
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
