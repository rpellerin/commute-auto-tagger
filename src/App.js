import { useState } from "react";
import Activities from "./Activities";
import NavBar from "./NavBar";
import Login from "./Login";
import CriteriaModal, { defaultZone } from "./CriteriaModal";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

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
const defaultDays = [1, 2, 3, 4, 5];

const zonesInit = (
  localStorage.getItem("zones") === null
    ? [defaultZone]
    : JSON.parse(window.localStorage.getItem("zones"))
).map((element) => ({
  ...element,
  uuid: uuidv4(),
}));
const checkedDaysInit =
  localStorage.getItem("checkedDays") === null
    ? defaultDays
    : JSON.parse(window.localStorage.getItem("checkedDays"));

const App = () => {
  const { isLoggedIn, accessToken, setAccessToken } = useCurrentUser();
  const [showCriteria, setShowCriteria] = useState(false);

  const [zones, setZones] = useState(zonesInit);
  const [checkedDays, setCheckedDays] = useState(checkedDaysInit);

  return (
    <>
      {showCriteria && (
        <CriteriaModal
          onClose={() => setShowCriteria(false)}
          zones={zones}
          setZones={setZones}
          checkedDays={checkedDays}
          setCheckedDays={setCheckedDays}
        />
      )}
      <NavBar
        onOpenCriteria={() => setShowCriteria(true)}
        isLoggedIn={isLoggedIn}
        accessToken={accessToken}
      />
      <div>
        <h3>What's this website?</h3>
        <p>
          After you connected it to your Strava, this website allows you to
          list all your Strava activities and find potential commute bike rides,
          that you may want to tag as such.
        </p>
        <h3>What's a potential commute?</h3>
        <p>
          It is a bike activity on Strava that you might have recorded during a
          commute.
        </p>
        <h3>How do we determine potential commutes?</h3>
        <p>Three criteria:</p>
        <ul>
          <li>
            A bike activity that took places on some specific days of your
            choice
          </li>
          <li>
            A bike activity that starts or ends in zones you pre-configured
          </li>
          <li>
            A bike activity that you have not tagged as a commute on Strava
          </li>
        </ul>
        <details>
          <summary>
            <h3>FAQ</h3>
          </summary>
          <h4>Where can I find the source code of this website?</h4>
          <p>
            On{" "}
            <a href="https://github.com/rpellerin/commute-auto-tagger">
              GitHub
            </a>
            .
          </p>
          <h4>What do you do with my data?</h4>
          <p>
            Nothing, your data never leaves your browser, we do not have a
            database. We have a back-end that we use to authenticate you on
            Strava, because we need to hide our Strava API application's
            credentials, therefore we cannot send it to your browser.
          </p>
        </details>
      </div>
      <main>
        {isLoggedIn ? (
          <Activities
            accessToken={accessToken}
            zones={zones}
            checkedDays={checkedDays}
          />
        ) : (
          <Login setAccessToken={setAccessToken} />
        )}
      </main>
    </>
  );
};

export default App;
