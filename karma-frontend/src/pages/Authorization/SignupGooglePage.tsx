import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createGoogleUser } from "../../api/authApi";
import Footer from "../../components/Footer";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { useEffect, useState } from "react";
import { Role } from "../../global";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import Cookies from "js-cookie";
import { getCurrentUser } from "../../api/usersApi";
import { useToast } from "../../components/ui/Toast/UseToast";
import { GoogleUserCreate, GoogleUserCreateSchema } from "../../models/Users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import LongArrowRight from "../../assets/icons/LongArrowRight";
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
} from "../../components/ui/Dialog";
import PenIcon from "../../assets/icons/PenIcon";
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
import TrashIcon from "../../assets/icons/TrashIcon";
import MultipleSelector, { Option } from "../../components/ui/MultipleSelector";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";
import { useApiIsLoaded } from "@vis.gl/react-google-maps";
import PlaceInput from "../../components/PlaceInput";
import PlaceAppendInput from "../../components/PlaceAppendInput";

const SCOPE_OPTIONS: Option[] = [
  { label: "healthcare", value: "healthcare" },
  { label: "education", value: "education" },
  { label: "sports", value: "sports" },
  { label: "culture", value: "culture" },
  { label: "community", value: "community" },
  { label: "animals", value: "animals" },
];

