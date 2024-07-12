import Link from "next/link";

export function TopBarMain({ children }) {
  return (
    <div className="w-full h-20p py-4  px-12 flex justify-start gap-6 border-b-[1px] border-border shadow-sm">
      {children}
    </div>
  );
}

export function TopbarItem({ children, ...rest }) {
  return (
    <Link className="flex gap-2 p-1 items-center text-muted-foreground text-sm hover:text-blue-600/70 duration-300 transition-all" {...rest}>
      {children}
    </Link>
  );
}


