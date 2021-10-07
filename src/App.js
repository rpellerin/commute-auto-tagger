import { useEffect } from "react";
import Activities from "./Activities";
import "./App.css";

const Login = () => {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams?.get("code");
    if (code) {
      const data = {
        client_id: 72614,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      };
      fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) throw new Error(data.message);
          console.log("Success:", data);
          window.localStorage.setItem("userId", data.athlete.id);
          window.localStorage.setItem("refreshToken", data.refresh_token);
          window.localStorage.setItem("accessToken", data.access_token);
          window.localStorage.setItem("accessTokenExpiresAt", data.expires_at);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <a href="https://www.strava.com/oauth/authorize?client_id=72614&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=auto&scope=read,activity:read_all,activity:write">
      Login with Strava
    </a>
  );
};

const useCurrentUser = () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const accessTokenExpiresAt = window.localStorage.getItem(
    "accessTokenExpiresAt"
  );
  const isLoggedIn =
    accessToken &&
    accessTokenExpiresAt &&
    new Date(parseInt(accessTokenExpiresAt, 10) * 1000) > new Date();
  return { isLoggedIn, currentUser: { accessToken } };
};

function App() {
  const { isLoggedIn, currentUser } = useCurrentUser();
  return (
    <div>
      <header>
        <h1>Commute Auto Tagger</h1>
        <main>
          {isLoggedIn ? (
            <Activities accessToken={currentUser.accessToken} />
          ) : (
            <Login />
          )}
        </main>
      </header>
    </div>
  );
}

export default App;
