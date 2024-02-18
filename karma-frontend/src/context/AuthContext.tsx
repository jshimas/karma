import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Role } from "../global";
import Cookies from "js-cookie";
import { getCurrentUser } from "../api/usersApi";
// import { refreshAccessToken } from "../api/authApi";
import { jwtDecode, JwtPayload } from "jwt-decode";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  organizationId?: string | null;
};

type Status = "idle" | "loading" | "resolved";

export type AuthContextType = {
  status: Status;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUserStatus: (status: Status) => void;
};

const initialContext = {
  status: "idle" as Status,
  user: null,
  login: () => {},
  logout: () => {},
  setUserStatus: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = Cookies.get("jwt");

      if (!token) {
        setStatus("resolved");
        return;
      }

      const jwt = jwtDecode<JwtPayload>(token);

      if (
        !user &&
        jwt &&
        jwt.exp &&
        jwt.exp * 1000 > Number(new Date()) &&
        status === "idle"
      ) {
        setStatus("loading");
        try {
          const user = await getCurrentUser({});
          login({ ...user, role: user.role.toLowerCase() as Role });
        } catch (err) {
          console.log(err);
        }
      } else if (jwt && jwt.exp && jwt.exp * 1000 < Number(new Date())) {
        console.log("Token expired. Please log in again.");
      }
      // else if (Cookies.get("refreshToken") && status === "idle") {
      //   setStatus("loading");
      //   try {
      //     Cookies.remove("jwt");
      //     const { accessToken } = await refreshAccessToken({
      //       data: { refreshToken: Cookies.get("refreshToken")! },
      //     });
      //     Cookies.set("jwt", accessToken);
      //     const user = await getCurrentUser({});
      //     login({ ...user, role: user.role.toLowerCase() as Role });
      //     console.log("refreshed access token", user);
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }

      setStatus("resolved");
    };

    fetchCurrentUser();
  }, [status, user]);

  const login = (user: User) => {
    setUser(user);
    setStatus("resolved");
  };

  const logout = () => {
    setUser(null);
    setStatus("idle");
    Cookies.remove("jwt");
    Cookies.remove("refreshToken");
  };

  const setUserStatus = (status: Status) => {
    setStatus(status);
  };

  const contextValue: AuthContextType = {
    status,
    user,
    login,
    logout,
    setUserStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
