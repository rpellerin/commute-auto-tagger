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
- [ ] Add backend
- [ ] Deploy on Heroku
- [ ] Cache activities in localStorage or IndexDB
- [ ] Test the app with Jest-Puppeteer
