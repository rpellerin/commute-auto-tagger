import { useEffect, useState } from "react/cjs/react.development";
import { getCurrentAccount } from "./services/account";

const NavBar = ({ isLoggedIn, accessToken }) => {
  const [account, setAccount] = useState();
  useEffect(() => {
    getCurrentAccount({ accessToken }).then((account) => {
      console.log({ account });
      setAccount(account);
    });
  }, [accessToken]);
  if (!account) return null;
  return (
    <header>
      <h1>Commute Auto Tagger</h1>
      {isLoggedIn && (
        <>
          <button>Configure my critera</button>
          <a
            href={`https://www.strava.com/athletes/${account.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {account.firstname} {account.lastname}
          </a>
          <a
            href={`https://www.strava.com/athletes/${account.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={account.profile} alt="Profile" />
          </a>
        </>
      )}
    </header>
  );
};

export default NavBar;
