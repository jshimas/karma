import React from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUs from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Activity } from "../../models/Activity";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { printTimeDifference } from "../../lib/utils";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import { CalendarIcon } from "@radix-ui/react-icons";
import ClockIcon from "../../assets/icons/ClockIcon";
import LongArrowRight from "../../assets/icons/LongArrowRight";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import Badge from "../Badge";
import "./index.css";

const locales = {
  "en-US": enUs,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BigCalendarProps {
  activities: Activity[] | undefined;
}

const BigCalendar: React.FC<BigCalendarProps> = ({ activities }) => {
  const navigate = useNavigate();

  const events: Event[] | undefined = activities?.map((activity) => {
    return {
      title: activity.name,
      start: activity.startDate,
      end: activity.endDate,
      resource: {
        id: activity.id,
        organizationId: activity.organizationId,
        scopes: activity.scopes,
        address: activity.address,
      },
    } as Event;
  });

  const isMultiDayEvent = (event: Event): boolean => {
    if (!event.start || !event.end) return false;

    return event.start.getDate() !== event.end.getDate();
  };

  const eventPropGetter = (event: Event): string => {
    const multiDayEvent = isMultiDayEvent(event);

    if (multiDayEvent) return "bg-teal-700 text-white";

    return "hover:bg-slate-100 text-slate-800";
  };

  return (
    <Calendar
      defaultView="month"
      localizer={localizer}
      events={events}
      components={{
        event: ({ event }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`flex space-x-1 transition-all px-2 rounded-md items-center ${eventPropGetter(
                    event
                  )}`}
                >
                  {!isMultiDayEvent(event) && (
                    <p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#0f766e"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  )}
                  <p>{event.start && format(event.start, "HH:mm")}</p>
                  <p>{event.title}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="py-4 px-8">
                  <div className="flex items-center space-x-6 mb-2">
                    <h1 className="text-lg font-semibold">{event.title}</h1>
                    <div className="flex flex-wrap space-x-2">
                      {event.resource.scopes.map((scope: string) => (
                        <Badge key={scope}>{scope}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center mb-1">
                    <MapPinIcon className="w-5 h-5" />
                    <p className="">
                      {event.resource.address.split(",").slice(0, 2).join(",")}
                    </p>
                  </div>
                  <div className="flex space-x-8 items-center mb-1">
                    <div className="flex space-x-2 items-center">
                      <CalendarIcon className="w-5 h-5" />
                      <p className="">
                        {event.start && format(event.start, "yyyy-MM-dd")}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center mb-4">
                    <ClockIcon className="w-5 h-5" />
                    <p className="">
                      {event.start && format(event.start, "HH:mm")}
                    </p>
                    <LongArrowRight className="w-5 h-5" />
                    <p className="">
                      {event.end && format(event.end, "HH:mm")}
                    </p>
                    {event.start && event.end && (
                      <p className="">
                        {"("}
                        {printTimeDifference(event.start, event.end)}
                        {")"}
                      </p>
                    )}
                  </div>
                  <Button
                    variant={"secondary"}
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/organizations/${event.resource.organizationId}/activities/${event.resource.id}`
                      )
                    }
                  >
                    Full details
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          );
        },
      }}
      startAccessor="start"
      endAccessor="end"
      views={["month"]}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default BigCalendar;
