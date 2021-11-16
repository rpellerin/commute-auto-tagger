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
- [ ] Do not save uuid in local storage.
- [ ] Recenter the map when searching for a place.
- [ ] Allow to specify days and save them accross refreshes (localStorage)
- [ ] Add backend
- [ ] Deploy on Heroku
- [ ] Clean components
- [ ] Cache activities in localStorage or IndexDB
