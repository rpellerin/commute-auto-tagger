# Strava Commute Auto Tagger

[![Node.js CI](https://github.com/rpellerin/commute-auto-tagger/actions/workflows/tests-and-deploy.yml/badge.svg?branch=master)](https://github.com/rpellerin/commute-auto-tagger/actions/workflows/tests-and-deploy.yml)

https://strava-commute-auto-tagger.herokuapp.com/

# How To

## Develop locally

```shell
npm install
npx playwright install
NODE_ENV=development REACT_APP_CLIENT_ID=123 CLIENT_SECRET=abc456 npm run server
```

## Push to production

Pushing to the GitHub `master` branch deploys to production, through GitHub actions.

```shell
git push origin master
```

Alternatively, to deploy a specific branch, push it to Heroku:

```shell
git remote add heroku https://git.heroku.com/my-repo.git # To do once
git push heroku my-branch:master
```

## Launching tests

You can launch different types of tests:

- Unit: `npm run test:unit`
- End-to-end: `npm run test:integration:headed`

To launch the integration tests, you need not launch the Express server in a separate terminal. If it is already launched, it will be reused, otherwise a new instance will be spun up for the duration of the tests.

## TODO

- [x] Disable button while making a PUT call to Strava
- [x] Add top bar with account currently logged in
- [x] Allow to specify multiple zones and save them accross refreshes (localStorage)
- [x] Allow lat/lng search through https://nominatim.org/
- [x] Do not save uuid in local storage.
- [x] Recenter the map when searching for a place.
- [x] Allow to specify days and save them accross refreshes (localStorage)
- [x] Clean components
- [x] Modal prevent scrolling
- [x] Build and deploy the frontend on Heroku manually
- [x] Add backend that sends the client secrets to Strava
- [x] Build and deploy the frontend AND the backend on Heroku manually
- [x] Deactivate cors in production
- [x] Add Dependabot
- [x] [Enable auto merge of Dependabot pull requests](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/automating-dependabot-with-github-actions#enable-auto-merge-on-a-pull-request)
- [x] Test the app with Jest-Puppeteer
- [x] Store in localStorage which filters are checked (potential commute, commute, non commute) + add test
- [x] Add button logout which clears LocalStorage + add test
- [x] Automatically deploy the backend and the frontend on Heroku on every push to master through Github Actions
- [X] Only display activities of type "Ride"
- [ ] Do not trigger "infinite scroll" loading of activities when all filters are unchecked
- [ ] Capability to discard a potential commute so that it stops showing up as a potential commute. To be done through the localStorage.
- [ ] In the nav bar, add buttons "Import/export my data", to download the content of the localStorage as json, or to import a JSON in the localStorage.
- [ ] Button "mark all potential commutes as commutes"
- [ ] Add a button "History" in the nav bar, through which the user sees their last 100 actions. So that they can undo them in case of misclick.
- [ ] Rename the project's name: omit the "auto" part. "The Strava Commuter"?
- [ ] Buy a domain, add favicon, bind the domain to Heroku
- [ ] Mobile friendly CSS
- [ ] Heatmap(s) (animated?)
- [ ] Eject the React app when https://github.com/pmmmwh/react-refresh-webpack-plugin is released as stable
- [ ] Migrate the codebase to Typescript
