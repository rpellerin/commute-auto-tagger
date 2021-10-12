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
          <button>Set my commute criteria</button>
          <span>
            {account.firstname} {account.lastname}
          </span>
          <img src={account.profile} alt="Profile" />
        </>
      )}
    </header>
  );
};

export default NavBar;