export default function SignupGooglePage() {
  const [searchParams] = useSearchParams();
  // const [userAuthError, setUserAuthError] = useState<string | null>(null);
  const [createUserError, setCreateUserError] = useState<string | null>(null);
  const [userEditForm, setUserEditForm] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { user, setUserStatus, login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const authCode = searchParams.get("code");

  const apiIsLoaded = useApiIsLoaded();
  console.log("apiIsLoaded", apiIsLoaded);
  useEffect(() => {
    if (!apiIsLoaded) return;
    setLoading(true);
  }, [apiIsLoaded]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GoogleUserCreate>({
    resolver: zodResolver(GoogleUserCreateSchema),
  });

  const role = watch("role");

  const createUser = async (
    data: GoogleUserCreate,
    registrationToken?: string
  ) => {
    try {
      setLoading(true);
      const response = await createGoogleUser({
        data: {
          ...data,
          token: registrationToken,
        },
        params: { code: authCode! },
      });

      Cookies.set("jwt", response.accessToken);
      await authenticateCurrentUser();
      toast({
        title: "Account created",
        description: "You have successfully created an organizer's account.",
      });
      if (user?.role === "organizer") {
        navigate(`/organizations/${user?.organizationId}`);
      } else {
        navigate("/activities");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setCreateUserError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const registrationToken = localStorage.getItem("registrationToken");

  useEffect(() => {
    const createOrganizerAccount = async () => {
      if (registrationToken) {
        try {
          await createUser({ role: "organizer" }, registrationToken);
          localStorage.removeItem("registrationToken");
        } catch (error) {
          console.error("Error creating organizer account:", error);
        }
      } else {
        setLoading(false);
      }
    };

    createOrganizerAccount();
  }, []);

  // send registration request
  const onSubmit: SubmitHandler<GoogleUserCreate> = async (data) => {
    await createUser(data);
  };

  const authenticateCurrentUser = async () => {
    try {
      setUserStatus("loading");
      const user = await getCurrentUser({});
      console.log("Authenticated user after Google signup", user);
      authLogin({ ...user, role: user.role.toLowerCase() as Role });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        // setUserAuthError(error.response?.data.message);
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "geoLocations",
  });

  // const [openAddressSearch, setOpenAddressSearch] = useState(false);

  console.log("rendering");
  // const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
  //   usePlacesService({
  //     apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  //   });

  // setDefaults({
  //   key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY_GEOCIDING,
  // } as GeocodeOptions);

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

  console.log("loading", loading, "isSubmitting", isSubmitting);

  if (loading) {
    <div className="mx-auto my-4 flex justify-center items-center">
      <SpinnerIcon />
    </div>;
  }

  return (
    <div className="bg-slate-50 flex flex-col h-screen font-nunito">
      <div className="p-6">
        <Link
          to={"/"}
          className="uppercase text-2xl tracking-wide font-light text-teal-900 border-b-2 border-teal-500"
        >
          Karma
        </Link>
      </div>
      <div className="h-full flex flex-col items-center gap-4 justify-center bg-gray-50 pb-40">
        {createUserError && !loading ? (
          <div className="flex flex-col items-center">
            <ErrorMessage message={createUserError} />
            <Link to={`/login?`}>
              <Button variant={"link"}>Login here</Button>
            </Link>
          </div>
        ) : (
          <>
            {!userEditForm ? (
              <h3 className="text-2xl text-center font-semibold">
                Select your role
              </h3>
            ) : (
              <div>
                <h3 className="text-2xl text-center font-semibold">
                  Finish your profile
                </h3>
                <p className="text-slate-800 text-xs text-center">
                  You can update this later
                </p>
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-[450px] justify-center "
            >
              {!userEditForm ? (
                <div className="flex flex-col gap-4">
                  <div
                    className={`p-4 border-2 rounded-md hover:bg-slate-100 hover:cursor-pointer ${
                      role === "volunteer" &&
                      "bg-slate-100 border-teal-800 hover:bg-slate-200"
                    }`}
                    onClick={() => setValue("role", "volunteer")}
                  >
                    <h4 className="text-xl font-semibold">Volunteer</h4>
                    <p>Participate in volunteer activities & gain rewards</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-md hover:bg-slate-100 hover:cursor-pointer ${
                      role === "organizer" && "bg-slate-100 border-teal-800"
                    }`}
                    onClick={() => setValue("role", "organizer")}
                  >
                    <h4 className="text-xl font-semibold">Organizer</h4>
                    <p>Manage organization & organize volunteer activities</p>
                  </div>
                  {role === "organizer" ? (
                    <Button
                      type="submit"
                      disabled={!role}
                      className="font-semibold text-md"
                    >
                      {isSubmitting ? <SpinnerIcon /> : "Sign up"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setUserEditForm(true)}
                      disabled={!role}
                      className="font-semibold text-md"
                    >
                      <p>Continue</p>
                      <LongArrowRight />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-4 flex-1">
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
                                  <AlertDialogTitle>
                                    Edit location
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Update information about your location.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex flex-col space-y-2">
                                  <Label htmlFor="locationName">
                                    Location name
                                  </Label>
                                  <Input
                                    {...register(
                                      `geoLocations.${index}.name` as const
                                    )}
                                    placeholder="Location name"
                                  />
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <Label htmlFor="address">Address</Label>
                                  <PlaceInput
                                    control={control}
                                    name={
                                      `geoLocations.${index}.address` as const
                                    }
                                    setPlaceId={setPlaceId}
                                  />
                                  {/* <Controller
                                    control={control}
                                    name={
                                      `geoLocations.${index}.address` as const
                                    }
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
                                              !field.value &&
                                                "text-muted-foreground"
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
                                                getPlacePredictions({
                                                  input: value,
                                                });
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
                                                        value={
                                                          prediction.description
                                                        }
                                                        key={
                                                          prediction.place_id
                                                        }
                                                        onSelect={() => {
                                                          field.onChange(
                                                            prediction.description
                                                          );
                                                          setPlaceId(
                                                            prediction.place_id
                                                          );
                                                          setOpenAddressSearch(
                                                            false
                                                          );
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
                                  /> */}
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () =>
                                      await updateLocation(index)
                                    }
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
                          <Button
                            variant={"outline"}
                            className="inline-block w-full"
                          >
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
                            <PlaceAppendInput
                              address={address}
                              setAddress={setAddress}
                              setPlaceId={setPlaceId}
                            />
                            {/* <Popover
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
                                  {address ? (
                                    <>{address}</>
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
                                              setAddress(
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
                            </Popover> */}
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
                    <Button
                      type="submit"
                      className="w-3/4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <SpinnerIcon /> : "Sign up"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
