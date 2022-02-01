import * as geolib from "geolib";
import { Activity } from "./types/activity";

export type Zone =  {
  lat: number;
  lng: number;
  radius: number
}

export const toggleCommuteMark = ({ activity, accessToken } : {activity: Activity, accessToken: string}) =>
  fetch(`https://www.strava.com/api/v3/activities/${activity.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ commute: !activity.commute }),
  }).then((response) => response.json());

export const isPotentialCommuteRide = (activity: Activity, zones: Zone[], checkedDays: number[]) => {
  if (activity.commute) return false;
  const startDate = new Date(activity.start_date);
  const isBikeRide = activity.type === "Ride";
  if (!isBikeRide) return false;
  const matchesDays = checkedDays.includes(startDate.getUTCDay());
  const isInZones = zones.some(
    (zone) =>
      (activity.start_latlng.length > 0 &&
        geolib.isPointWithinRadius(
          { latitude: zone.lat, longitude: zone.lng },
          {
            latitude: activity.start_latlng[0],
            longitude: activity.start_latlng[1],
          },
          zone.radius // meters
        )) ||
      (activity.end_latlng.length > 0 &&
        geolib.isPointWithinRadius(
          { latitude: zone.lat, longitude: zone.lng },
          {
            latitude: activity.end_latlng[0],
            longitude: activity.end_latlng[1],
          },
          zone.radius // meters
        ))
  );
  return matchesDays && isInZones;
};

export const hydrateActivity = (activity: Activity, zones: Zone[], checkedDays: number[]) => ({
  ...activity,
  potentialCommute: isPotentialCommuteRide(activity, zones, checkedDays),
});
