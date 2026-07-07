import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        outline: "border-border bg-transparent text-foreground",
        // Driver seat status — surfaced on League Detail and the registration wizard.
        "seat-confirmed": "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        "on-waitlist": "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
        ineligible: "border-transparent bg-red-500/15 text-red-700 dark:text-red-400",
        // Split tiers — auto-assigned from a driver's safety rating.
        "split-a": "border-transparent bg-split-gold/20 text-split-gold",
        "split-b": "border-transparent bg-split-silver/20 text-split-silver",
        "split-c": "border-transparent bg-split-bronze/20 text-split-bronze",
        // Role badge for league organizers.
        "league-host": "border-transparent bg-purple-500/15 text-purple-700 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Render as the child element instead of a <span>, via Radix Slot. */
  asChild?: boolean;
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
