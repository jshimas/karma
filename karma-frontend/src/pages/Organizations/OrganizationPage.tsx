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

const invitation = z.string().email();

export default function OrganizationPage() {
  const [invitationTo, setInvitationTo] = useState<string>("");
  const [isInvitationValid, setIsValidInvitation] = useState(false);
  const [isInvitationFormOpen, setIsInvitationFormOpen] = useState(false);
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
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${invitationTo}`,
    });
  };

  if (isPending) {
    return <SpinnerIcon />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-6 my-24 md:mx-12 w-4/5 xl:w-1/2 flex flex-col gap-14 sm:flex-row text-slate-800">
      <div className="basis-1/2 md:border-r-2 pr-4">
        <div className="flex gap-3 items-center">
          <h2 className="text-3xl font-semibold">{organization.name}</h2>
          {user?.organizationId === organizationId && (
            <div className="flex gap-3 items-center">
              <Link to={`/organizations/${organizationId}/edit`}>
                <PenIcon className="text-slate-600 w-5 h-5" />
              </Link>
              <Dialog open={isInvitationFormOpen}>
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
                    <div className="flex space-x-4 items-center justify-center">
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
                      {sendInvitationMutation.isError && (
                        <ErrorMessage
                          message={sendInvitationMutation.error?.message}
                        />
                      )}
                    </div>
                  </form>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={
                        !isInvitationValid || sendInvitationMutation.isPending
                      }
                    >
                      {sendInvitationMutation.isPending ? (
                        <SpinnerIcon />
                      ) : (
                        "Send invitation"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <p className="mb-1">{organization.mission}</p>
        <div className="mb-8">
          <Badge>{organization.type}</Badge>
        </div>
        <div>
          <p className="uppercase mb-2">Contacts</p>
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col gap-2 font-semibold">
              {organization.address && <p>Address</p>}
              {organization.phone && <p>Phone</p>}
              {organization.website && <p>Website</p>}
            </div>
            <div className="flex flex-col gap-2">
              {organization.address && <p>{organization.address}</p>}
              {organization.phone && <p>{organization.phone}</p>}
              {organization.website && <p>{organization.website}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="uppercase mb-2">Socials</h3>
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col gap-2 font-semibold">
              {organization.facebook && <p>Facebook</p>}
              {organization.instagram && <p>Instgram</p>}
              {organization.linkedin && <p>LinkedIn</p>}
              {organization.youtube && <p>YouTube</p>}
            </div>
            <div className="flex flex-col gap-2">
              {organization.facebook && (
                <a href="#" className="hover:underline">
                  {organization.facebook}
                </a>
              )}
              {organization.instagram && (
                <a href="#" className="hover:underline">
                  {organization.instagram}
                </a>
              )}
              {organization.linkedin && (
                <a href="#" className="hover:underline">
                  {organization.linkedin}
                </a>
              )}
              {organization.youtube && (
                <a href="#" className="hover:underline">
                  {organization.youtube}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col basis-1/2">
        <h2 className="text-xl font-semibold pt-2 mb-4">
          Organization's events
        </h2>
        <ul className="mb-8">
          {organization.activities?.map((activity) => {
            const date = new Date(activity.startDate);
            const formatedDate = date.toISOString().split("T")[0];

            return (
              <li
                key={activity.id}
                className="group/item transition-all py-4 border-b-2"
              >
                {(user?.role === "admin" ||
                  user?.organizationId === activity.organizationId) && (
                  <div>
                    <Link
                      to={`/organizations/${organizationId}/activities/${activity.id}/edit`}
                      className="text-slate-400 hover:underline text-sm hover:text-teal-700 border-r-2 pr-1"
                    >
                      Edit
                    </Link>

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
                            Are you sure you want to delete this activity? All
                            the data related to it will be permenantly deleted
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogDelete
                            onClick={async () =>
                              await deleteActivityMutation.mutate({
                                activityId: activity.id,
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

                <Link
                  to={`/organizations/${organization.id}/activities/${activity.id}`}
                >
                  <div className="transition-all group-hover/item:translate-x-4">
                    <div className="flex w-full justify-between items-center">
                      <h2 className="text-lg font-semibold group-hover/item:text-teal-600">
                        {activity.name}
                      </h2>
                    </div>
                    <p className="mb-2 text-sm text-slate-600">
                      {formatedDate}
                    </p>
                    <p>{activity.description}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {user?.organizationId === organizationId && (
          <div>
            <Link to={`/organizations/${organization.id}/activities/create`}>
              <Button>
                <PlusIcon />
                Create activity
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
