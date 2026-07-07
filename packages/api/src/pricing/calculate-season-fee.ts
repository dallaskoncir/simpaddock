const DEFAULT_EARLY_BIRD_DISCOUNT_PERCENT = 10;
const DEFAULT_MULTI_ROUND_THRESHOLD = 8;
const DEFAULT_MULTI_ROUND_DISCOUNT_PERCENT = 5;

export interface SeasonFeeInput {
  baseFee: number;
  roundCount: number;
  registeredAt: Date;
  /** Registrations at or before this date qualify for the early-bird discount. */
  earlyBirdDeadline?: Date;
  earlyBirdDiscountPercent?: number;
  /** Round count a season must meet or exceed to qualify for the multi-round discount. */
  multiRoundThreshold?: number;
  multiRoundDiscountPercent?: number;
}

export interface SeasonFeeBreakdown {
  baseFee: number;
  earlyBirdDiscount: number;
  multiRoundDiscount: number;
  total: number;
}

function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Pure pricing calculation: base entry fee minus early-bird and multi-round discounts. */
export function calculateSeasonFee(input: SeasonFeeInput): SeasonFeeBreakdown {
  const {
    baseFee,
    roundCount,
    registeredAt,
    earlyBirdDeadline,
    earlyBirdDiscountPercent = DEFAULT_EARLY_BIRD_DISCOUNT_PERCENT,
    multiRoundThreshold = DEFAULT_MULTI_ROUND_THRESHOLD,
    multiRoundDiscountPercent = DEFAULT_MULTI_ROUND_DISCOUNT_PERCENT,
  } = input;

  if (baseFee < 0) {
    throw new RangeError("baseFee cannot be negative");
  }
  if (roundCount < 1) {
    throw new RangeError("roundCount must be at least 1");
  }

  const isEarlyBird =
    earlyBirdDeadline !== undefined &&
    registeredAt.getTime() <= earlyBirdDeadline.getTime();
  const earlyBirdDiscount = isEarlyBird
    ? roundToCents(baseFee * (earlyBirdDiscountPercent / 100))
    : 0;

  const qualifiesForMultiRound = roundCount >= multiRoundThreshold;
  const multiRoundDiscount = qualifiesForMultiRound
    ? roundToCents(baseFee * (multiRoundDiscountPercent / 100))
    : 0;

  const total = Math.max(
    roundToCents(baseFee - earlyBirdDiscount - multiRoundDiscount),
    0,
  );

  return {
    baseFee: roundToCents(baseFee),
    earlyBirdDiscount,
    multiRoundDiscount,
    total,
  };
}
