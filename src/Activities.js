import { useEffect, useState } from "react";
import * as geolib from "geolib";
import Map from "./Map";

const isCommuteRide = (
  activity,
  days = [1, 2, 3, 4, 5],
  zones = [{ lat: 52.491615, lng: 13.387418 }]
) => {
  const startDate = new Date(activity.start_date);
  const isBikeRide = activity.type === "Ride";
  const matchesDays = days.includes(startDate.getUTCDay());
  const isInZones = zones.some(
    (zone) =>
      (activity.start_latlng.length > 0 &&
        geolib.isPointWithinRadius(
          { latitude: zone.lat, longitude: zone.lng },
          {
            latitude: activity.start_latlng[0],
            longitude: activity.start_latlng[1],
          },
          250 // 250 meters
        )) ||
      (activity.end_latlng.length > 0 &&
        geolib.isPointWithinRadius(
          { latitude: zone.lat, longitude: zone.lng },
          {
            latitude: activity.end_latlng[0],
            longitude: activity.end_latlng[1],
          },
          250
        ))
  );
  return matchesDays && isBikeRide && isInZones;
};

const CommuteOrNotTag = ({ activity }) => {
  const isCommute = isCommuteRide(activity);
  const children = isCommute ? "COMMUTE" : "Not a commute";

  const style = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "orange",
  };
  if (isCommute) {
    style.backgroundColor = "green";
  }
  return <span style={style}>{children}</span>;
};

const Activities = ({ accessToken }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=100&page=1",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Activities", data);
        setActivities(data.filter((activity) => !activity.commute));
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, []);
  return loading ? (
    <div>Loading ...</div>
  ) : (
    <ul>
      {activities.map((activity) => {
        const startDate = new Date(activity.start_date);
        return (
          <li key={activity.id}>
            <h2>{activity.name}</h2>
            <div>
              Day of week:{" "}
              {startDate.toLocaleDateString(undefined, { weekday: "long" })}{" "}
              <CommuteOrNotTag activity={activity} />
              <Map activity={activity} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Activities;
