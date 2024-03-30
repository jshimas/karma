import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createGoogleUser } from "../../api/authApi";
import Footer from "../../components/Footer";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { useState } from "react";
import { Role } from "../../global";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import Cookies from "js-cookie";
import { getCurrentUser } from "../../api/usersApi";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast/UseToast";

export default function SignupGooglePage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<Role>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userAuthError, setUserAuthError] = useState<string | null>(null);
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  const { setUserStatus, login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const authCode = searchParams.get("code");

  const createUser = async (registrationToken?: string) => {
    try {
      setIsSubmitting(true);
      const response = await createGoogleUser({
        data: {
          role: role as Role,
        },
        params: { code: authCode!, token: registrationToken },
      });

      Cookies.set("jwt", response.accessToken);
      await authenticateCurrentUser();
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        setCreateUserError(error.response?.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // send registration request
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createUser();
    toast({
      title: "Account created",
      description: "You have successfully created an account.",
    });
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
        setUserAuthError(error.response?.data.message);
      }
    }
  };

  const registrationToken = localStorage.getItem("registrationToken");

  (async () => {
    if (registrationToken) {
      localStorage.removeItem("registrationToken");
      await createUser(registrationToken);
      toast({
        title: "Account created",
        description: "You have successfully created an organizer's account.",
      });
    }
  })();

  if (registrationToken && isSubmitting) {
    return <SpinnerIcon />;
  }

  if (registrationToken && createUserError) {
    return (
      <Card className="bg-red-300">
        <ErrorMessage message={createUserError} />
      </Card>
    );
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
        <h3 className="text-2xl text-center font-semibold">Select your role</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div
            className={`p-4 border-2 rounded-md hover:bg-slate-100 hover:cursor-pointer ${
              role === "volunteer" &&
              "bg-slate-100 border-teal-800 hover:bg-slate-200"
            }`}
            onClick={() => setRole("volunteer")}
          >
            <h4 className="text-xl font-semibold">Volunteer</h4>
            <p>Participate in volunteer activities & gain rewards</p>
          </div>
          <div
            className={`p-4 border-2 rounded-md hover:bg-slate-100 hover:cursor-pointer ${
              role === "organizer" && "bg-slate-100 border-teal-800"
            }`}
            onClick={() => setRole("organizer")}
          >
            <h4 className="text-xl font-semibold">Organizer</h4>
            <p>Manage organization & organize volunteer activities</p>
          </div>
          <Button
            disabled={!role || isSubmitting}
            type="submit"
            className="font-semibold text-md mt-2"
          >
            {isSubmitting ? <SpinnerIcon /> : "Sign up"}
          </Button>
          {createUserError && (
            <div className="flex flex-col items-center">
              <ErrorMessage message={createUserError} />
              <Link to={"/login"}>
                <Button variant={"link"}>Log in here</Button>
              </Link>
            </div>
          )}
          {userAuthError && <ErrorMessage message={userAuthError} />}
        </form>
      </div>
      <Footer />
    </div>
  );
}
