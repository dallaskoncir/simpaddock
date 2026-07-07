import type { SplitThresholds, SplitTier } from "../schemas/league";

/**
 * Auto-assigns a driver's split tier from their safety rating. Assumes the
 * driver has already cleared the league's minimumSafetyRating floor
 * (see checkEligibility) — this only decides which split they land in.
 */
export function assignSplit(
  safetyRating: number,
  thresholds: SplitThresholds,
): SplitTier {
  if (safetyRating >= thresholds.splitA) return "split-a";
  if (safetyRating >= thresholds.splitB) return "split-b";
  return "split-c";
}
