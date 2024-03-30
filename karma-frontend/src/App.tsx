import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ActivitiesPage from "./pages/Activities/ActivitiesPage";
import OrganizationPage from "./pages/Organizations/OrganizationPage";
import OrganizationEditPage from "./pages/Organizations/OrganizationEditPage";
import ActivityPage from "./pages/Activities/ActivityPage";
import OrganizationCreatePage from "./pages/Organizations/OrganizationCreatePage";
import ActivityCreatePage from "./pages/Activities/ActivityCreatePage";
import ActivityEditPage from "./pages/Activities/ActivityEditPage";
import OrganizationsPage from "./pages/Organizations/OrganizationsPage";
import LoginPage from "./pages/Authorization/LoginPage";
import SignupPage from "./pages/Authorization/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import SignupGooglePage from "./pages/Authorization/SignupGooglePage";
import ProfilePage from "./pages/Users/ProfilePage";
import ProfileEditPage from "./pages/Users/ProfileEditPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signup-google",
    element: <SignupGooglePage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ActivitiesPage />,
      },
      {
        path: "/activities",
        element: <ActivitiesPage />,
      },
      {
        path: "/users",
        children: [
          {
            path: "/users/me",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/users/me/edit",
            element: (
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/organizations",
        children: [
          {
            index: true,
            element: <OrganizationsPage />,
          },
          {
            path: "/organizations/:organizationId",
            element: (
              <ProtectedRoute>
                <OrganizationPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/organizations/:organizationId/edit",
            element: (
              <ProtectedRoute roles={["admin", "organizer"]}>
                <OrganizationEditPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/organizations/create",
            element: (
              <ProtectedRoute roles={["admin"]}>
                <OrganizationCreatePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/organizations/:organizationId/activities",
            children: [
              {
                path: "/organizations/:organizationId/activities/:activityId",
                element: <ActivityPage />,
              },
              {
                path: "/organizations/:organizationId/activities/create",
                element: (
                  <ProtectedRoute roles={["organizer"]}>
                    <ActivityCreatePage />
                  </ProtectedRoute>
                ),
              },
              {
                path: "/organizations/:organizationId/activities/:activityId/edit",
                element: (
                  <ProtectedRoute roles={["admin", "organizer"]}>
                    <ActivityEditPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/*",
    element: <p>Page not found</p>,
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
