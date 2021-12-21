import { isPotentialCommuteRide } from "./activity.js";

describe("isPotentialCommuteRide", () => {
  it("returns false when the ride is already a commute", () => {
    expect(isPotentialCommuteRide({ commute: true })).toBe(false);
  });
});
