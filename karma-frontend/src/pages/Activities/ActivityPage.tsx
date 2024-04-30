import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  applyToActivity,
  getActivity,
  getActivityApplications,
  resolveActivity,
  reviewApplication,
  sendInvitations,
} from "../../api/activityApi";
import { Button } from "../../components/ui/Button";
import PlusIcon from "../../assets/icons/PlusIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDelete,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Textarea } from "../../components/ui/TextArea";
import { useAuth } from "../../hooks/useAuth";
import {
  createFeedback,
  deleteFeedback,
  updateFeedback,
} from "../../api/feedbackApi";
import { FeedbackEdit, FeedbackEditSchema } from "../../models/Feedback";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import {
  printTimeDifference,
  timeDifference,
  compareApplicationsByStatusAndDate,
  compareParticipationsByStatusAndDate,
  getActivityState,
} from "../../lib/utils";
import Badge from "../../components/Badge";
import { format } from "date-fns";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import ClockIcon from "../../assets/icons/ClockIcon";
import LongArrowRight from "../../assets/icons/LongArrowRight";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import MyGoogleMap from "../../components/MyGoogleMap";
import MarkerWithInfowindow from "../../components/MarkerWIthInfowindow";
import { useToast } from "../../components/ui/Toast/UseToast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Label } from "../../components/ui/Label";
import ErrorMessage from "../../components/ErrorMessage";
import { Checkbox } from "../../components/ui/Checkbox";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResolveActivity,
  ResolveActivityValidationSchema,
} from "../../models/Activity";
import { TimePickerDemo } from "../../components/ui/TimePicker/TimePicker";
import UserGroupIcon from "../../assets/icons/UserGroupIcon";
import { Rating } from "../../components/ui/Rating";
import { Heart } from "lucide-react";
import ActivityStatusBadge from "../../components/ActivityStatusBadge";
import BackButton from "../../components/BackButton";

type tabType = "participants" | "applications" | "invitations";

