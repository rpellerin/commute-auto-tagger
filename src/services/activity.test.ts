import { isPotentialCommuteRide } from "./activity";
import { Activity } from "./types/activity.js";

describe("isPotentialCommuteRide", () => {
  describe("when the ride is not a potential commute ride", () => {
    it("returns false when the ride is already a commute", () => {
      expect(isPotentialCommuteRide({ commute: true } as Activity, [], [])).toBe(false);
    });

    it("returns false when the ride is not a bike ride", () => {
      expect(isPotentialCommuteRide({ type: "Walking" } as Activity, [], [])).toBe(false);
    });

    it("returns false when the days do not match", () => {
      expect(
        isPotentialCommuteRide(
          {
            type: "Ride",
            start_latlng: [51, 20],
            start_date: "2021-12-21 09:00", // Tuesday
          } as Activity,
          [{ lat: 51, lng: 20, radius: 1 }],
          [0] // Sunday
        )
      ).toBe(false);
    });
  });

  describe("when the ride is a potential commute ride", () => {
    it("returns true when the ride matches all criteria", () => {
      expect(
        isPotentialCommuteRide(
          {
            type: "Ride",
            start_latlng: [51, 20],
            start_date: "2021-12-21 09:00", // Tuesday
          } as Activity,
          [{ lat: 51, lng: 20, radius: 1 }],
          [2] // Tuesday
        )
      ).toBe(true);
    });
  });
});
