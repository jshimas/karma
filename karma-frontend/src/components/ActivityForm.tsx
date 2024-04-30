import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityEdit, ActivityEditSchema } from "../models/Activity";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/Calender";
import { TimePickerDemo } from "./ui/TimePicker/TimePicker";
import { Label } from "./ui/Label";
import MultipleSelector, { Option } from "./ui/MultipleSelector";
import { Checkbox } from "./ui/Checkbox";
import { setDefaults, fromPlaceId, GeocodeOptions } from "react-geocode";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/Command";
import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/Dialog";
import MyGoogleMap from "./MyGoogleMap";
import { Marker, useMap } from "@vis.gl/react-google-maps";

const SCOPE_OPTIONS: Option[] = [
  { label: "healthcare", value: "healthcare" },
  { label: "education", value: "education" },
  { label: "sports", value: "sports" },
  { label: "culture", value: "culture" },
  { label: "community", value: "community" },
  { label: "animals", value: "animals" },
];

interface ActivityFormProps {
  onSubmit: SubmitHandler<ActivityEdit>;
  isSubmitting: boolean;
  defaultValues?: ActivityEdit;
}

export default function ActivityForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: ActivityFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActivityEdit>({
    resolver: zodResolver(ActivityEditSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const navigate = useNavigate();
  const { organizationId } = useParams();
  const [openAddressSearch, setOpenAddressSearch] = useState(false);

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

  setDefaults({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY_GEOCIDING,
  } as GeocodeOptions);

  const address = watch("address");
  const geoLocation = watch("geoLocation");
  useEffect(() => {
    const getCoordinates = async () => {
      console.log(address);
      if (!address) return;
      const results = await fromPlaceId(address.split("::")[1]);
      setValue("geoLocation", results.results[0].geometry.location);
    };

    getCoordinates();
  }, [address, setValue]);

  const map = useMap();
  useEffect(() => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      if (geoLocation) {
        bounds.extend(geoLocation);
      } else {
        bounds.extend({ lat: 54.9005, lng: 23.92 });
      }
      map.fitBounds(bounds);
      const mapZoom = map.getZoom();
      if (mapZoom) {
        map.setZoom(mapZoom > 13 ? 13 : mapZoom);
      } else {
        map.setZoom(13);
      }
    }
  }, [map, geoLocation]);

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 mx-44 self-center">
        <h1 className="text-center mb-4 text-2xl font-bold">
          Fill in activity information
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <Label htmlFor="name">Activity title</Label>
              <Input {...register("name")} placeholder="Name" />
              {errors.name && (
                <p className="text-destructive text-sm my-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="volunteerNeeded">Volunteers needed</Label>
              <Input
                {...register("volunteersNeeded")}
                placeholder="Volunteers needed"
              />
              {errors.volunteersNeeded && (
                <p className="text-destructive text-sm my-1">
                  {errors.volunteersNeeded?.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-start">
                <div className="w-20 mr-2">
                  <Label htmlFor="startDate">Start time</Label>
                </div>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <div className="flex space-x-2 items-end">
                      <div className="">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                <span>Pick a start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <TimePickerDemo
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
              <ErrorMessage message={errors.startDate?.message} />
            </div>

            <div>
              <div className="flex items-center justify-start">
                <div className="w-20 mr-2">
                  <Label htmlFor="endDate">End time</Label>
                </div>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <div className="flex space-x-2 items-end">
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                <span>Pick an end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < watch("startDate") ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <TimePickerDemo
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
              <ErrorMessage message={errors.endDate?.message} />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="address">Address</Label>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Popover
                    open={openAddressSearch}
                    onOpenChange={setOpenAddressSearch}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        role="combobox"
                        className={cn(
                          "w-full justify-start",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <>{field.value.split("::")[0]}</>
                        ) : (
                          <>+ Set Address</>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search address..."
                          className="h-9"
                          onValueChange={(value) => {
                            getPlacePredictions({ input: value });
                          }}
                        />
                        {isPlacePredictionsLoading ? (
                          <div className="mx-auto my-4 flex justify-center items-center">
                            <SpinnerIcon />
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>No results.</CommandEmpty>
                            <CommandGroup>
                              {placePredictions.map((prediction) => (
                                <CommandItem
                                  value={prediction.description}
                                  key={prediction.place_id}
                                  onSelect={() => {
                                    field.onChange(
                                      `${prediction.description}::${prediction.place_id}`
                                    );
                                    setOpenAddressSearch(false);
                                  }}
                                >
                                  {prediction.description}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <ErrorMessage message={errors.address?.message} />
            </div>

            <div>
              <Label htmlFor="scopes">Scopes</Label>
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

              <ErrorMessage message={errors.scopes?.message} />
            </div>

            <div className="space-y-1 flex flex-col">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"outline"}>+ Add description</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Activity description</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tell Karma community about your activity.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    {...register("description")}
                    placeholder="Write activity description here"
                    className="h-72"
                  />
                  <AlertDialogFooter>
                    <AlertDialogAction>Save</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {errors.description && (
                <p className="text-destructive text-sm my-1">
                  {errors.description?.message}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-slate-500">
                  The activity will be hidden from volunteers or:
                </p>
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="setPublic"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="setPublic"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make it public
                      </label>
                    </div>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/organizations/${organizationId}`)}
                >
                  Cancel
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? <SpinnerIcon /> : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="w-2/5 h-full bg-teal-200 relative">
        <MyGoogleMap
          center={
            geoLocation
              ? { lat: geoLocation.lat, lng: geoLocation.lng }
              : { lat: 54.9005, lng: 23.92 }
          }
          zoom={geoLocation ? 16 : 12.8}
        >
          {geoLocation && <Marker position={geoLocation} />}
        </MyGoogleMap>
      </div>
    </div>
  );
}
