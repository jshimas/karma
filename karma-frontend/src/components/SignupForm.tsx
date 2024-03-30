import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Input } from "./ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { getAllOrganizations } from "../api/organizationApi";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { Button } from "./ui/Button";
import { useAuth } from "../hooks/useAuth";
import {
  getGoogleSignupRedirectUrl,
  validateRegistrationToken,
} from "../api/authApi";
import { useToast } from "./ui/Toast/UseToast";
import { Card } from "./ui/Card";

export default function SignupForm() {
  const { setUserStatus } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<AxiosError | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams);
  const registrationToken = localStorage.getItem("registrationToken");
  const navigate = useNavigate();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreate>({
    resolver: zodResolver(UserCreateSchema),
  });

  const {
    data: organizations,
    isPending,
    isError,
    error: errorFetchOrganizations,
  } = useQuery({
    queryKey: ["organizationList"],
    queryFn: async () => await getAllOrganizations({}),
  });

  const {
    data: redirectUrl,
    isPending: isPendingGoogle,
    isError: isErrorGoogle,
    error: errorFetchGoogleUrl,
  } = useQuery({
    queryKey: ["googleRedirectUrl"],
    queryFn: async () => await getGoogleSignupRedirectUrl({}),
  });

  const onSubmit: SubmitHandler<UserCreate> = async (data) => {
    try {
      localStorage.removeItem("registrationToken");
      await createUser({
        data: {
          ...data,
          organizationId:
            data.role === "organizer" ? data.organizationId : undefined,
        },
        params: { token: registrationToken! },
      });
      setUserStatus("idle");
      toast({
        title: "Account created",
        description: "You have successfully created an account.",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error);
      }
    }
  };

  const openGoogleAuthorizationWindow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl.redirectUrl;
    }
  };

  (async () => {
    if (queryParams?.token) {
      const validation = await validateRegistrationToken({
        params: { token: queryParams.token },
      });
      if (!validation.valid) {
        return <Card>{validation.message}</Card>;
      } else {
        localStorage.setItem("registrationToken", queryParams.token);
      }
    }
  })();

  if (isPending || isPendingGoogle) {
    return <SpinnerIcon />;
  }

  if (isError || isErrorGoogle) {
    return (
      <p>{errorFetchOrganizations?.message || errorFetchGoogleUrl?.message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-80 flex flex-col">
      <Button
        type="button"
        variant={"outline"}
        className="h-14 mb-2"
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
        <div>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="organizer">Organizator</SelectItem>
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
        {watch("role") === "organizer" && (
          <div>
            <Controller
              control={control}
              name="organizationId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((organization) => (
                      <SelectItem value={organization.id}>
                        {organization.name}
                      </SelectItem>
                    ))}
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
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <SpinnerIcon /> : "Sign up"}
        </Button>
        {error && (
          <p className="text-destructive text-sm my-1">{error?.message}</p>
        )}
      </div>

      <p className="text-slate-600 text-sm mt-2 text-center">
        Already have an account?
        <Link to={"/login"}>
          <Button variant={"link"}>Log in here</Button>
        </Link>
      </p>
    </form>
  );
}
