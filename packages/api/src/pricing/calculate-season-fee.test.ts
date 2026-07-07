import { describe, expect, it } from "vitest";

import { calculateSeasonFee } from "./calculate-season-fee";

describe("calculateSeasonFee", () => {
  it("charges the base fee with no discounts when no deadline or round threshold applies", () => {
    const result = calculateSeasonFee({
      baseFee: 25,
      roundCount: 4,
      registeredAt: new Date("2026-06-01"),
    });
    expect(result).toEqual({
      baseFee: 25,
      earlyBirdDiscount: 0,
      multiRoundDiscount: 0,
      total: 25,
    });
  });

  it("applies the early-bird discount when registering on or before the deadline", () => {
    const result = calculateSeasonFee({
      baseFee: 100,
      roundCount: 4,
      registeredAt: new Date("2026-05-01"),
      earlyBirdDeadline: new Date("2026-05-15"),
      earlyBirdDiscountPercent: 10,
    });
    expect(result.earlyBirdDiscount).toBe(10);
    expect(result.total).toBe(90);
  });

  it("does not apply the early-bird discount when registering after the deadline", () => {
    const result = calculateSeasonFee({
      baseFee: 100,
      roundCount: 4,
      registeredAt: new Date("2026-05-20"),
      earlyBirdDeadline: new Date("2026-05-15"),
      earlyBirdDiscountPercent: 10,
    });
    expect(result.earlyBirdDiscount).toBe(0);
    expect(result.total).toBe(100);
  });

  it("applies the multi-round discount once round count meets the threshold", () => {
    const result = calculateSeasonFee({
      baseFee: 100,
      roundCount: 8,
      registeredAt: new Date("2026-06-01"),
      multiRoundThreshold: 8,
      multiRoundDiscountPercent: 5,
    });
    expect(result.multiRoundDiscount).toBe(5);
    expect(result.total).toBe(95);
  });

  it("does not apply the multi-round discount below the threshold", () => {
    const result = calculateSeasonFee({
      baseFee: 100,
      roundCount: 7,
      registeredAt: new Date("2026-06-01"),
      multiRoundThreshold: 8,
    });
    expect(result.multiRoundDiscount).toBe(0);
  });

  it("stacks the early-bird and multi-round discounts", () => {
    const result = calculateSeasonFee({
      baseFee: 100,
      roundCount: 10,
      registeredAt: new Date("2026-05-01"),
      earlyBirdDeadline: new Date("2026-05-15"),
      earlyBirdDiscountPercent: 10,
      multiRoundThreshold: 8,
      multiRoundDiscountPercent: 5,
    });
    expect(result.earlyBirdDiscount).toBe(10);
    expect(result.multiRoundDiscount).toBe(5);
    expect(result.total).toBe(85);
  });

  it("never returns a negative total even if discounts exceed the base fee", () => {
    const result = calculateSeasonFee({
      baseFee: 10,
      roundCount: 8,
      registeredAt: new Date("2026-05-01"),
      earlyBirdDeadline: new Date("2026-05-15"),
      earlyBirdDiscountPercent: 60,
      multiRoundThreshold: 8,
      multiRoundDiscountPercent: 60,
    });
    expect(result.total).toBe(0);
  });

  it("treats a free league (zero base fee) as zero total", () => {
    const result = calculateSeasonFee({
      baseFee: 0,
      roundCount: 6,
      registeredAt: new Date("2026-06-01"),
    });
    expect(result.total).toBe(0);
  });

  it("throws on a negative base fee", () => {
    expect(() =>
      calculateSeasonFee({
        baseFee: -5,
        roundCount: 4,
        registeredAt: new Date(),
      }),
    ).toThrow(RangeError);
  });

  it("throws on a round count below 1", () => {
    expect(() =>
      calculateSeasonFee({
        baseFee: 25,
        roundCount: 0,
        registeredAt: new Date(),
      }),
    ).toThrow(RangeError);
  });
});
