import { z } from "zod";

import { splitTierSchema } from "./league";

export const registrationStatusSchema = z.enum([
  "seat-confirmed",
  "on-waitlist",
  "ineligible",
]);

export const registrationSchema = z.object({
  id: z.string().min(1),
  leagueId: z.string().min(1),
  driverId: z.string().min(1),
  carClassId: z.string().min(1),
  team: z.string().trim().max(60).optional(),
  split: splitTierSchema.optional(),
  status: registrationStatusSchema,
  agreedToRules: z.literal(
    true,
    "You must agree to the league rules and SimPaddock terms of conduct",
  ),
  registeredAt: z.coerce.date(),
});

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;
export type Registration = z.infer<typeof registrationSchema>;
