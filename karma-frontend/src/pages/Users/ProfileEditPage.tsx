import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, updateUser } from "../../api/usersApi";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { Label } from "../../components/ui/Label";
import MultipleSelector, { Option } from "../../components/ui/MultipleSelector";
import { UserEdit, UserEditSchema } from "../../models/Users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import { Textarea } from "../../components/ui/TextArea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { setDefaults, fromPlaceId, GeocodeOptions } from "react-geocode";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";
import { cn } from "../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/Command";
import PenIcon from "../../assets/icons/PenIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const SCOPE_OPTIONS: Option[] = [
  { label: "healthcare", value: "healthcare" },
  { label: "education", value: "education" },
  { label: "sports", value: "sports" },
  { label: "culture", value: "culture" },
  { label: "community", value: "community" },
  { label: "animlals", value: "animlals" },
];

export default function ProfileEditPage() {
  const [locationName, setLocationName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const { user: authUser } = useAuth();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", authUser?.id],
    queryFn: async () => await getCurrentUser({}),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserEdit>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      ...user,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "geoLocations",
  });

  const [openAddressSearch, setOpenAddressSearch] = useState(false);

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

  setDefaults({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY_GEOCIDING,
  } as GeocodeOptions);

  const appendLocation = async () => {
    const results = await fromPlaceId(placeId);
    const location = results.results[0].geometry.location;
    append({ name: locationName, address, location });
    setLocationName("");
    setAddress("");
    setPlaceId("");
  };

  const updateLocation = async (index: number) => {
    const results = await fromPlaceId(placeId);
    const location = results.results[0].geometry.location;
    setValue(`geoLocations.${index}.location`, location);
  };

  const editUserMutation = useMutation({
    mutationFn: async (userEdit: UserEdit) =>
      await updateUser({
        data: {
          ...userEdit,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile", authUser?.id],
      }); // Invalidate the query
      navigate(`/users/me`);
    },
  });

  const onSubmit: SubmitHandler<UserEdit> = async (data) => {
    await editUserMutation.mutate(data);
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
    <div className="flex flex-1 justify-center pt-24 bg-slate-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/6 space-y-4">
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
                onChange={(value) => field.onChange(value.map((v) => v.value))}
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

        <div>
          <Label htmlFor="scopes">Bio</Label>
          <Textarea
            {...register("bio")}
            placeholder="Tell about yourself"
            className="h-52 bg-slate-50"
          />
          {errors.bio && (
            <p className="text-destructive text-sm my-1">
              {errors.bio?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="scopes">Locations</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col">
              <div className="flex items-center space-x-2">
                <p className="mr-4 font-semibold">{field.name}</p>
                <div className="flex h-full items-center">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <PenIcon className="w-4 h-4 hover:text-teal-800 transition-all -translate-y-0.5" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Edit location</AlertDialogTitle>
                        <AlertDialogDescription>
                          Update information about your location.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="locationName">Location name</Label>
                        <Input
                          {...register(`geoLocations.${index}.name` as const)}
                          placeholder="Location name"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="address">Address</Label>
                        <Controller
                          control={control}
                          name={`geoLocations.${index}.address` as const}
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
                                    <>{field.value}</>
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
                                                prediction.description
                                              );
                                              setPlaceId(prediction.place_id);
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
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => await updateLocation(index)}
                        >
                          Save
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div onClick={() => remove(index)}>
                  <TrashIcon className="w-4 h-4 hover:text-red-800 transition-all hover:cursor-pointer -translate-y-0.5" />
                </div>
              </div>
              <p>{field.address}</p>
            </div>
          ))}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"outline"} className="inline-block">
                  + Add Location
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>New location</AlertDialogTitle>
                  <AlertDialogDescription>
                    Add information about your new location.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="locationName">Location name</Label>
                  <Input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="address">Address</Label>
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
                          !address && "text-muted-foreground"
                        )}
                      >
                        {address ? <>{address}</> : <>+ Set Address</>}
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
                                    setAddress(prediction.description);
                                    setPlaceId(prediction.place_id);
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
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={appendLocation}>
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* <ErrorMessage message={errors.geoLocations?.} /> */}
        </div>
        <div className="flex flex-1 justify-end space-x-2">
          <Button variant={"outline"}>Cancel</Button>
          <Button>Save</Button>
        </div>
      </form>
    </div>
  );
}
