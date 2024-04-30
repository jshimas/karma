import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getOrganization } from "../../api/organizationApi";
import Badge from "../../components/Badge";
import { deleteActivity } from "../../api/activityApi";
import { Button } from "../../components/ui/Button";
import PlusIcon from "../../assets/icons/PlusIcon";
import { useAuth } from "../../hooks/useAuth";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogDelete,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/Dialog";
import PenIcon from "../../assets/icons/PenIcon";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import UserPlusIcon from "../../assets/icons/UserPlusIcon";
import { useState } from "react";
import { sendOrganizerInvitation } from "../../api/authApi";
import { z } from "zod";
import ErrorMessage from "../../components/ErrorMessage";
import { useToast } from "../../components/ui/Toast/UseToast";
import TrashIcon from "../../assets/icons/TrashIcon";
import { default as facebookLogo } from "../../assets/icons/facebook.png";
import { default as instagramLogo } from "../../assets/icons/instagram.png";
import { default as linkedinLogo } from "../../assets/icons/linkedin.png";
import { default as youtubeLogo } from "../../assets/icons/youtube.png";
import { Rating } from "../../components/ui/Rating";
import { Heart } from "lucide-react";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/Carousel";
import { Card, CardContent } from "../../components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Checkbox } from "../../components/ui/Checkbox";
import { getActivityState } from "../../lib/utils";
import ActivityStatusBadge from "../../components/ActivityStatusBadge";

const invitation = z.string().email();

