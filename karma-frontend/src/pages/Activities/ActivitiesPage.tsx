import { useState } from "react";
import { Input } from "../../components/ui/Input";
import SearchIcon from "../../assets/icons/SearchIcon";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MultipleSelector, { Option } from "../../components/ui/MultipleSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import { cn, printTimeDifference } from "../../lib/utils";
import { format, set } from "date-fns";
import PaperAirplaneIcon from "../../assets/icons/PaperAirplaneIcon";
import HashtagIcon from "../../assets/icons/PaperAirplaneIcon copy";
import MyGoogleMap from "../../components/MyGoogleMap";
import { getActivities } from "../../api/activityApi";
import { useQuery } from "@tanstack/react-query";
import MarkerWithInfowindow from "../../components/MarkerWIthInfowindow";
import Badge from "../../components/Badge";
import ClockIcon from "../../assets/icons/ClockIcon";
import LongArrowRight from "../../assets/icons/LongArrowRight";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import { Calendar } from "../../components/ui/Calender";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import { useNavigate } from "react-router-dom";
import BigCalendar from "../../components/BigCalendar/BigCalendar";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActivitiesRequest,
  ActivitiesRequestSchema,
} from "../../models/Activity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Circle } from "../../components/MapCircle";
import { useAuth } from "../../hooks/useAuth";

type DisplayType = "map" | "list" | "calendar";

const DISTANCE_OPTIONS: Option[] = [
  { label: "less than 1 km", value: "1000" },
  { label: "less than 5 km", value: "5000" },
  { label: "less than 10 km", value: "10000" },
  { label: "less than 25 km", value: "25000" },
  { label: "less than 50 km", value: "50000" },
];

const SCOPE_OPTIONS: Option[] = [
  { label: "healthcare", value: "healthcare" },
  { label: "education", value: "education" },
  { label: "sports", value: "sports" },
  { label: "culture", value: "culture" },
  { label: "community", value: "community" },
  { label: "animals", value: "animals" },
];

