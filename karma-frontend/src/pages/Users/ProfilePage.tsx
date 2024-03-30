import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/usersApi";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../../components/Badge";
import ClockIcon from "../../assets/icons/ClockIcon";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import PenIcon from "../../assets/icons/PenIcon";
import MyGoogleMap from "../../components/MyGoogleMap";
import { Marker } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", currentUser?.id],
    queryFn: async () => await getCurrentUser({}),
  });

  const markers = useMemo(
    () =>
      user?.geoLocations.map((location) => (
        <Marker key={location.id} position={location.location} />
      )),
    [user?.geoLocations] // Dependency array
  );

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isPending) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 flex flex-1 items-center ">
      <div className="flex space-x-10 w-1/2 px-20 2xl:px-24 ">
        <div className="">
          <div className="flex flex-col">
            <h2 className="text-2xl">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-slate-500 text-sm mb-2">
              {"("}
              {user.email}
              {")"}
            </p>
          </div>

          <div className="flex space-x-2 items-center mb-2">
            <p className="uppercase text-sm">
              Hours: <span>{user.collectedHours}</span>
            </p>
            <ClockIcon className="w-4 h-4" />
          </div>

          <div className="mb-4">
            <p>Your locations</p>
            <ul>
              {user.geoLocations.map((location) => (
                <li key={location.id} className="">
                  <div className="flex space-x-2 items-center">
                    <MapPinIcon className="w-5 h-5" />
                    <p>{location.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant={"secondary"}
            onClick={() => navigate(`/users/me/edit`)}
          >
            <div className="flex space-x-2 items-center">
              <PenIcon className="w-4 h-4" />
              <p>Edit profile</p>
            </div>
          </Button>
        </div>

        <div className="">
          <h2 className="text-xl mb-2">Bio</h2>
          <div className="mb-2">
            <ul className="flex flex-wrap">
              {user.scopes.map((scope) => (
                <li key={scope} className="mr-1">
                  <Badge>{scope}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-justify">{user.bio}</p>
        </div>
      </div>
      <div className="w-1/2 h-full bg-teal-200 relative">
        <MyGoogleMap center={{ lat: 54.9005, lng: 23.92 }} zoom={13}>
          {markers}
        </MyGoogleMap>
      </div>
    </div>
  );
}
