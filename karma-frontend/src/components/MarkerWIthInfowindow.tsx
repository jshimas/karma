import React, { useState } from "react";
import { Activity } from "../models/Activity";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import Badge from "./Badge";
import { format } from "date-fns";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import LongArrowRight from "../assets/icons/LongArrowRight";
import { printTimeDifference } from "../lib/utils";
import MapPinIcon from "../assets/icons/MapPinIcon";

interface MarkerProps {
  activity: Activity;
  isOpen?: boolean;
  showButton?: boolean;
}

const MarkerWithInfowindow: React.FC<MarkerProps> = ({
  activity,
  isOpen = false,
  showButton = true,
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(isOpen);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const navigate = useNavigate();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={activity.geoLocation}
        title={activity.name}
      >
        <Pin background={"#0f766e"} glyphColor={"#fff"} borderColor={"#fff"} />
      </AdvancedMarker>
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={400}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div className="py-2 px-8">
            <div className="flex items-center mb-2 flex-wrap">
              <h1 className="text-lg font-semibold mr-6">{activity.name}</h1>
              <div className="flex flex-wrap space-x-2">
                {activity.scopes.map((scope) => (
                  <Badge key={scope}>{scope}</Badge>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 items-center mb-1">
              <MapPinIcon className="w-5 h-5" />
              <p className="font-semibold">
                {activity.address.split(",").slice(0, 2).join(",")}
              </p>
            </div>
            <div className="flex space-x-8 items-center mb-1">
              <div className="flex space-x-2 items-center">
                <CalendarIcon className="w-5 h-5" />
                <p className="font-semibold">
                  {format(activity.startDate, "yyyy-MM-dd")}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 items-center mb-4">
              <ClockIcon className="w-5 h-5" />
              <p className="font-semibold">
                {format(activity.startDate, "HH:mm")}
              </p>
              <LongArrowRight className="w-5 h-5" />
              <p className="font-semibold">
                {format(activity.endDate, "HH:mm")}
              </p>

              <p className="font-semibold">
                {"("}
                {printTimeDifference(activity.startDate, activity.endDate)}
                {")"}
              </p>
            </div>
            {showButton && (
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={() =>
                  navigate(
                    `/organizations/${activity.organizationId}/activities/${activity.id}`
                  )
                }
              >
                Full details
              </Button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MarkerWithInfowindow;
