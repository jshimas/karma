import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Input } from "./ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
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

export default function SignupForm() {
  const { setUserStatus } = useAuth();
  const [error, setError] = useState<AxiosError | null>(null);
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

  const onSubmit: SubmitHandler<UserCreate> = async (data) => {
    try {
      await createUser({
        data: {
          ...data,
          organizationId:
            data.role === "organizer" ? data.organizationId : undefined,
        },
      });
      setUserStatus("idle");
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error);
      }
    }
  };

  if (isPending) {
    return <SpinnerIcon />;
  }

  if (isError) {
    return <p>{errorFetchOrganizations?.message}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-80 flex flex-col gap-4"
    >
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </form>
  );
}
