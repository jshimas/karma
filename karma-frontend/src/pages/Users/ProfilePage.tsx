import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/usersApi";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../../components/Badge";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import PenIcon from "../../assets/icons/PenIcon";
import MyGoogleMap from "../../components/MyGoogleMap";
import { Marker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import { format } from "date-fns";
import { printTimeDifference } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { getCertificate, updateInvitation } from "../../api/activityApi";
import ErrorMessage from "../../components/ErrorMessage";
import { Participation } from "../../models/Participation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/Avatar";
import StarIcon from "../../assets/icons/StarIcon";

type tabType = "participations" | "invitations" | "acknowledgements";
type participationStatus =
  | "Upcoming"
  | "In progress"
  | "Awaiting reward"
  | "Completed";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams);
  const [activeTab, setActiveTab] = useState<tabType>(
    queryParams.invitationId ? "invitations" : "participations"
  );
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", currentUser?.id],
    queryFn: async () => await getCurrentUser({}),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTabChange = (value: any) => {
    setActiveTab(value);
  };

  const updateInvitationMutation = useMutation({
    mutationFn: async (params: {
      participationId: string;
      organizationId: string;
      activityId: string;
      data: {
        isConfirmed: boolean;
        cancelPartnership: boolean;
      };
    }) => await updateInvitation({ data: params.data, params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", currentUser?.id],
      });
    },
  });

  const getCetificateLinkMutation = useMutation({
    mutationFn: async (params: {
      organizationId: string;
      activityId: string;
      participationId: string;
    }) => await getCertificate({ params }),
    onSuccess: (data) => {
      if (data?.certificateLink) {
        window.open(data?.certificateLink, "_blank");
      }
    },
  });

  const onAcceptInvitation = async (
    organizationId: string,
    activityId: string,
    participationId: string
  ) => {
    await updateInvitationMutation.mutate({
      participationId: participationId,
      organizationId,
      activityId,
      data: {
        isConfirmed: true,
        cancelPartnership: false,
      },
    });
    if (updateInvitationMutation.isSuccess) {
      setSearchParams({});
    }
  };

  const onRejectInvitation = async (
    organizationId: string,
    activityId: string,
    participationId: string
  ) => {
    await updateInvitationMutation.mutate({
      participationId: participationId,
      organizationId,
      activityId,
      data: {
        isConfirmed: false,
        cancelPartnership: false,
      },
    });
    if (updateInvitationMutation.isSuccess) {
      setSearchParams({});
    }
  };

  const onCancelPartnership = async (
    organizationId: string,
    activityId: string,
    participationId: string
  ) => {
    await updateInvitationMutation.mutate({
      participationId: participationId,
      organizationId,
      activityId,
      data: {
        isConfirmed: false,
        cancelPartnership: true,
      },
    });
    if (updateInvitationMutation.isSuccess) {
      setSearchParams({});
    }
  };

  const participationStatus = (
    participation: Participation
  ): participationStatus => {
    if (participation.startOfActivity > new Date()) {
      return "Upcoming";
    } else if (
      participation.startOfActivity < new Date() &&
      participation.endOfActivity > new Date()
    ) {
      return "In progress";
    } else if (
      participation.endOfActivity < new Date() &&
      !participation.karmaPoints
    ) {
      return "Awaiting reward";
    } else {
      return "Completed";
    }
  };

  let totalKarmaPoints = 0;
  if (user?.participations) {
    totalKarmaPoints = user?.participations.reduce(
      (acc, participation) =>
        participation.karmaPoints ? acc + participation.karmaPoints : acc,
      0
    );
  }

  const map = useMap();
  useEffect(() => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      user?.geoLocations?.forEach((location) => {
        if (location) {
          bounds.extend(location.location);
        }
      });
      map.fitBounds(bounds);
      const mapZoom = map.getZoom();
      if (mapZoom) {
        map.setZoom(mapZoom > 13 ? 13 : mapZoom);
      } else {
        map.setZoom(13);
      }
    }
  }, [user?.geoLocations, map]);

  const markers = useMemo(
    () =>
      user?.geoLocations?.map((location) => (
        <Marker key={location.id} position={location.location} />
      )),
    [user?.geoLocations]
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
    <div className="bg-slate-50 flex flex-1 ">
      <div className="w-3/5 mt-24 flex justify-center">
        <div className="w-4/5 flex flex-col space-y-8">
          <div className="flex space-x-10">
            <div className="">
              <div className="flex flex-col mb-2">
                <div className="flex flex-col items-center">
                  <Avatar className="aspect-square h-32 w-32 mb-4">
                    <AvatarImage
                      src={user?.imageUrl ?? undefined}
                      alt="@shadcn"
                    />
                    <AvatarFallback className="text-2xl">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-500 text-sm mb-2">
                    {"("}
                    {user?.email}
                    {")"}
                  </p>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center space-x-1">
                      <p>Karma Points</p>
                      <StarIcon className="w-5 h-5 -translate-y-0.5" />
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">Total: </span>
                      <span className="">{totalKarmaPoints}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Balance: </span>
                      <span className="">{user.karmaPoints}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant={"secondary"}
                onClick={() => navigate(`/users/me/edit`)}
                className="w-full"
              >
                <div className="flex space-x-2 items-center">
                  <PenIcon className="w-4 h-4" />
                  <p>Edit profile</p>
                </div>
              </Button>
            </div>

            <div className="">
              <h2 className="text-2xl mb-2 font-semibold">About</h2>
              <div className="mb-2">
                <ul className="flex flex-wrap">
                  {user.scopes.map((scope) => (
                    <li key={scope} className="mr-1">
                      <Badge>{scope}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-justify mb-2">{user.bio}</p>
              <div className="mb-4">
                <p className="font-semibold">Your locations</p>
                <ul className="flex space-x-2">
                  {user.geoLocations?.map((location) => (
                    <li key={location.id} className="">
                      <div className="flex space-x-2 items-center">
                        <MapPinIcon className="w-5 h-5" />
                        <p>{location.name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="participations">Participations</TabsTrigger>
                <TabsTrigger value="invitations">
                  <div className="flex space-x-2 items-center">
                    <p>Invitations</p>
                    {user.participations?.some(
                      (p) => !p.dateOfConfirmation
                    ) && <span className="h-2 w-2 bg-teal-700 rounded-full" />}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="acknowledgements">
                  Acknowledgements
                </TabsTrigger>
              </TabsList>
              <TabsContent value="participations">
                <Card>
                  <CardContent className="pt-4">
                    {user.participations?.filter((p) => p.isConfirmed)
                      .length === 0 ? (
                      <p className="text-slate-400 text-sm text-center">
                        You have not participated in or have any upcoming
                        activities yet.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Time assigned
                            </TableHead>
                            <TableHead className="text-right">
                              Certificate
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user?.participations
                            ?.filter((p) => p.isConfirmed)
                            .map((participation) => (
                              <TableRow key={participation.id}>
                                <TableCell>
                                  <Link
                                    to={`/organizations/${participation.organizationId}/activities/${participation.activityId}`}
                                  >
                                    <p className="font-semibold hover:underline hover:underline-offset-4">
                                      {participation.activityName}
                                    </p>
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  {format(
                                    participation.startOfActivity,
                                    "MMM d HH:mm"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {participationStatus(participation)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {participation.karmaPoints
                                    ? participation.karmaPoints
                                    : "-"}
                                </TableCell>
                                {participationStatus(participation) ===
                                "Completed" ? (
                                  <TableCell className="text-right">
                                    <Button
                                      variant={"link"}
                                      className="p-0 h-0"
                                      onClick={() => {
                                        getCetificateLinkMutation.mutate({
                                          organizationId:
                                            participation.organizationId,
                                          activityId: participation.activityId,
                                          participationId: participation.id,
                                        });
                                      }}
                                    >
                                      {getCetificateLinkMutation.isPending ? (
                                        <SpinnerIcon className="h-4 w-4 p-0 m-0" />
                                      ) : (
                                        <p>Claim</p>
                                      )}
                                    </Button>
                                  </TableCell>
                                ) : (
                                  <TableCell className="text-right">
                                    -
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="invitations">
                <Card>
                  <CardContent className="pt-4">
                    {user.participations?.filter((p) => !p.dateOfConfirmation)
                      .length === 0 ? (
                      <p className="text-slate-400 text-sm text-center">
                        You don't have any invitations.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.participations
                            ?.filter((p) => !p.dateOfConfirmation)
                            .map((participation) => (
                              <>
                                <TableRow
                                  className="cursor-pointer"
                                  key={participation.id}
                                  onClick={() =>
                                    setSearchParams({
                                      invitationId: participation.id,
                                    })
                                  }
                                >
                                  <TableCell className="">
                                    {participation.organizationName}
                                  </TableCell>
                                  <TableCell>
                                    {participation.activityName}
                                  </TableCell>
                                  <TableCell>
                                    {format(
                                      participation.startOfActivity,
                                      "MMM d HH:mm"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {printTimeDifference(
                                      participation.startOfActivity,
                                      participation.endOfActivity
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {!participation.dateOfConfirmation
                                      ? "Awaiting"
                                      : participation.isConfirmed
                                      ? "Confirmed"
                                      : "Rejected"}
                                  </TableCell>
                                </TableRow>
                                <Dialog
                                  open={
                                    queryParams.invitationId ===
                                    participation.id
                                  }
                                  onOpenChange={() => setSearchParams({})}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Invitation to{" "}
                                        {participation.activityName}
                                      </DialogTitle>
                                      <DialogDescription>
                                        You have been invited to participate in
                                        the activity. Would you like to accept
                                        the invitation?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mb-2">
                                      <div className="flex space-x-1">
                                        <span className="font-semibold">
                                          Organization:
                                        </span>{" "}
                                        <Link
                                          to={`/organizations/${participation.organizationId}`}
                                        >
                                          <p className="hover:underline hover:underline-offset-4">
                                            {participation.organizationName}
                                          </p>
                                        </Link>
                                      </div>
                                      <div className="flex space-x-1">
                                        <span className="font-semibold">
                                          Activity:
                                        </span>{" "}
                                        <Link
                                          to={`/organizations/${participation.organizationId}/activities/${participation.activityId}`}
                                        >
                                          <p className="hover:underline hover:underline-offset-4">
                                            {participation.activityName}
                                          </p>
                                        </Link>
                                      </div>
                                      <div>
                                        <span className="font-semibold">
                                          Start time:
                                        </span>{" "}
                                        {format(
                                          participation.startOfActivity,
                                          "MMM d HH:mm"
                                        )}
                                      </div>
                                      <div>
                                        <span className="font-semibold">
                                          Duration:
                                        </span>{" "}
                                        {printTimeDifference(
                                          participation.startOfActivity,
                                          participation.endOfActivity
                                        )}
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <div className="flex flex-1 flex-col space-y-2">
                                        {updateInvitationMutation.isError && (
                                          <ErrorMessage
                                            message={
                                              updateInvitationMutation.error
                                                .message
                                            }
                                          ></ErrorMessage>
                                        )}
                                        <div className="flex flex-1 space-x-4">
                                          <Button
                                            variant={"secondary"}
                                            onClick={async () =>
                                              await onCancelPartnership(
                                                participation.organizationId,
                                                participation.activityId,
                                                participation.id
                                              )
                                            }
                                          >
                                            Cancel partnership
                                          </Button>
                                          <Button
                                            variant={"destructive"}
                                            className="w-1/3"
                                            onClick={async () =>
                                              await onRejectInvitation(
                                                participation.organizationId,
                                                participation.activityId,
                                                participation.id
                                              )
                                            }
                                          >
                                            Reject
                                          </Button>
                                          <Button
                                            className="w-2/3"
                                            onClick={async () =>
                                              await onAcceptInvitation(
                                                participation.organizationId,
                                                participation.activityId,
                                                participation.id
                                              )
                                            }
                                          >
                                            Accept
                                          </Button>
                                        </div>
                                        <p className="text-slate-400 text-xs">
                                          By canceling the partnership you'll
                                          stop recieving invitations from this
                                          organization.
                                        </p>
                                      </div>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="acknowledgements">
                <Card>
                  <CardContent className="pt-4">
                    {user.acknowledgements?.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center">
                        You don't have any acknowledgements yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {user.acknowledgements?.map((ack) => (
                          <div key={ack.id} className="">
                            <div className="flex flex-1 justify-between items-center">
                              <div className="flex space-x-4 items-center">
                                <Link
                                  to={`/organizations/${ack.organizationId}`}
                                >
                                  <p className="font-semibold hover:underline hover:underline-offset-4">
                                    {ack.organizationName}
                                  </p>
                                </Link>
                                <Link
                                  to={`/organizations/${ack.organizationId}/activities/${ack.activityId}`}
                                >
                                  <p className="text-slate-500 text-sm hover:underline hover:underline-offset-4">
                                    {"("}
                                    {ack.activityName}
                                    {")"}
                                  </p>
                                </Link>
                              </div>
                              <p className="text-slate-500 text-xs">
                                {format(ack.createdAt, "yyyy-MM-dd")}
                              </p>
                            </div>
                            <p className=" italic">{ack.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {getCetificateLinkMutation.isError && (
              <ErrorMessage message={getCetificateLinkMutation.error.message} />
            )}
          </div>
        </div>
      </div>

      <div className="w-2/5 h-full bg-teal-200 relative">
        <MyGoogleMap center={{ lat: 54.9005, lng: 23.92 }} zoom={13}>
          {markers}
        </MyGoogleMap>
      </div>
    </div>
  );
}
