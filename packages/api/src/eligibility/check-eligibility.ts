import type { League } from "../schemas/league";
import type { RegistrationStatus } from "../schemas/registration";

export interface EligibilityInput {
  safetyRating: number;
  league: League;
  carClassId: string;
  /** Seats already filled in the requested car class, excluding this driver. */
  seatsFilled: number;
}

export interface EligibilityResult {
  status: RegistrationStatus;
  reason?: string;
}

/**
 * Mirrors the League Detail page's proactive eligibility check (user-flow A2):
 * a driver should know seat-confirmed / on-waitlist / ineligible before they
 * even click Register.
 */
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const { safetyRating, league, carClassId, seatsFilled } = input;

  const carClass = league.carClasses.find(
    (candidate) => candidate.id === carClassId,
  );
  if (!carClass) {
    return {
      status: "ineligible",
      reason: "This car class is not offered by the league.",
    };
  }

  if (safetyRating < league.minimumSafetyRating) {
    return {
      status: "ineligible",
      reason: `Safety rating must be at least ${league.minimumSafetyRating}.`,
    };
  }

  if (seatsFilled >= carClass.gridSize) {
    return {
      status: "on-waitlist",
      reason: "This car class is at grid capacity.",
    };
  }

  return { status: "seat-confirmed" };
}
