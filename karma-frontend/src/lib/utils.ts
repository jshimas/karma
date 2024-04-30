import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Participation } from "../models/Participation";
import { Application } from "../models/Application";
import { Activity } from "../models/Activity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTime(date: string) {
  const convertedDate = new Date(Date.parse(date));
  const hours: number = convertedDate.getUTCHours();
  const minutes: number = convertedDate.getUTCMinutes();
  const stringMinutes = `${minutes}`.padStart(2, "0");
  const stringHours = `${hours}`.padStart(2, "0");
  return `${stringHours}:${stringMinutes}`;
}

export function parseDate(date: string) {
  const convertedDate = new Date(date);
  return convertedDate.toISOString().split("T")[0];
}

type TimeDifference = {
  days: number;
  hours: number;
  minutes: number;
};

export function timeDifference(startDate: Date, endDate: Date): TimeDifference {
  let days = 0;

  const timeDifferenceInMilliseconds: number =
    endDate.getTime() - startDate.getTime();

  // Check if the time difference is more than 24 hours
  if (timeDifferenceInMilliseconds >= 24 * 60 * 60 * 1000) {
    days = Math.floor(timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000));
  }

  // Calculate the remaining time after subtracting days
  const remainingMilliseconds =
    timeDifferenceInMilliseconds - days * 24 * 60 * 60 * 1000;

  // Convert remaining milliseconds to hours and minutes
  const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  return { days, hours, minutes };
}

export function printTimeDifference(startDate: Date, endDate: Date): string {
  const timeDifferenceInMilliseconds: number =
    endDate.getTime() - startDate.getTime();

  // Check if the time difference is more than 24 hours
  if (timeDifferenceInMilliseconds >= 24 * 60 * 60 * 1000) {
    const days: number = Math.floor(
      timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000)
    );
    return days > 1 ? `${days} days` : `${days} day`;
  }

  // Convert milliseconds to hours, minutes, and seconds
  const hours: number = Math.floor(
    timeDifferenceInMilliseconds / (1000 * 60 * 60)
  );
  const minutes: number = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${hours}h ${minutes}m`;
}
const applicationStatusPriority: Record<string, number> = {
  awaiting: 0,
  accepted: 1,
  rejected: 2,
};

export const compareApplicationsByStatusAndDate = (
  a: Application,
  b: Application
) => {
  const statusA = !a.dateOfApproval
    ? "awaiting"
    : a.isApproved
    ? "accepted"
    : "rejected";
  const statusB = !b.dateOfApproval
    ? "awaiting"
    : b.isApproved
    ? "accepted"
    : "rejected";

  const statusComparison =
    applicationStatusPriority[statusA] - applicationStatusPriority[statusB];

  if (statusComparison === 0) {
    const dateA = a.dateOfApplication.getTime();
    const dateB = b.dateOfApplication.getTime();

    return dateB - dateA;
  }

  return statusComparison;
};

export const compareParticipationsByStatusAndDate = (
  a: Participation,
  b: Participation
) => {
  const statusA = !a.dateOfConfirmation
    ? "awaiting"
    : a.isConfirmed
    ? "accepted"
    : "rejected";
  const statusB = !b.dateOfConfirmation
    ? "awaiting"
    : b.isConfirmed
    ? "accepted"
    : "rejected";

  const statusComparison =
    applicationStatusPriority[statusA] - applicationStatusPriority[statusB];

  if (statusComparison === 0) {
    const dateA = a.dateOfInvitation.getTime();
    const dateB = b.dateOfInvitation.getTime();

    return dateB - dateA;
  }

  return statusComparison;
};

type ActivityState = "upcoming" | "ongoing" | "finished" | "completed";

export const getActivityState = (activity: Activity): ActivityState => {
  if (activity.resolved) {
    return "completed";
  }
  if (activity.endDate < new Date()) {
    return "finished";
  }
  if (activity.startDate < new Date()) {
    return "ongoing";
  }
  return "upcoming";
};
