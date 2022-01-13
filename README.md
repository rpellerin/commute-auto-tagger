# Strava Commute Auto Tagger

[![Node.js CI](https://github.com/rpellerin/commute-auto-tagger/actions/workflows/tests-and-deploy.yml/badge.svg)](https://github.com/rpellerin/commute-auto-tagger/actions/workflows/node.js.yml)

https://strava-commute-auto-tagger.herokuapp.com/

# How To

## Develop locally

```shell
npm install
REACT_APP_CLIENT_ID=123 npm run start
CLIENT_SECRET=abc456 node src/server/stravaGetAccessToken.js
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
- [ ] Mobile friendly CSS
- [ ] Buy a domain & set up Heroku
- [ ] Tag all selected activities as commute.
