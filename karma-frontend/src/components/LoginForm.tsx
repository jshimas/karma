import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Login, LoginSchema } from "../models/Authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getGoogleLoginRedirectUrl,
  login,
  loginGoogleUser,
} from "../api/authApi";
import { AxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/Button";
import { getCurrentUser } from "../api/usersApi";
import { Role } from "../global";
import { useAuth } from "../hooks/useAuth";
import { Input } from "./ui/Input";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { setUserStatus } = useAuth();
  const [error, setError] = useState<AxiosError | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const authCode = searchParams.get("code");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    data: redirectUrl,
    isPending: isPendingGoogle,
    isError: isErrorGoogle,
    error: errorFetchGoogleUrl,
  } = useQuery({
    queryKey: ["googleRedirectUrl"],
    queryFn: async () => await getGoogleLoginRedirectUrl({}),
  });

  const openGoogleAuthorizationWindow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl.redirectUrl;
    }
  };

  const onSubmit: SubmitHandler<Login> = async (data) => {
    try {
      const { accessToken: token } = await login({ data });
      Cookies.set("jwt", token);

      const user = await getCurrentUser({});
      console.log("User after login", user);
      authLogin({ ...user, role: user.role.toLowerCase() as Role });

      if (user.role.toLowerCase() === "organizer") {
        navigate(`/organizations/${user.organizationId}`);
      } else navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error);
      }
    }
  };

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        if (!authCode) return;

        setLoginLoading(true);
        const response = await loginGoogleUser({ params: { code: authCode } });
        Cookies.set("jwt", response.accessToken);

        setUserStatus("loading");
        const user = await getCurrentUser({});
        console.log("Authenticated user after Google signup", user);
        authLogin({ ...user, role: user.role.toLowerCase() as Role });

        console.log(
          "User after login",
          user.role,
          user.organizationId,
          user.role === "organizer" && !user.organizationId
        );
        if (user.role.toLowerCase() === "organizer") {
          navigate(`/organizations/${user.organizationId}`);
        } else navigate("/");
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          setLoginError(error.response?.data.message);
        }
      } finally {
        setLoginLoading(false);
      }
    };

    fetchGoogleUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPendingGoogle || loginLoading) {
    return (
      <div className="flex h-full w-full flex-1 justify-center items-center">
        <SpinnerIcon />
      </div>
    );
  }

  if (isErrorGoogle || loginError) {
    return <p>{errorFetchGoogleUrl?.message || loginError}</p>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-80 -translate-y-8">
        <div className="flex justify-center mb-4">
          <h2 className="text-2xl text-slate-900 font-semibold">Log in</h2>
        </div>
        <form className="flex flex-col mb-4" onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              disabled={isSubmitting}
              type="submit"
              className="text-md font-semibold mt-4"
            >
              {isSubmitting ? <SpinnerIcon /> : "Log in"}
            </Button>
            {error && <p className="text-red-500">Wrong credentials!</p>}
          </div>
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
