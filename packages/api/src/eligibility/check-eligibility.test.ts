import { describe, expect, it } from "vitest";

import type { League } from "../schemas/league";
import { checkEligibility } from "./check-eligibility";

const league: League = {
  id: "league-1",
  name: "GT3 Sprint Series",
  sim: "iracing",
  format: "sprint-series",
  visibility: "public",
  carClasses: [
    { id: "gt3", name: "GT3", gridSize: 2 },
    { id: "gt4", name: "GT4", gridSize: 40 },
  ],
  rounds: [],
  minimumSafetyRating: 2.5,
  conductPolicy: "Be respectful.",
  entryFee: 25,
};

describe("checkEligibility", () => {
  it("confirms a seat when safety rating clears the minimum and the grid has room", () => {
    const result = checkEligibility({
      safetyRating: 3,
      league,
      carClassId: "gt3",
      seatsFilled: 0,
    });
    expect(result.status).toBe("seat-confirmed");
  });

  it("marks the driver ineligible when their safety rating is below the league minimum", () => {
    const result = checkEligibility({
      safetyRating: 1,
      league,
      carClassId: "gt3",
      seatsFilled: 0,
    });
    expect(result.status).toBe("ineligible");
    expect(result.reason).toMatch(/safety rating/i);
  });

  it("marks the driver ineligible when the car class does not exist on the league", () => {
    const result = checkEligibility({
      safetyRating: 4,
      league,
      carClassId: "lmp2",
      seatsFilled: 0,
    });
    expect(result.status).toBe("ineligible");
    expect(result.reason).toMatch(/car class/i);
  });

  it("waitlists the driver when the car class grid is already full", () => {
    const result = checkEligibility({
      safetyRating: 4,
      league,
      carClassId: "gt3",
      seatsFilled: 2,
    });
    expect(result.status).toBe("on-waitlist");
  });

  it("prioritizes the safety-rating check over grid capacity", () => {
    const result = checkEligibility({
      safetyRating: 1,
      league,
      carClassId: "gt3",
      seatsFilled: 2,
    });
    expect(result.status).toBe("ineligible");
  });
});
