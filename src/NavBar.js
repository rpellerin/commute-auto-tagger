import { useEffect, useState } from "react";
import { getCurrentAccount } from "./services/account";

const NavBar = ({ isLoggedIn, accessToken, onOpenCriteria }) => {
  const [account, setAccount] = useState();
  useEffect(() => {
    getCurrentAccount({ accessToken }).then((account) => {
      setAccount(account);
    });
  }, [accessToken]);

  const onLogOut = () => {
    localStorage.clear();
    window.location.search = "";
  };
  if (!account) return null;
  return (
    <header>
      <h1>Commute Auto Tagger</h1>
      {isLoggedIn && (
        <>
          <button onClick={onOpenCriteria}>Configure my critera</button>
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
          <button onClick={onLogOut}>Log out</button>
        </>
      )}
    </header>
  );
};

export default NavBar;
