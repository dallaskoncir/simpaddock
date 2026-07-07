import { describe, expect, it } from "vitest";
import type { z } from "zod";

import { leagueSchema } from "./league";

function makeLeague(overrides: Partial<z.input<typeof leagueSchema>> = {}) {
  return {
    id: "league-1",
    name: "GT3 Sprint Series",
    sim: "iracing",
    format: "sprint-series",
    visibility: "public",
    carClasses: [{ id: "gt3", name: "GT3", gridSize: 40 }],
    rounds: [
      {
        id: "round-1",
        date: "2026-08-01T18:00:00.000Z",
        track: "Spa-Francorchamps",
        carClassId: "gt3",
        format: "sprint",
        gridSize: 40,
      },
    ],
    minimumSafetyRating: 2.5,
    conductPolicy: "No contact rating below 4.0. Be respectful in chat.",
    entryFee: 25,
    ...overrides,
  };
}

describe("leagueSchema", () => {
  it("accepts a fully valid league", () => {
    const result = leagueSchema.safeParse(makeLeague());
    expect(result.success).toBe(true);
  });

  it("rejects a league with no car classes", () => {
    const result = leagueSchema.safeParse(makeLeague({ carClasses: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects a league with no rounds", () => {
    const result = leagueSchema.safeParse(makeLeague({ rounds: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported sim", () => {
    // @ts-expect-error deliberately invalid enum value for the test
    const result = leagueSchema.safeParse(makeLeague({ sim: "gran-turismo" }));
    expect(result.success).toBe(false);
  });

  it("rejects a negative entry fee", () => {
    const result = leagueSchema.safeParse(makeLeague({ entryFee: -10 }));
    expect(result.success).toBe(false);
  });

  it.each([-1, 5.5])(
    "rejects a minimumSafetyRating of %s outside the 0-5 range",
    (minimumSafetyRating) => {
      const result = leagueSchema.safeParse(
        makeLeague({ minimumSafetyRating }),
      );
      expect(result.success).toBe(false);
    },
  );

  it("accepts descending split thresholds", () => {
    const result = leagueSchema.safeParse(
      makeLeague({
        splitThresholds: { splitA: 4, splitB: 2.5, splitC: 1 },
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects split thresholds that are not descending (car class eligibility misconfiguration)", () => {
    const result = leagueSchema.safeParse(
      makeLeague({
        splitThresholds: { splitA: 1, splitB: 2.5, splitC: 4 },
      }),
    );
    expect(result.success).toBe(false);
  });
});
