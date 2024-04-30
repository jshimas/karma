import {
  SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { Input } from "./ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserCreate, UserCreateSchema } from "../models/Users";
import { createUser } from "../api/usersApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { useQuery } from "@tanstack/react-query";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { Button } from "./ui/Button";
import { useAuth } from "../hooks/useAuth";
import {
  getGoogleSignupRedirectUrl,
  validateRegistrationToken,
} from "../api/authApi";
import { useToast } from "./ui/Toast/UseToast";
import { Card } from "./ui/Card";
import MultipleSelector, { Option } from "./ui/MultipleSelector";
import { Label } from "./ui/Label";
import ErrorMessage from "./ErrorMessage";
import { Textarea } from "./ui/TextArea";
import { setDefaults, fromPlaceId, GeocodeOptions } from "react-geocode";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
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
} from "./ui/Dialog";
import PenIcon from "../assets/icons/PenIcon";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { cn } from "../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/Command";
import TrashIcon from "../assets/icons/TrashIcon";
import LongArrowRight from "../assets/icons/LongArrowRight";

const SCOPE_OPTIONS: Option[] = [
  { label: "healthcare", value: "healthcare" },
  { label: "education", value: "education" },
  { label: "sports", value: "sports" },
  { label: "culture", value: "culture" },
  { label: "community", value: "community" },
  { label: "animals", value: "animals" },
];

export default function SignupForm() {
  const { setUserStatus } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [userEditForm, setUserEditForm] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");
  const [tokenViolation, setTokenViolation] = useState<string>("");
  const registrationToken = localStorage.getItem("registrationToken");
  const navigate = useNavigate();
  const {
    watch,
    register,
    control,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreate>({
    resolver: zodResolver(UserCreateSchema),
  });

  const {
    data: redirectUrl,
    isPending: isPendingGoogle,
    isError: isErrorGoogle,
    error: errorFetchGoogleUrl,
  } = useQuery({
    queryKey: ["googleRedirectUrl"],
    queryFn: async () =>
      await getGoogleSignupRedirectUrl({ data: { token: registrationToken } }),
  });

  const handleContinue = async () => {
    const valid = await trigger([
      "firstName",
      "lastName",
      "email",
      "role",
      "password",
      "passwordConfirm",
    ]);

    if (valid) {
      setUserEditForm(true);
    }
  };

  const onSubmit: SubmitHandler<UserCreate> = async (data) => {
    try {
      localStorage.removeItem("registrationToken");
      await createUser({
        data: {
          ...data,
          token: registrationToken!,
        },
      });
      setUserStatus("idle");
      navigate("/login");
      toast({
        title: "Account created",
        description: "You have successfully created an account.",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error.response?.data.message);
      }
    }
  };

  const openGoogleAuthorizationWindow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl.redirectUrl;
    }
  };

  const queryParams = Object.fromEntries(searchParams);

  useEffect(() => {
    const fetchValidation = async () => {
      if (queryParams?.token) {
        try {
          const validation = await validateRegistrationToken({
            params: { token: queryParams.token },
          });
          if (!validation.valid && validation.message) {
            setTokenViolation(validation.message);
          } else {
            localStorage.setItem("registrationToken", queryParams.token);
            setValue("role", "organizer");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchValidation();
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "geoLocations",
  });

  const [openAddressSearch, setOpenAddressSearch] = useState(false);

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    usePlacesService({
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

  if (isPendingGoogle) {
    return <SpinnerIcon />;
  }

  if (isErrorGoogle) {
    return <p>{errorFetchGoogleUrl?.message}</p>;
  }

  if (tokenViolation) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-xl font-semibold">Token error</h2>
        <Card className="bg-red-200 px-4 py-2">
          <ErrorMessage message={tokenViolation} />
        </Card>
        <Button variant={"link"}>
          <Link to="/">Go to Karma</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-80 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign up</h2>
        {!userEditForm ? (
          <div>
            <Button
              type="button"
              variant={"outline"}
              className="h-14 mb-2 w-full"
              onClick={() => openGoogleAuthorizationWindow()}
            >
              <img
                className="h-10 mr-1"
                src="src\assets\google-icon.svg"
                alt="google icon"
              />
              <p className="font-semibold">Continue with Google</p>
            </Button>
            <div className="mt-4 relative text-center after:content-['or'] text-slate-800 after:bg-slate-50 after:px-3 after:relative after:bottom-4">
              <div className="border-t-2 "></div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First name
                </label>
                <Input {...register("firstName")} placeholder="First name" />
                {errors.firstName && (
                  <p className="text-destructive text-sm my-1">
                    {errors.firstName?.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last name
                </label>
                <Input {...register("lastName")} placeholder="Last name" />
                {errors.lastName && (
                  <p className="text-destructive text-sm my-1">
                    {errors.lastName?.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Input {...register("email")} placeholder="Email" />
                {errors.email && (
                  <p className="text-destructive text-sm my-1">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              {!queryParams?.token && (
                <div>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="volunteer">Volunteer</SelectItem>
                          <SelectItem value="organizer">Organizer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-destructive text-sm my-1">
                      {errors.role?.message}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  {...register("password")}
                  placeholder="Password"
                  type="password"
                />
                {errors.password && (
                  <p className="text-destructive text-sm my-1">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="passwordConfirm" className="sr-only">
                  Confirm password
                </label>
                <Input
                  {...register("passwordConfirm")}
                  placeholder="Confirm password"
                  type="password"
                />
                {errors.passwordConfirm && (
                  <p className="text-destructive text-sm my-1">
                    {errors.passwordConfirm?.message}
                  </p>
                )}
              </div>
              {/* <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <SpinnerIcon /> : "Sign up"}
            </Button> */}
              {watch("role") === "organizer" || queryParams.token ? (
                <Button type="submit">Sign up</Button>
              ) : (
                <Button onClick={handleContinue} type="button">
                  <p>Continue</p>
                  <LongArrowRight />
                </Button>
              )}

              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div>
              {/* <Label htmlFor="scopes">Scopes</Label> */}
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

            <div>
              {/* <Label htmlFor="scopes">Bio</Label> */}
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
              {/* <Label htmlFor="scopes">Locations</Label> */}
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
                              {...register(
                                `geoLocations.${index}.name` as const
                              )}
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
                                          <CommandEmpty>
                                            No results.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {placePredictions.map(
                                              (prediction) => (
                                                <CommandItem
                                                  value={prediction.description}
                                                  key={prediction.place_id}
                                                  onSelect={() => {
                                                    field.onChange(
                                                      prediction.description
                                                    );
                                                    setPlaceId(
                                                      prediction.place_id
                                                    );
                                                    setOpenAddressSearch(false);
                                                  }}
                                                >
                                                  {prediction.description}
                                                </CommandItem>
                                              )
                                            )}
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
                    <Button variant={"outline"} className="inline-block w-full">
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
            </div>

            <div className="flex flex-1 space-x-2">
              <Button
                variant="outline"
                type="button"
                className="w-1/4"
                onClick={() => setUserEditForm(false)}
              >
                Back
              </Button>
              <Button type="submit" className="w-3/4" disabled={isSubmitting}>
                Sign up
              </Button>
            </div>
            {error && <ErrorMessage message={error} />}
          </div>
        )}

        <p className="text-slate-600 text-sm mt-2 text-center">
          Already have an account?
          <Link to={"/login"}>
            <Button variant={"link"}>Log in here</Button>
          </Link>
        </p>
      </form>
    </div>
  );
}
