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
import UserPage from "./pages/Users/UserPage";
import VolunteersPage from "./pages/Volunteers/VolunteersPage";
import PrizeListPage from "./pages/Prizes/PrizeListPage";
import OrganizationPrizesPage from "./pages/Prizes/OrganizationPrizesPage";
import { APIProvider } from "@vis.gl/react-google-maps";

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
        path: "/prizes",
        element: <PrizeListPage />,
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
          {
            path: "/users/:userId",
            element: (
              <ProtectedRoute>
                <UserPage />
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
            element: <OrganizationPage />,
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
              <ProtectedRoute roles={["admin", "organizer"]}>
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
          {
            path: "/organizations/:organizationId/volunteers",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute roles={["organizer"]}>
                    <VolunteersPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "/organizations/:organizationId/prizes",
            children: [
              {
                index: true,
                element: <OrganizationPrizesPage />,
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
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
        libraries={["marker", "places"]}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </APIProvider>
    </AuthProvider>
  );
}
