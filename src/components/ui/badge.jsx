import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[1px] border-blue-600 bg-blue-600/40    text-stone-700 shadow hover:bg-blue-600 hover:text-white select-none cursor-pointer",
        analysis:
          "border-[1px] border-amber-400 bg-amber-100/70  hover:bg-secondary/80 text-xs hover:text-stone-500 dark:hover:text-white  text-stone-900 select-none cursor-pointer",
        secondary:
          "border-[transparent] bg-secondary text-secondary-foreground hover:bg-secondary/80 select-none cursor-pointer",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 select-none cursor-pointer",
        outline:
          "text-foreground border-[1px] border-stone-600 bg-stone-500/40",
      },
      size: {
        default: "py-0.5",
        lg: "py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({ className, variant, size, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
