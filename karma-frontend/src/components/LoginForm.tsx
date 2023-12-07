import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Login, LoginSchema } from "../models/Authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api/authApi";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { getCurrentUser } from "../api/usersApi";
import { Role } from "../global";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<Login> = async (data) => {
    setLoading(true);
    try {
      const { accessToken: token, refreshToken } = await login({ data });
      Cookies.set("jwt", token);
      Cookies.set("refreshToken", refreshToken);

      const user = await getCurrentUser({});
      console.log("User after login", user);
      authLogin({ ...user, role: user.role.toLowerCase() as Role });

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full -translate-y-1/2">
        <div className="flex justify-center mb-10">
          <h2 className="text-3xl text-slate-900">Log in</h2>
        </div>
        <form className="space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-slate-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500  focus:ring-2  sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-slate-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500  focus:ring-2  sm:text-sm"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none "
          >
            {loading ? (
              <img
                src="src/assets/spinner.svg"
                className="animate-spin text-white inline w-4 h-4"
                alt="loading-spinner"
              />
            ) : (
              "Log in"
            )}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>

        <p className="text-slate-600 text-sm text-center">
          New to Karma?
          <Link to={"/signup"}>
            <Button variant={"link"}>Sign up now</Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
