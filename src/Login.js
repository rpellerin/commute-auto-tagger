import { useEffect } from "react";
import { loginWithCode, loginWithRefreshToken } from "./services/login";
import { ReactComponent as ConnectWithStrava } from "./images/btn_strava_connectwith_orange.svg";

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
    <div className="text-center">
      <a
        href={`https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}&approval_prompt=auto&scope=read,activity:read_all,activity:write`}
      >
        <ConnectWithStrava />
      </a>
    </div>
  );
};

export default Login;