export default function ActivitiesPage() {
  const [displayType, setDisplayType] = useState<DisplayType>("list");
  const [recommendations, setRecommendations] = useState<boolean>(false);
  const [noCalendarConflicts, setNoCalendarConflicts] =
    useState<boolean>(false);
  const [queryParams, setQueryParams] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user);

  const {
    data: activities,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["activities", queryParams],
    queryFn: async () => await getActivities({ data: queryParams }),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivitiesRequest>({
    resolver: zodResolver(ActivitiesRequestSchema),
  });

  const onSubmit: SubmitHandler<ActivitiesRequest> = async (data) => {
    setQueryParams(data);

    // const queryParams = new URLSearchParams();

    // if (data.search) {
    //   queryParams.set("search", data.search);
    // }

    // if (data.scopes) {
    //   queryParams.set("scopes", data.scopes.join(","));
    // }

    // if (data.distance) {
    //   queryParams.set("distance", data.distance);
    // }

    // if (data.from) {
    //   queryParams.set("from", format(data.from, "yyyy-MM-dd"));
    // }

    // if (data.to) {
    //   queryParams.set("to", format(data.to, "yyyy-MM-dd"));
    // }

    // navigate(`/activities?${new URLSearchParams(queryParams)}`);
  };

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isPending) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="w-2/5 flex flex-col bg-slate-50 justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 uppercase">
          Volunteer activities
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-4/5 flex flex-col items-center space-y-6"
        >
          <div className="flex w-64">
            <div
              onClick={() => setDisplayType("list")}
              className={`flex-1 border-teal-700 border-y-2 border-l-2 rounded-l-md px-3 text-center hover:bg-slate-100 transition-all hover:cursor-pointer ${
                displayType === "list" &&
                "bg-teal-700 hover:bg-teal-700 text-white"
              }`}
            >
              List
            </div>
            <div
              onClick={() => setDisplayType("map")}
              className={`flex-1 border-teal-700 border-2 px-3 text-center hover:bg-slate-100 transition-all hover:cursor-pointer ${
                displayType === "map" &&
                "bg-teal-700 hover:bg-teal-700 text-white"
              }`}
            >
              Map
            </div>
            <div
              onClick={() => setDisplayType("calendar")}
              className={`flex-1 border-teal-700 border-y-2 border-r-2 rounded-r-md px-3 text-center hover:bg-slate-100 transition-all hover:cursor-pointer ${
                displayType === "calendar" &&
                "bg-teal-700 hover:bg-teal-700 text-white"
              }`}
            >
              Calendar
            </div>
          </div>
          <div className="flex items-center gap-2 w-4/5">
            <Input
              {...register("search")}
              type="text"
              placeholder="Search activities"
              className="flex-1"
            />
            <Button className="px-3">
              <SearchIcon />
            </Button>
          </div>
          <div className="flex items-center space-x-8 flex-wrap">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                onCheckedChange={() => setRecommendations(!recommendations)}
              />
              <label
                htmlFor="recommendations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recommendations
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noCalendarConflict"
                onCheckedChange={() =>
                  setNoCalendarConflicts(!noCalendarConflicts)
                }
              />
              <label
                htmlFor="noCalendarConflict"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No conflicts with my calendar
              </label>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-4/5 pt-4">
            <div className="flex items-center space-x-2">
              <PaperAirplaneIcon />
              <Controller
                control={control}
                name="distance"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the distance" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <HashtagIcon />
              <Controller
                control={control}
                name="scopes"
                render={({ field }) => (
                  <MultipleSelector
                    defaultOptions={SCOPE_OPTIONS}
                    placeholder="Select the scopes"
                    creatable
                    className="shadow-sm"
                    value={
                      field.value &&
                      field.value.map(
                        (value) => ({ label: value, value } as Option)
                      )
                    }
                    onChange={(value) =>
                      field.onChange(value.map((v) => v.value))
                    }
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-center space-x-4 pt-2">
              <Controller
                control={control}
                name="from"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>Activities from</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Controller
                control={control}
                name="to"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "yyyy-MM-dd")
                        ) : (
                          <span>Activities until</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="w-3/5 h-full bg-slate-50 relative flex justify-start">
        {displayType === "list" && (
          <div className="flex flex-col items-center h-[calc(100vh-150px)] overflow-y-auto mt-28 space-y-10 w-full">
            {activities?.map((activity) => (
              <div className="w-full py-2 pl-10 pr-20 border-l-4 border-l-teal-700">
                <div className="flex space-x-4 items-center mb-1">
                  <h3 className="text-xl font-semibold">{activity.name}</h3>
                  <div className="flex space-x-2">
                    {activity.scopes.map((scope) => (
                      <Badge key={scope}>{scope}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-8 items-center mb-1">
                  <div className="flex space-x-2 items-center">
                    <CalendarIcon className="w-5 h-5" />
                    <p className="font-semibold">
                      {format(activity.startDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center">
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
                      {printTimeDifference(
                        activity.startDate,
                        activity.endDate
                      )}
                      {")"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 items-center mb-2">
                  <MapPinIcon className="w-5 h-5" />
                  <p className="font-semibold">
                    {activity.address.split(",").slice(0, 2).join(",")}
                  </p>
                </div>
                <p
                  className="mb-2 hover:cursor-pointer group"
                  onClick={() =>
                    navigate(
                      `/organizations/${activity.organizationId}/activities/${activity.id}`
                    )
                  }
                >
                  {activity.description.slice(0, 250)}...
                  <span className="ml-2 text-slate-500 group-hover:text-teal-900 group-hover:underline underline-offset-4 transition-all">
                    full details
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        {displayType === "map" && (
          <MyGoogleMap center={{ lat: 54.9094807, lng: 23.9531426 }} zoom={13}>
            {activities?.map((activity) => (
              <MarkerWithInfowindow key={activity.id} activity={activity} />
            ))}
            {user?.geoLocations?.map((location) => (
              <Circle
                radius={Number(watch("distance"))}
                center={location.location}
                strokeColor={"#0f766e"}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor={"#0d9488"}
                fillOpacity={0.3}
              />
            ))}
          </MyGoogleMap>
        )}
        {displayType === "calendar" && (
          <div className="mt-28 w-full flex justify-start">
            <div className="w-full mb-8 mr-8">
              <BigCalendar activities={activities} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
