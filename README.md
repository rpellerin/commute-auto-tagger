# Strava Commute Auto Tagger

# How To

```shell
npm install
REACT_APP_CLIENT_ID=123 npm run start
CLIENT_SECRET=abc456 node src/server/stravaGetAccessToken.js
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
- [ ] Automatically deploy the backend and the frontend on Heroku on every push to master through Github Actions
- [ ] Store in localStorage which filters are checked (potential commute, commute, non commute)
- [ ] Add button logout
- [ ] Test the app with Jest-Puppeteer
- [ ] Mobile friendly CSS
- [ ] Buy a domain
