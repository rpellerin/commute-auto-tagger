# Strava Commute Auto Tagger

# How To

```shell
npm install
REACT_APP_CLIENT_ID=123 REACT_APP_CLIENT_SECRET=abc456 npm run start
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
- [ ] Build and deploy the frontend on Heroku manually
- [ ] Automatically build and deploy on Heroku on every push to the branch master through Github Actions
- [ ] Add backend that sends the client secrets to Strava
- [ ] Automatically deploy the backend and the frontend on Heroku on every push to master
- [ ] Store in localStorage which filters are checked (potential commute, commute, non commute)
- [ ] Test the app with Jest-Puppeteer
