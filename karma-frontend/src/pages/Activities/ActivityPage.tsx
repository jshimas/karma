import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyToActivity, getActivity } from "../../api/activityApi";
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
} from "../../components/ui/Dialog";
import { Textarea } from "../../components/ui/TextArea";
import { useAuth } from "../../hooks/useAuth";
import {
  createFeedback,
  deleteFeedback,
  updateFeedback,
} from "../../api/feedbackApi";
import { FeedbackEdit } from "../../models/Feedback";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { printTimeDifference } from "../../lib/utils";
import Badge from "../../components/Badge";
import { format } from "date-fns";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import ClockIcon from "../../assets/icons/ClockIcon";
import LongArrowRight from "../../assets/icons/LongArrowRight";
import MapPinIcon from "../../assets/icons/MapPinIcon";
import MyGoogleMap from "../../components/MyGoogleMap";
import MarkerWithInfowindow from "../../components/MarkerWIthInfowindow";
import { useToast } from "../../components/ui/Toast/UseToast";

export default function ActivityPage() {
  const [comment, setComment] = useState("");
  const [application, setApplication] = useState("");
  const { organizationId, activityId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

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

  type EditFeedbackParams = {
    comment: string;
    feedbackId: string;
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

  const editFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: EditFeedbackParams) =>
      await updateFeedback({
        data: {
          comment: newFeedback.comment,
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
      <div className="basis-1/2 pt-20 px-24 overflow-y-auto h-[calc(100vh-40px)]">
        <h2 className="text-3xl font-semibold">{activity.name}</h2>
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
        </div>

        <p className="mb-8">{activity.description}</p>
        <div className="flex justify-center mb-8">
          {user?.role === "volunteer" && (
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
                    onClick={async () => await applyToActivityMutation.mutate()}
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {user?.role === "organizer" && (
            <Button variant={"secondary"} className="w-3/5 ">
              View applications
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold pt-2 mb-4">
            Comments from KARMA users
          </h2>
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
                <Textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Type your comment here."
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () =>
                      await createFeedbackMutation.mutate({ comment })
                    }
                  >
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <ul className="mb-8">
          {activity.feedbacks?.map((feedback) => (
            <li
              key={feedback.id}
              className="relative first:border-t-2 py-4 border-b-2"
            >
              {(user?.role === "admin" || user?.id === feedback.userId) && (
                <div className="flex">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={editFeedbackMutation.isPending}
                        className="text-slate-400 hover:underline text-sm hover:text-teal-700 border-r-2 pr-1"
                      >
                        Edit
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update your comment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tell the community what you think about the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Textarea
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Type your comment here."
                        defaultValue={feedback.comment}
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () =>
                            await editFeedbackMutation.mutate({
                              comment,
                              feedbackId: feedback.id,
                            })
                          }
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

              {feedback.userId === user?.id && (
                <p className="text-sm text-slate-600">(Your comment)</p>
              )}
              <p className="">{feedback.comment}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="basis-1/2 bg-teal-200 h-full">
        {activity.geoLocation && (
          <MyGoogleMap center={activity.geoLocation} zoom={13}>
            {marker}
          </MyGoogleMap>
        )}
      </div>
    </div>
  );
}
