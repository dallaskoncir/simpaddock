import type { z } from "zod";

import { driverSchema } from "./driver";

function makeDriver(overrides: Partial<z.input<typeof driverSchema>> = {}) {
  return {
    id: "driver-1",
    displayName: "Ada Lovelace",
    simAccountId: "123456",
    safetyRating: 3.5,
    timezone: "America/New_York",
    ...overrides,
  };
}

describe("driverSchema", () => {
  it("accepts a valid driver profile", () => {
    const result = driverSchema.safeParse(makeDriver());
    expect(result.success).toBe(true);
  });

  it("accepts an optional preferred number", () => {
    const result = driverSchema.safeParse(makeDriver({ preferredNumber: 88 }));
    expect(result.success).toBe(true);
  });

  it.each([-1, -0.01, 5.01, 10])(
    "rejects a safety rating of %s outside the 0-5 range",
    (safetyRating) => {
      const result = driverSchema.safeParse(makeDriver({ safetyRating }));
      expect(result.success).toBe(false);
    },
  );

  it.each([0, 2.5, 5])(
    "accepts a safety rating of %s within the 0-5 range",
    (safetyRating) => {
      const result = driverSchema.safeParse(makeDriver({ safetyRating }));
      expect(result.success).toBe(true);
    },
  );

  it("rejects a display name that is too short", () => {
    const result = driverSchema.safeParse(makeDriver({ displayName: "A" }));
    expect(result.success).toBe(false);
  });

  it("rejects a missing sim account ID", () => {
    const result = driverSchema.safeParse(makeDriver({ simAccountId: "" }));
    expect(result.success).toBe(false);
  });

  it("rejects a preferred number outside 0-999", () => {
    const result = driverSchema.safeParse(
      makeDriver({ preferredNumber: 1000 }),
    );
    expect(result.success).toBe(false);
  });
});
