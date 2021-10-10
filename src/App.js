import { useEffect, useState } from "react";
import Activities from "./Activities";
import "./App.css";
import { loginWithCode, loginWithRefreshToken } from "./services/login";

const Login = ({ setAccessToken }) => {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams?.get("code");
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (code) {
      loginWithCode(code).then((accessToken) => setAccessToken(accessToken));
    } else if (refreshToken) {
      loginWithRefreshToken(refreshToken).then((accessToken) =>
        setAccessToken(accessToken)
      );
    }
  }, []);

  return (
    <a href="https://www.strava.com/oauth/authorize?client_id=72614&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=auto&scope=read,activity:read_all,activity:write">
      Login with Strava
    </a>
  );
};

const useCurrentUser = () => {
  const [accessToken, setAccessToken] = useState(
    window.localStorage.getItem("accessToken")
  );
  const accessTokenExpiresAt = window.localStorage.getItem(
    "accessTokenExpiresAt"
  );
  const isLoggedIn =
    accessToken &&
    accessTokenExpiresAt &&
    new Date(parseInt(accessTokenExpiresAt, 10) * 1000) > new Date();
  return { isLoggedIn, accessToken, setAccessToken };
};

function App() {
  const { isLoggedIn, accessToken, setAccessToken } = useCurrentUser();
  return (
    <div>
      <header>
        <h1>Commute Auto Tagger</h1>
      </header>
      <main>
        {isLoggedIn ? (
          <Activities accessToken={accessToken} />
        ) : (
          <Login setAccessToken={setAccessToken} />
        )}
      </main>
    </div>
  );
}

export default App;
