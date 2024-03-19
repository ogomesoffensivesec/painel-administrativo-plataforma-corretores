import * as React from "react"


const ProposalInput = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
     className="flex w-full  dark:bg-transparent dark:text-white rounded-md  text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-5"
      ref={ref}
      {...props} />)
  );
})
ProposalInput.displayName = "ProposalInput"

export { ProposalInput }
