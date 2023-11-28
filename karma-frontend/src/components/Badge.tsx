import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex text-sm rounded-full font-semibold text-white bg-teal-700 px-2">
      {children}
    </div>
  );
}
