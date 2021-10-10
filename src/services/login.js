const CLIENT_ID = 72614;

export const loginWithCode = (code) =>
  fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
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
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

export const loginWithRefreshToken = (refresh_token) =>
  fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
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
