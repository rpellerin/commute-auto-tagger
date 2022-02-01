export const getCurrentAccount = ({ accessToken }: { accessToken: string}): Promise<JSON> =>
  fetch("https://www.strava.com/api/v3/athlete", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json());
