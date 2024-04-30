"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "../Label";
import { TimePickerInput } from "./TimePickerInput";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showSeconds?: boolean;
}

export function TimePickerDemo({
  date,
  setDate,
  showSeconds,
}: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2 items-center">
      {showSeconds && (
        <>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={setDate}
            ref={secondRef}
            onRightFocus={() => hourRef.current?.focus()}
          />
          <div>d.</div>
        </>
      )}
      {/* <Label htmlFor="hours" className="text-xs">
          Hours
        </Label> */}
      <TimePickerInput
        picker="hours"
        date={date}
        setDate={setDate}
        ref={hourRef}
        onLeftFocus={() => secondRef.current?.focus()}
        onRightFocus={() => minuteRef.current?.focus()}
      />
      <div>&#58;</div>
      {/* <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label> */}
      <TimePickerInput
        picker="minutes"
        date={date}
        setDate={setDate}
        ref={minuteRef}
        onLeftFocus={() => hourRef.current?.focus()}
        // onRightFocus={() => secondRef.current?.focus()}
      />
    </div>
  );
}
