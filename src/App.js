import { useEffect, useState } from "react";
import Activities from "./Activities";
import NavBar from "./NavBar";
import { loginWithCode, loginWithRefreshToken } from "./services/login";
import "./App.css";

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
  }, [setAccessToken]);

  return (
    <a
      href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=auto&scope=read,activity:read_all,activity:write_all`}
    >
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

const App = () => {
  const { isLoggedIn, accessToken, setAccessToken } = useCurrentUser();
  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} accessToken={accessToken} />
      <main>
        {isLoggedIn ? (
          <Activities accessToken={accessToken} />
        ) : (
          <Login setAccessToken={setAccessToken} />
        )}
      </main>
    </>
  );
};

export default App;
