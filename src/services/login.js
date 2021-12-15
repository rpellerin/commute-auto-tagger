export const loginWithCode = (code) =>
  fetch("http://localhost:3001/strava-get-access-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.REACT_APP_CLIENT_ID,
      code,
      grant_type: "authorization_code",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) throw new Error(data.message);
      window.localStorage.setItem("userId", data.athlete.id);
      window.localStorage.setItem("refreshToken", data.refresh_token);
      window.localStorage.setItem("accessToken", data.access_token);
      window.localStorage.setItem("accessTokenExpiresAt", data.expires_at);
      return data.access_token;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

export const loginWithRefreshToken = (refresh_token) =>
  fetch("http://localhost:3001/strava-get-access-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.REACT_APP_CLIENT_ID,
      refresh_token,
      grant_type: "refresh_token",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) throw new Error(data.message);
      window.localStorage.setItem("refreshToken", data.refresh_token);
      window.localStorage.setItem("accessToken", data.access_token);
      window.localStorage.setItem("accessTokenExpiresAt", data.expires_at);
      return data.access_token;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