export default function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectAllVolunteers, setSelectAllVolunteers] = useState(false);
  const [selectedVolunteersIds, setSelectedVolunteersIds] = useState<string[]>(
    []
  );
  const [invitationsOpen, setInvitationsOpen] = useState<boolean>(false);
  const [editFeedbackOpen, setEditFeedbackOpen] = useState<boolean>(false);
  const queryParams = Object.fromEntries(searchParams);
  const [application, setApplication] = useState("");
  const [activeTab, setActiveTab] = useState<tabType>(
    queryParams.applicationId ? "applications" : "participants"
  );
  const { organizationId, activityId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { handleSubmit, control } = useForm<ResolveActivity>({
    resolver: zodResolver(ResolveActivityValidationSchema),
  });

  const {
    handleSubmit: handleSubmitFeedback,
    setValue,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<FeedbackEdit>({
    resolver: zodResolver(FeedbackEditSchema),
  });

  const { fields, append } = useFieldArray({
    control,
    name: "volunteerEarnings",
  });

  const {
    data: activity,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["activity", "detail", activityId],
    queryFn: async () =>
      await getActivity({
        params: { organizationId: organizationId!, activityId: activityId! },
      }),
  });

  if (activity?.participations && fields.length === 0) {
    const defaultTime = timeDifference(activity.startDate, activity.endDate);
    activity?.participations
      ?.filter((p) => p.isConfirmed)
      ?.forEach((p) => {
        const date = new Date();
        date.setMinutes(defaultTime.minutes);
        date.setHours(defaultTime.hours);
        date.setSeconds(defaultTime.days); // hacky short time solution
        append({
          volunteerId: p.userId,
          date,
        });
      });
  }

  const hasApplied = activity?.applications?.some(
    (application) => application.userId === user?.id
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTabChange = (value: any) => {
    setActiveTab(value);
  };

  const toggleSelectAllVolunteers = () => {
    setSelectAllVolunteers(!selectAllVolunteers);
    if (!selectAllVolunteers) {
      setSelectedVolunteersIds(activity?.volunteers?.map((v) => v.id) ?? []);
    } else {
      setSelectedVolunteersIds([]);
    }
  };

  const toggleVolunteerSelection = (volunteerId: string) => {
    if (selectedVolunteersIds.includes(volunteerId)) {
      setSelectedVolunteersIds(
        selectedVolunteersIds.filter((volunteer) => volunteer !== volunteerId)
      );
    } else {
      setSelectedVolunteersIds([...selectedVolunteersIds, volunteerId]);
    }
  };

  const applyToActivityMutation = useMutation({
    mutationFn: async () =>
      await applyToActivity({
        data: {
          motivation: application,
        },
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      });
      toast({
        title: "Application sent",
        description: "You have successfully applied to this activity",
      });
    },
  });

  const resolveActivityMutation = useMutation({
    mutationFn: async (data: ResolveActivity) =>
      await resolveActivity({
        data: {
          volunteerEarnings: data.volunteerEarnings.map((v) => ({
            volunteerId: v.volunteerId,
            hours: v.date.getHours() + v.date.getSeconds() * 8, // seconds are used as days (8 hours work day)
            minutes: v.date.getMinutes(),
          })),
        },
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      });
      toast({
        title: "Activity resolved",
        description: "You have successfully resolved this activity",
      });
    },
  });

  const reviewApplicationMutations = useMutation({
    mutationFn: async (params: {
      applicationId: string;
      isApproved: boolean;
    }) =>
      await reviewApplication({
        data: {
          isApproved: params.isApproved,
        },
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
          applicationId: params.applicationId,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      }),
  });

  const acceptApplication = async (applicationId: string) => {
    await reviewApplicationMutations.mutateAsync({
      applicationId,
      isApproved: true,
    });
    if (reviewApplicationMutations.isSuccess) {
      setSearchParams({});
    }
  };

  const rejectApplication = async (applicationId: string) => {
    await reviewApplicationMutations.mutateAsync({
      applicationId,
      isApproved: false,
    });
    if (reviewApplicationMutations.isSuccess) {
      setSearchParams({});
    }
  };

  const sendInvitationsMutation = useMutation({
    mutationFn: async (params: {
      activityId: string;
      organizationId: string;
      userIds: string[];
    }) =>
      await sendInvitations({
        data: {
          userIds: params.userIds,
        },
        params: {
          organizationId: params.organizationId,
          activityId: params.activityId,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      });
      toast({
        title: "Invitations sent",
        description:
          "You have successfully invited volunteers to this activity",
      });
    },
  });

  const onSendInvitations = async (
    activityId: string,
    organizationId: string,
    userIds: string[]
  ) => {
    await sendInvitationsMutation.mutateAsync({
      activityId,
      organizationId,
      userIds,
    });

    if (!sendInvitationsMutation.isError) {
      setInvitationsOpen(false);
    }
  };

  const createFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: FeedbackEdit) =>
      await createFeedback({
        data: newFeedback,
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      }),
  });

  type EditFeedbackParams = {
    rating: number;
    comment: string;
    feedbackId: string;
  };

  const editFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: EditFeedbackParams) =>
      await updateFeedback({
        data: {
          ...newFeedback,
        },
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
          feedbackId: newFeedback.feedbackId,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      }),
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (params: { feedbackId: string }) =>
      await deleteFeedback({
        params: {
          organizationId: organizationId!,
          activityId: activityId!,
          feedbackId: params.feedbackId,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      }),
  });

  const marker = useMemo(
    () =>
      activity?.geoLocation ? (
        <MarkerWithInfowindow
          key={activity.id}
          activity={activity}
          isOpen={true}
          showButton={false}
        />
      ) : (
        <></>
      ),
    [activity]
  );

  if (isPending) {
    return <SpinnerIcon />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex flex-1">
      <div className="w-3/5 pt-10 px-28 overflow-y-auto h-[calc(100vh)]">
        <BackButton />
        <div className="flex space-x-4 items-center">
          <h2 className="text-3xl font-semibold">{activity.name}</h2>
          <ActivityStatusBadge activity={activity} />
        </div>
        <div className="mb-1">
          <div className="text-slate-400">
            By{" "}
            <Link
              to={`/organizations/${activity.organizationId}`}
              className="hover:underline hover:underline-offset-4"
            >
              {activity.organizationName}
            </Link>
          </div>
        </div>
        <div className="mb-4 space-x-1">
          {activity.scopes?.map((scope) => (
            <Badge key={scope}>{scope}</Badge>
          ))}
        </div>
        <div className="flex flex-col space-y-1 mb-4">
          <div className="flex space-x-2 items-center">
            <MapPinIcon className="w-5 h-5" />
            <p className="font-semibold">
              {activity.address.split(",").slice(0, 2).join(",")}
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <CalendarIcon className="w-5 h-5" />
            <p className="font-semibold">
              {format(activity.startDate, "yyyy-MM-dd")}
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <ClockIcon className="w-5 h-5" />
            <p className="font-semibold">
              {format(activity.startDate, "HH:mm")}
            </p>
            <LongArrowRight className="w-5 h-5" />
            <p className="font-semibold">{format(activity.endDate, "HH:mm")}</p>

            <p className="font-semibold">
              {"("}
              {printTimeDifference(activity.startDate, activity.endDate)}
              {")"}
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <UserGroupIcon className="w-5 h-5" />
            <p className="font-semibold">
              {activity.participations?.filter
                ? activity.participations?.filter((p) => p.isConfirmed).length
                : 0}
              {"/"}
              {activity.volunteersNeeded} volunteers
            </p>
          </div>
        </div>

        <p className="mb-8">{activity.description}</p>
        {!user && getActivityState(activity) === "upcoming" && (
          <div className="flex justify-center mb-8">
            <Button disabled className="w-3/5">
              Login to Karma to apply
            </Button>
          </div>
        )}
        {user?.role === "volunteer" &&
          getActivityState(activity) === "upcoming" &&
          hasApplied && (
            <div className="flex justify-center mb-8">
              <Button disabled className="w-3/5">
                Application sent
              </Button>
            </div>
          )}
        {user?.role === "volunteer" &&
          getActivityState(activity) === "upcoming" &&
          !hasApplied && (
            <div className="flex justify-center mb-8">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-3/5">Apply</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Motivation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Write why you want to participate in this activity
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    value={application}
                    onChange={(event) => setApplication(event.target.value)}
                    placeholder="Write your motivation here"
                    className="h-44"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () =>
                        await applyToActivityMutation.mutateAsync()
                      }
                    >
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

        {user?.role === "organizer" && (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="participants">Paticipants</TabsTrigger>
              <TabsTrigger value="applications">
                <div className="flex space-x-2 items-center">
                  <p>Applications</p>
                  {activity.applications?.some((a) => !a.dateOfApproval) && (
                    <span className="h-2 w-2 bg-teal-700 rounded-full" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            <TabsContent value="participants">
              <Card>
                <CardContent className="space-y-2 pt-4">
                  {activity.participations?.filter((p) => p.isConfirmed)
                    .length === 0 ? (
                    <p className="text-slate-400 text-sm text-center">
                      There are no registered participants for this activity.
                    </p>
                  ) : (
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">Volunteer</TableHead>
                            <TableHead>Email</TableHead>
                            {(getActivityState(activity) === "finished" && (
                              <TableHead className="text-right">
                                Days, Hours & Minutes worked
                              </TableHead>
                            )) ||
                              (getActivityState(activity) === "completed" && (
                                <TableHead className="text-right">
                                  Karma Points
                                </TableHead>
                              ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activity.participations
                            ?.filter((p) => p.isConfirmed)
                            .map((participant, index) => (
                              <TableRow key={participant.id}>
                                <TableCell>
                                  <Link
                                    to={`/users/${participant.userId}`}
                                    className="font-semibold hover:underline hover:underline-offset-4"
                                  >
                                    {participant.firstName}{" "}
                                    {participant.lastName}
                                  </Link>
                                </TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end">
                                    {getActivityState(activity) ===
                                      "finished" && (
                                      <Controller
                                        control={control}
                                        name={`volunteerEarnings.${index}.date`}
                                        render={({ field }) => (
                                          <div>
                                            <TimePickerDemo
                                              date={field.value}
                                              setDate={field.onChange}
                                              showSeconds={true}
                                            />
                                          </div>
                                        )}
                                      />
                                    )}
                                    {getActivityState(activity) ===
                                      "completed" && (
                                      <div>{participant.karmaPoints}</div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {activity.endDate < new Date() && !activity.resolved && (
                    <div>
                      <div className="flex justify-end items-center space-x-2 mt-2">
                        <p className="text-sm text-slate-500">
                          Reward volunteers by assigning the time and resolve
                          the activity.
                        </p>
                        <Button
                          onClick={handleSubmit(
                            async (data) =>
                              await resolveActivityMutation.mutateAsync(data)
                          )}
                        >
                          Assign & Resolve
                        </Button>
                      </div>
                      <div>
                        {resolveActivityMutation.isError && (
                          <ErrorMessage
                            message={resolveActivityMutation.error?.message}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="applications">
              <Card>
                <CardContent className="space-y-2 pt-4">
                  {activity.applications?.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center">
                      There are no applications for this activity.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">Applicant</TableHead>
                          {/* <TableHead>Email</TableHead> */}
                          <TableHead>Applied on</TableHead>
                          <TableHead>Reviewed on</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activity.applications
                          ?.sort(compareApplicationsByStatusAndDate)
                          .map((application) => (
                            <>
                              <TableRow
                                key={application.id}
                                className="hover:cursor-pointer"
                                onClick={() => {
                                  setSearchParams({
                                    applicationId: application.id,
                                  });
                                }}
                              >
                                <TableCell>
                                  <p className="font-semibold">
                                    {application.firstName}{" "}
                                    {application.lastName}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  {format(
                                    application.dateOfApplication,
                                    "yyyy-MM-dd HH:mm:ss"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {application.dateOfApproval
                                    ? format(
                                        application.dateOfApproval,
                                        "yyyy-MM-dd"
                                      )
                                    : "-"}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {!application.dateOfApproval ? (
                                    "Awaiting"
                                  ) : application.isApproved ? (
                                    <p className="text-teal-700">Accepted</p>
                                  ) : (
                                    <p className="text-slate-400">Rejected</p>
                                  )}
                                </TableCell>
                              </TableRow>
                              <Dialog
                                key={application.id}
                                open={
                                  queryParams.applicationId === application.id
                                }
                                onOpenChange={() => {
                                  setSearchParams({});
                                }}
                              >
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Review application
                                    </DialogTitle>
                                    <DialogDescription>
                                      {application.isApproved ? (
                                        <p>
                                          This application has been reviewed.
                                        </p>
                                      ) : (
                                        <p>
                                          Review the application and decide
                                          whether to accept or reject it.
                                        </p>
                                      )}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div>
                                    <div className="flex space-x-2 items-center justify-start">
                                      <Label className="font-semibold">
                                        Applicant's profile:
                                      </Label>
                                      <Button variant={"link"}>
                                        <Link
                                          to={`/users/${application.userId}`}
                                        >
                                          {application.firstName}{" "}
                                          {application.lastName}
                                        </Link>
                                      </Button>
                                    </div>
                                    <div className="mb-8">
                                      <p className=" rounded-md p-4 bg-slate-50">
                                        {application.motivation}
                                      </p>
                                    </div>
                                    {!application.dateOfApproval && (
                                      <DialogFooter>
                                        <div className="flex space-x-4 flex-1">
                                          <Button
                                            variant={"destructive"}
                                            className="w-1/3"
                                            onClick={async () =>
                                              await rejectApplication(
                                                application.id
                                              )
                                            }
                                          >
                                            Reject
                                          </Button>
                                          <Button
                                            className="w-2/3"
                                            onClick={async () =>
                                              await acceptApplication(
                                                application.id
                                              )
                                            }
                                          >
                                            Accept
                                          </Button>
                                        </div>
                                      </DialogFooter>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                  {reviewApplicationMutations.isError && (
                    <ErrorMessage
                      message={reviewApplicationMutations.error?.message}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="invitations">
              <Card>
                <CardContent className="space-y-2 pt-4">
                  {activity.participations?.filter((p) => !p.isConfirmed)
                    .length === 0 ? (
                    <p className="text-slate-400 text-sm text-center">
                      There are no invitations for this activity.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">Invitee</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Invited on</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activity.participations
                          ?.filter((p) => !p.isConfirmed)
                          .sort(compareParticipationsByStatusAndDate)
                          .map((participation) => (
                            <TableRow key={participation.id}>
                              <TableCell>
                                <p className="font-semibold">
                                  {participation.firstName}{" "}
                                  {participation.lastName}
                                </p>
                              </TableCell>
                              <TableCell>{participation.email}</TableCell>
                              <TableCell>
                                {format(
                                  participation.dateOfInvitation,
                                  "MMM dd"
                                )}
                              </TableCell>
                              <TableCell>{participation.type}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {!participation.dateOfConfirmation
                                  ? "Awaiting"
                                  : participation.isConfirmed
                                  ? "Confirmed"
                                  : "Rejected"}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                  <div className="flex flex-1 justify-end">
                    <Dialog
                      open={invitationsOpen}
                      onOpenChange={setInvitationsOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          disabled={getActivityState(activity) !== "upcoming"}
                        >
                          <PlusIcon />
                          <p>Invite volunteers</p>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite volunteers</DialogTitle>
                          <DialogDescription>
                            Invite volunteers to participate in this activity.
                          </DialogDescription>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">
                                <div className="flex">
                                  <Checkbox
                                    id="selectAll"
                                    checked={selectAllVolunteers}
                                    onCheckedChange={toggleSelectAllVolunteers}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="">Volunteer</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activity.volunteers?.map((volunteer) => (
                              <TableRow
                                key={volunteer.id}
                                onClick={() =>
                                  toggleVolunteerSelection(volunteer.id)
                                }
                              >
                                <TableCell>
                                  <div className="flex">
                                    <Checkbox
                                      id={volunteer.id}
                                      checked={selectedVolunteersIds.includes(
                                        volunteer.id
                                      )}
                                      onCheckedChange={() =>
                                        toggleVolunteerSelection(volunteer.id)
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="font-semibold">
                                    {volunteer.firstName} {volunteer.lastName}
                                  </p>
                                </TableCell>
                                <TableCell>{volunteer.email}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {sendInvitationsMutation.isError && (
                          <ErrorMessage
                            message={sendInvitationsMutation.error?.message}
                          />
                        )}
                        <DialogFooter>
                          <Button
                            className="w-full mt-4"
                            disabled={selectedVolunteersIds.length === 0}
                            onClick={async () =>
                              await onSendInvitations(
                                activityId!,
                                organizationId!,
                                selectedVolunteersIds
                              )
                            }
                          >
                            Invite
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold pt-2 mb-4">
            Comments from KARMA volunteers
          </h2>
          {!activity.feedbacks?.some((f) => f.userId === user?.id) &&
            activity.participations?.some((p) => p.userId === user?.id) && (
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"link"}>
                      <PlusIcon />
                      Comment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>New comment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tell the community what you think about the event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form
                      onSubmit={handleSubmitFeedback(
                        async (data) =>
                          await createFeedbackMutation.mutateAsync(data)
                      )}
                    >
                      <div>
                        <div className="flex space-x-4 items-center mb-4">
                          <p className="-translate-y-0.5">
                            How much did you enjoy it?
                          </p>
                          <Rating
                            rating={watch("rating") ?? 0}
                            variant="destructive"
                            Icon={<Heart />}
                            onRatingChange={(rating) =>
                              setValue("rating", rating)
                            }
                          />
                        </div>
                        {errors.rating && (
                          <ErrorMessage message={errors.rating.message} />
                        )}
                      </div>

                      <div className="mb-4">
                        <Textarea
                          {...register("comment")}
                          placeholder="Type your comment here."
                        />
                        {errors.comment && (
                          <ErrorMessage message={errors.comment.message} />
                        )}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">
                          Submit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
        </div>

        <ul className="mb-8">
          {activity.feedbacks.length === 0 ? (
            <div>
              <p className=" text-sm text-slate-500">
                Currently there are no comments from KARMA volunteers.
              </p>
            </div>
          ) : (
            activity.feedbacks?.map((feedback) => (
              <li
                key={feedback.id}
                className="relative first:border-t-2 py-4 border-b-2"
              >
                {(user?.role === "admin" || user?.id === feedback.userId) && (
                  <div className="flex">
                    <AlertDialog
                      open={editFeedbackOpen && feedback.userId === user?.id}
                      onOpenChange={setEditFeedbackOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={editFeedbackMutation.isPending}
                          className="text-slate-400 hover:underline text-sm hover:text-teal-700 border-r-2 pr-1"
                          onClick={() => {
                            setEditFeedbackOpen(true);
                            reset({
                              ...(activity?.feedbacks?.find(
                                (f) => f.userId === user?.id
                              ) ?? {}),
                            });
                          }}
                        >
                          Edit
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Update your comment
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tell the community what you think about the event.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div>
                          <div className="flex space-x-4 items-center mb-4">
                            <p className="-translate-y-0.5">
                              How much did you enjoy it?
                            </p>
                            <Rating
                              rating={watch("rating") ?? 0}
                              variant="destructive"
                              Icon={<Heart />}
                              onRatingChange={(rating) =>
                                setValue("rating", rating)
                              }
                            />
                          </div>
                          {errors.rating && (
                            <ErrorMessage message={errors.rating.message} />
                          )}
                        </div>

                        <div className="mb-4">
                          <Textarea
                            {...register("comment")}
                            placeholder="Type your comment here."
                          />
                          {errors.comment && (
                            <ErrorMessage message={errors.comment.message} />
                          )}
                        </div>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleSubmitFeedback(async (data) => {
                              await editFeedbackMutation.mutate({
                                rating: data.rating,
                                comment: data.comment || "",
                                feedbackId: feedback.id,
                              });
                              setEditFeedbackOpen(false);
                            })}
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-slate-400 hover:underline text-sm hover:text-destructive pl-1">
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete your comment?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogDelete
                            onClick={async () =>
                              await deleteFeedbackMutation.mutate({
                                feedbackId: feedback.id,
                              })
                            }
                          >
                            Delete
                          </AlertDialogDelete>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <div className="flex flex-1 justify-between items-center">
                  <div className="flex space-x-4 items-center">
                    <Link
                      to={`/users/${feedback.userId}`}
                      className="hover:underline hover:underline-offset-4"
                    >
                      {feedback.firstName} {feedback.lastName}
                    </Link>

                    <Rating
                      rating={feedback.rating}
                      variant="destructive"
                      Icon={<Heart />}
                      disabled={true}
                      size={15}
                    />
                    {feedback.userId === user?.id && (
                      <p className="text-sm text-slate-600">(Your comment)</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {format(feedback.updatedAt, "yyyy-MM-dd")}
                  </p>
                </div>

                <p className="italic">{feedback.comment}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="basis-2/5 bg-teal-200 h-full">
        {activity.geoLocation && (
          <MyGoogleMap center={activity.geoLocation} zoom={13}>
            {marker}
          </MyGoogleMap>
        )}
      </div>
    </div>
  );
}
