exports.mockStravaAuthentication = async (page) => {
  await page.route(
    /^https:\/\/www\.strava\.com\/oauth\/authorize\?client_id=/,
    (route) => {
      route.fulfill({
        status: 301,
        headers: { Location: "http://localhost:9090/?code=FAKE_TEST" },
      });
    }
  );
};

exports.mockStravaGetAccessToken = async (page) => {
  await page.route("/strava-get-access-token", (route) => {
    route.fulfill({
      body: JSON.stringify({
        token_type: "Bearer",
        expires_at: new Date().getTime() + 21600,
        expires_in: 21600, // 6 hours
        refresh_token: "fake_refresh_token",
        access_token: "fake_access_token",
        athlete: {
          id: 0,
        },
      }),
    });
  });
};

exports.mockStravaApiAthlete = async (page) => {
  await page.route(/\/api\/v3\/athlete$/, (route) => {
    route.fulfill({
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        id: 123,
        username: "jdoe",
        firstname: "Jane",
        lastname: "Doe",
        bio: "Cyclist",
        sex: "F",
      }),
    });
  });
};

exports.mockStravaApiActivities = async (page) => {
  await page.route(/\/api\/v3\/athlete\/activities.*/, (route) => {
    route.fulfill({
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify([
        {
          athlete: { id: 123, resource_state: 1 },
          name: "Bike ride",
          distance: 52974.3,
          moving_time: 7903,
          elapsed_time: 8582,
          total_elevation_gain: 125.0,
          type: "Ride",
          workout_type: 10,
          id: 1,
          start_date: "2022-01-08T14:08:39Z",
          start_date_local: "2022-01-08T15:08:39Z",
          timezone: "(GMT+01:00) Europe/Berlin",
          utc_offset: 3600.0,
          start_latlng: [53.52934643998742, 13.835718547552824],
          end_latlng: [53.52979059703648, 13.834610376134515],
          start_latitude: 53.52934643998742,
          start_longitude: 13.834610376134515,
          achievement_count: 55,
          map: {
            id: "1",
            summary_polyline:
              "y{mjHmpiLNsG@XD@Ob@RYQEBJADBIBABTC?a@g@BAEGOe@?SEECMII?CKMEa@IYGIUG[EG_@Eq@Gk@@GDGBO@MEI@k@Gc@Ki@KADADHUoA]_AE[BBGOBEOQOGEBu@Dg@COTIDIAIKADI?L@?KF@KFBBQRGNKDKE?BTVpAPX?XNDD?FFLb@b@PHDJ?P@BTJXz@PZLlAb@lAFl@Lb@@\\DRf@n@b@R?NFL?NSh@k@JMCB[BRCMf@OEJb@YDa@CWMU_@_@ISEe@CKSUm@cAIe@Eo@IUGCQ]QQI]O]Y]ECCDQK]c@m@MGIC@?FDC?AAAFAIC]DUKiA`@M?GNYNw@JGG@MGSKOA?AD@O@C?OSUGMCA@AEWFMHEd@ALQo@AAD_@FGKKGD@Eg@EQKGI@IJITIZEFODYX_@Pa@^UPCH?HDPDB@SKO]AQKKMYM?DGBYGk@[KOMJGCGD@GUf@QLEFOd@ALJp@Vd@Jf@?HRr@FH@\\LZCNUVBCG?s@Vo@f@YF[ZQDKAB@C[GCUUISGm@Da@AOQ}@KAIUWqBA{@Ma@G{@Yi@QgAGKKi@GI?HKY?]Ku@IUIg@Ui@Am@Wg@EQCCOkAGUGc@Y_AEe@@MCOCKOUOs@K[Ca@I]MQGWOYc@_@MEY[Os@Qg@Ke@GMIKGQQYQk@Q_@W}@CSGGGBMQUM{@{Au@w@[g@QSGOE?W_@We@k@o@a@OMK[q@QKkAwAUQ_@c@_@g@_@u@DUD@@JBEHd@Ff@Zp@LHVFd@fAJLb@P`@^DHD^JXHJ\\BNCFBLVhAxAf@v@\\^Zh@^d@RZLVRRL`@PJNZ`@b@H\\b@fAd@pALt@FNRR@VD@Pr@R`@Hh@Tl@FZN\\Pn@Rd@NfATb@Nt@^fALVDP@`@FZNTHBBD@LGZ@LH`@\\nARnAFfAVx@Bb@BNDFHh@ZrATl@JLN|@Bj@VjABx@DVNJNIJQBa@DK@A?JDAf@k@P?dAm@f@ILIXA`@YLAFB?PFBFPHn@@l@DRHPPNh@dAV@NPNn@l@~AD`@Vh@ADl@j@\\JPLZ@ZQNUPMTYJG@EXOrAgAFUJO`@S\\e@@a@n@}@XHf@d@`@HVZBAACPl@DDN@DJCCV?FN?FCHQPHZ?REA?MDA?L@E",
            resource_state: 2,
          },
        },
        {
          athlete: { id: 123, resource_state: 1 },
          name: "Walk ride: Château de Méry sur Oise 🦆🏰🦆",
          distance: 5988.0,
          moving_time: 4976,
          elapsed_time: 5383,
          total_elevation_gain: 33.5,
          type: "Walk",
          id: 2,
          start_date: "2022-01-02T15:02:11Z",
          start_date_local: "2022-01-02T16:02:11Z",
          timezone: "(GMT+01:00) Europe/Paris",
          utc_offset: 3600.0,
          start_latlng: [49.0644580218941, 2.1839107386767864],
          end_latlng: [49.06476002186537, 2.184539046138525],
          location_city: null,
          location_state: null,
          location_country: null,
          start_latitude: 49.0644580218941,
          start_longitude: 2.184539046138525,
          achievement_count: 0,
          kudos_count: 6,
          comment_count: 0,
          athlete_count: 1,
          photo_count: 0,
          map: {
            id: "2",
            summary_polyline:
              "y{mjHmpiLNsG@XD@Ob@RYQEBJADBIBABTC?a@g@BAEGOe@?SEECMII?CKMEa@IYGIUG[EG_@Eq@Gk@@GDGBO@MEI@k@Gc@Ki@KADADHUoA]_AE[BBGOBEOQOGEBu@Dg@COTIDIAIKADI?L@?KF@KFBBQRGNKDKE?BTVpAPX?XNDD?FFLb@b@PHDJ?P@BTJXz@PZLlAb@lAFl@Lb@@\\DRf@n@b@R?NFL?NSh@k@JMCB[BRCMf@OEJb@YDa@CWMU_@_@ISEe@CKSUm@cAIe@Eo@IUGCQ]QQI]O]Y]ECCDQK]c@m@MGIC@?FDC?AAAFAIC]DUKiA`@M?GNYNw@JGG@MGSKOA?AD@O@C?OSUGMCA@AEWFMHEd@ALQo@AAD_@FGKKGD@Eg@EQKGI@IJITIZEFODYX_@Pa@^UPCH?HDPDB@SKO]AQKKMYM?DGBYGk@[KOMJGCGD@GUf@QLEFOd@ALJp@Vd@Jf@?HRr@FH@\\LZCNUVBCG?s@Vo@f@YF[ZQDKAB@C[GCUUISGm@Da@AOQ}@KAIUWqBA{@Ma@G{@Yi@QgAGKKi@GI?HKY?]Ku@IUIg@Ui@Am@Wg@EQCCOkAGUGc@Y_AEe@@MCOCKOUOs@K[Ca@I]MQGWOYc@_@MEY[Os@Qg@Ke@GMIKGQQYQk@Q_@W}@CSGGGBMQUM{@{Au@w@[g@QSGOE?W_@We@k@o@a@OMK[q@QKkAwAUQ_@c@_@g@_@u@DUD@@JBEHd@Ff@Zp@LHVFd@fAJLb@P`@^DHD^JXHJ\\BNCFBLVhAxAf@v@\\^Zh@^d@RZLVRRL`@PJNZ`@b@H\\b@fAd@pALt@FNRR@VD@Pr@R`@Hh@Tl@FZN\\Pn@Rd@NfATb@Nt@^fALVDP@`@FZNTHBBD@LGZ@LH`@\\nARnAFfAVx@Bb@BNDFHh@ZrATl@JLN|@Bj@VjABx@DVNJNIJQBa@DK@A?JDAf@k@P?dAm@f@ILIXA`@YLAFB?PFBFPHn@@l@DRHPPNh@dAV@NPNn@l@~AD`@Vh@ADl@j@\\JPLZ@ZQNUPMTYJG@EXOrAgAFUJO`@S\\e@@a@n@}@XHf@d@`@HVZBAACPl@DDN@DJCCV?FN?FCHQPHZ?REA?MDA?L@E",
            resource_state: 2,
          },
        },
      ]),
    });
  });
};
