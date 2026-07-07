import { z } from "zod";

/**
 * Safety rating is normalized to a 0-5 scale (roughly analogous to an
 * iRacing-style license/SR value) so league eligibility thresholds and
 * split-tier assignment can compare against a single numeric range.
 */
export const SAFETY_RATING_MIN = 0;
export const SAFETY_RATING_MAX = 5;

export const driverSchema = z.object({
  id: z.string().min(1),
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(40),
  simAccountId: z.string().trim().min(1, "Sim account ID is required"),
  safetyRating: z
    .number()
    .min(
      SAFETY_RATING_MIN,
      `Safety rating must be at least ${SAFETY_RATING_MIN}`,
    )
    .max(SAFETY_RATING_MAX, `Safety rating cannot exceed ${SAFETY_RATING_MAX}`),
  timezone: z.string().trim().min(1, "Timezone is required"),
  preferredNumber: z.number().int().min(0).max(999).optional(),
});

export type Driver = z.infer<typeof driverSchema>;
