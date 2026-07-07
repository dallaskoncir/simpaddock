import { z } from "zod";

import { SAFETY_RATING_MAX, SAFETY_RATING_MIN } from "./driver";

export const simSchema = z.enum(["iracing", "acc", "lmu", "rf2", "ams2"]);
export const leagueFormatSchema = z.enum([
  "sprint-series",
  "endurance",
  "championship",
]);
export const roundFormatSchema = z.enum(["sprint", "endurance"]);
export const visibilitySchema = z.enum(["public", "invite-only"]);
export const splitTierSchema = z.enum(["split-a", "split-b", "split-c"]);

export const carClassSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Car class name is required"),
  gridSize: z.number().int().positive("Grid size must be a positive number"),
});

export const roundSchema = z.object({
  id: z.string().min(1),
  date: z.coerce.date(),
  track: z.string().trim().min(1, "Track is required"),
  carClassId: z.string().min(1),
  format: roundFormatSchema,
  gridSize: z.number().int().positive(),
});

/** Safety-rating floors for each split, descending from split-a (fastest) to split-c. */
export const splitThresholdsSchema = z
  .object({
    splitA: z.number().min(SAFETY_RATING_MIN).max(SAFETY_RATING_MAX),
    splitB: z.number().min(SAFETY_RATING_MIN).max(SAFETY_RATING_MAX),
    splitC: z.number().min(SAFETY_RATING_MIN).max(SAFETY_RATING_MAX),
  })
  .refine((thresholds) => thresholds.splitA >= thresholds.splitB, {
    message: "Split A threshold must be greater than or equal to Split B",
    path: ["splitA"],
  })
  .refine((thresholds) => thresholds.splitB >= thresholds.splitC, {
    message: "Split B threshold must be greater than or equal to Split C",
    path: ["splitB"],
  });

export const leagueSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(3, "League name must be at least 3 characters")
    .max(80),
  sim: simSchema,
  format: leagueFormatSchema,
  visibility: visibilitySchema,
  carClasses: z
    .array(carClassSchema)
    .min(1, "A league needs at least one car class"),
  rounds: z.array(roundSchema).min(1, "A league needs at least one round"),
  minimumSafetyRating: z
    .number()
    .min(SAFETY_RATING_MIN)
    .max(SAFETY_RATING_MAX)
    .describe(
      "Drivers below this safety rating are marked ineligible before registering.",
    ),
  incidentLimitPerRound: z.number().int().nonnegative().optional(),
  conductPolicy: z.string().trim().min(1, "Conduct policy is required"),
  stewardContact: z.string().trim().optional(),
  splitThresholds: splitThresholdsSchema.optional(),
  entryFee: z.number().nonnegative("Entry fee cannot be negative"),
  earlyBirdDeadline: z.coerce.date().optional(),
});

export type Sim = z.infer<typeof simSchema>;
export type LeagueFormat = z.infer<typeof leagueFormatSchema>;
export type Visibility = z.infer<typeof visibilitySchema>;
export type SplitTier = z.infer<typeof splitTierSchema>;
export type CarClass = z.infer<typeof carClassSchema>;
export type Round = z.infer<typeof roundSchema>;
export type SplitThresholds = z.infer<typeof splitThresholdsSchema>;
export type League = z.infer<typeof leagueSchema>;