export default function OrganizationPage() {
  const [invitationTo, setInvitationTo] = useState<string>("");
  const [isInvitationValid, setIsValidInvitation] = useState(false);
  const [isInvitationFormOpen, setIsInvitationFormOpen] = useState(false);
  const [showCompletedActivities, setShowCompletedActivities] = useState(false);
  const { organizationId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const {
    data: organization,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["organization", "detail", organizationId],
    queryFn: async () =>
      await getOrganization({ params: { id: organizationId! } }),
  });

  const feedbacks = organization?.activities.flatMap(
    (activity) => activity.feedbacks
  );

  let averageRating;
  if (feedbacks && feedbacks?.length > 0) {
    averageRating =
      feedbacks?.reduce(
        (acc, feedback) => (feedback ? acc + feedback.rating : acc),
        0
      ) / feedbacks?.length;
  }

  // get top 5 latest feedbacks
  const topFeedbacks = feedbacks
    ?.sort((a, b) =>
      b && a ? b?.updatedAt.getTime() - new Date(a.updatedAt).getTime() : 0
    )
    .slice(0, 5);

  const nextUpcomingActivity = organization?.activities
    .filter((a) => a.startDate > new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];

  const deleteActivityMutation = useMutation({
    mutationFn: async (params: { activityId: string }) =>
      await deleteActivity({
        params: {
          organizationId: organizationId!,
          activityId: params.activityId!,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["organization", "detail", organizationId],
      }),
  });

  const handleEmailChange = (email: string) => {
    setInvitationTo(email);
    setIsValidInvitation(invitation.safeParse(email).success);
  };

  const sendInvitationMutation = useMutation({
    mutationFn: async () => {
      console.log(user, organization, invitationTo);
      if (!user || !organization) return null;
      console.log("send invitation");

      return await sendOrganizerInvitation({
        data: {
          toEmail: invitationTo,
          fromEmail: user?.email,
          fromName: user?.firstName,
          organizationName: organization?.name,
        },
      });
    },
  });

  const handleSendInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendInvitationMutation.mutate();
    setIsInvitationFormOpen(false);
    setInvitationTo("");
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${invitationTo}`,
    });
  };

  if (organizationId == "undefined" || organizationId == "null") {
    return (
      <div className="flex h-screen flex-1 justify-center items-center">
        <div>
          <h2 className="text-center text-2xl">No organization yet</h2>
          <p className=" text-center mb-2">
            Please create your organization to start managing the activities.
          </p>
          <div className="flex justify-center">
            <Button>
              <Link to="/organizations/create">Create organization</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return <SpinnerIcon />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-6 mt-24 mb-6 md:mx-12 w-4/5 2xl:w-3/5 3xl:w-1/2 flex flex-col gap-4 sm:flex-row text-slate-800 ">
      {organization.imageUrl && (
        <img
          src={organization.imageUrl}
          alt={organization.name}
          className="h-16 rounded-lg"
        />
      )}
      <div className="basis-2/5 2xl:basis-1/2 flex flex-col space-y-6">
        <div>
          <div className="flex gap-3">
            <h2 className="text-3xl font-semibold">{organization.name}</h2>
            {user?.organizationId === organizationId && (
              <div className="flex gap-3 items-center">
                <Link to={`/organizations/${organizationId}/edit`}>
                  <PenIcon className="text-slate-600 w-5 h-5" />
                </Link>
                <Dialog
                  open={isInvitationFormOpen}
                  onOpenChange={setIsInvitationFormOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-slate-600 p-0"
                      onClick={() => setIsInvitationFormOpen(true)}
                    >
                      <UserPlusIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Invite an organizer</DialogTitle>
                      <DialogDescription>
                        Send an invitation to someone to join your organization
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendInvitation}>
                      <div className="flex space-x-4 items-center justify-center mb-4">
                        <Label
                          htmlFor="invitationTo"
                          className="-translate-y-0.5 "
                        >
                          Email
                        </Label>
                        <Input
                          id="invitationTo"
                          value={invitationTo}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          className="w-2/3"
                        />
                      </div>
                      <DialogFooter>
                        {sendInvitationMutation.isError && (
                          <ErrorMessage
                            message={sendInvitationMutation.error?.message}
                          />
                        )}
                        <Button
                          type="submit"
                          disabled={
                            !isInvitationValid ||
                            sendInvitationMutation.isPending
                          }
                        >
                          {sendInvitationMutation.isPending ? (
                            <SpinnerIcon />
                          ) : (
                            "Send invitation"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <p className="mb-1">{organization.mission}</p>

          <div>
            <Badge>{organization.type}</Badge>
          </div>
        </div>

        <div>
          <p className="uppercase mb-2">Contacts</p>
          <div className="flex gap-6">
            <div className="flex flex-col font-semibold">
              {organization.address && <p>Address</p>}
              {organization.phone && <p>Phone</p>}
              {organization.website && <p>Website</p>}
            </div>
            <div className="flex flex-col">
              {organization.address && <p>{organization.address}</p>}
              {organization.phone && <p>{organization.phone}</p>}
              {organization.website && <p>{organization.website}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-6">
            <div className="flex space-x-2 font-semibold">
              {organization.facebook && (
                <Link to={organization.facebook} className="hover:underline">
                  <img src={facebookLogo} alt="Facebook" className="h-6" />
                </Link>
              )}
              {organization.instagram && (
                <Link to={organization.instagram} className="hover:underline">
                  <img src={instagramLogo} alt="Instagram" className="h-6" />
                </Link>
              )}
              {organization.linkedin && (
                <Link to={organization.linkedin} className="hover:underline">
                  <img src={linkedinLogo} alt="LinkedIn" className="h-6" />
                </Link>
              )}
              {organization.youtube && (
                <Link to={organization.youtube} className="hover:underline">
                  <img src={youtubeLogo} alt="YouTube" className="h-6" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <div>
            <h2 className="text-xl font-semibold">KARMA volunteers feedback</h2>
            <div className="flex space-x-2">
              <p>Average rating: </p>
              <Rating
                rating={averageRating || 0}
                variant="destructive"
                Icon={<Heart />}
                disabled={true}
                size={15}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Next upcoming activity</h2>
          {!nextUpcomingActivity ? (
            <p className="text-sm text-slate-500">No upcoming activity.</p>
          ) : (
            <div className="group/item pr-6">
              <div className="border-s-4 ps-4 group-hover/item:border-teal-700 transition-all">
                <Link
                  to={`/organizations/${organization.id}/activities/${nextUpcomingActivity?.id}`}
                  className="flex flex-1 "
                >
                  <div className="transition-all w-full">
                    <div className="flex w-full justify-between items-center">
                      <h2 className="text-lg font-semibold group-hover/item:text-teal-700">
                        {nextUpcomingActivity?.name}
                      </h2>
                    </div>
                    <p className="mb-2 text-sm text-slate-600">
                      {nextUpcomingActivity?.startDate &&
                        format(nextUpcomingActivity?.startDate, "yyyy-MM-dd")}
                    </p>
                    <p>{nextUpcomingActivity?.description.slice(0, 100)}...</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col basis-3/5 2xl:basis-1/2 flex-1">
        <Tabs defaultValue="activities">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="activities">
            <div>
              {user?.organizationId === organizationId && (
                <div className="flex flex-1 mb-2">
                  <Link
                    className="w-full"
                    to={`/organizations/${organization.id}/activities/create`}
                  >
                    <Button className="w-full">
                      <PlusIcon />
                      Create activity
                    </Button>
                  </Link>
                </div>
              )}

              <ul className="flex flex-col space-y-2 mb-4">
                {organization.activities
                  ?.sort(
                    (a, b) => b.startDate.getTime() - a.startDate.getTime()
                  )
                  .filter((activity) => {
                    if (showCompletedActivities) return true;
                    return getActivityState(activity) !== "completed";
                  })
                  .map((activity) => {
                    const date = new Date(activity.startDate);
                    const formatedDate = date.toISOString().split("T")[0];

                    return (
                      <li key={activity.id} className="group/item">
                        <Card className="group-hover/item:border-teal-700 transition-all">
                          <CardContent className="py-4 px-8 ">
                            <Link
                              to={`/organizations/${organization.id}/activities/${activity.id}`}
                              className="flex flex-1 "
                            >
                              <div className="transition-all w-full">
                                <div className="flex w-full justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-semibold group-hover/item:text-teal-700">
                                      {activity.name}
                                    </h2>
                                    <ActivityStatusBadge activity={activity} />
                                  </div>
                                  {(user?.role === "admin" ||
                                    user?.organizationId ===
                                      activity.organizationId) && (
                                    <div className="flex space-x-1">
                                      <Link
                                        to={`/organizations/${organizationId}/activities/${activity.id}/edit`}
                                        className="text-slate-400 hover:underline text-sm hover:text-teal-700 transition-all"
                                      >
                                        <PenIcon className="w-4 h-4" />
                                      </Link>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button className="text-slate-400 hover:underline text-sm hover:text-red-700  transition-all">
                                            <TrashIcon className="w-4 h-4" />
                                          </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Confirm delete
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete
                                              this activity? All the data
                                              related to it will be permenantly
                                              deleted
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogDelete
                                              onClick={async () =>
                                                await deleteActivityMutation.mutate(
                                                  {
                                                    activityId: activity.id,
                                                  }
                                                )
                                              }
                                            >
                                              Delete
                                            </AlertDialogDelete>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </div>
                                <p className="mb-2 text-sm text-slate-600">
                                  {formatedDate}
                                </p>
                                {activity.description.length > 150 ? (
                                  <p>{activity.description.slice(0, 150)}...</p>
                                ) : (
                                  <p>{activity.description}</p>
                                )}
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
              </ul>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="showCompleted"
                  checked={showCompletedActivities}
                  onCheckedChange={() =>
                    setShowCompletedActivities(!showCompletedActivities)
                  }
                />
                <label
                  htmlFor="showCompleted"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show completed activities
                </label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="comments">
            {topFeedbacks?.map((feedback) => {
              return (
                <div className="p-1" key={feedback?.id}>
                  <Card>
                    <CardContent className="flex py-2">
                      <div key={feedback?.id} className="">
                        <div className="flex flex-1 flex-col">
                          <div className="flex flex-1 justify-between items-center">
                            <div className="flex flex-1 space-x-2">
                              <Link
                                to={`/users/${feedback?.userId}`}
                                className="hover:underline hover:underline-offset-4 font-semibold text-sm"
                              >
                                {feedback?.firstName} {feedback?.lastName}
                              </Link>

                              <Rating
                                rating={feedback?.rating || 0}
                                variant="destructive"
                                Icon={<Heart />}
                                disabled={true}
                                size={15}
                              />
                            </div>

                            <p className="text-xs text-slate-400 text-center">
                              {feedback?.updatedAt &&
                                format(feedback?.updatedAt, "yyyy-MM-dd")}
                            </p>
                          </div>

                          <p className="">{feedback?.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
