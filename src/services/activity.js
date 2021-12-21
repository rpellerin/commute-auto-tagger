import * as geolib from "geolib";

export const toggleCommuteMark = ({ activity, accessToken }) =>
  fetch(`https://www.strava.com/api/v3/activities/${activity.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ commute: !activity.commute }),
  }).then((response) => response.json());

export const isPotentialCommuteRide = (activity, zones, checkedDays) => {
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
          zone.radius // 250 meters
        )) ||
      (activity.end_latlng.length > 0 &&
        geolib.isPointWithinRadius(
          { latitude: zone.lat, longitude: zone.lng },
          {
            latitude: activity.end_latlng[0],
            longitude: activity.end_latlng[1],
          },
          zone.radius
        ))
  );
  return matchesDays && isInZones;
};

export const hydrateActivity = (activity, zones, checkedDays) => ({
  ...activity,
  potentialCommute: isPotentialCommuteRide(activity, zones, checkedDays),
});
