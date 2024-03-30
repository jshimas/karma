import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex text-sm rounded-full font-semibold text-teal-700 border-teal-700 border-2 px-2">
      {children}
    </div>
  );
}
