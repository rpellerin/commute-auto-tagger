export const getCurrentAccount = ({ accessToken }) =>
  fetch("https://www.strava.com/api/v3/athlete", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json());
