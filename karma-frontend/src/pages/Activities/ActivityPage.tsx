import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getActivity } from "../../api/activityApi";
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

export default function ActivityPage() {
  const [comment, setComment] = useState("");
  const { organizationId, activityId } = useParams();
  const { user } = useAuth();

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

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const parseDate = (date: number) => {
    // console.log(date);
    const convertedDate = new Date(date * 1000);
    return convertedDate.toISOString().split("T")[0];
  };

  const parseTime = (date: number) => {
    const convertedDate = new Date(date * 1000);
    const hours: number = convertedDate.getHours();
    const minutes: number = convertedDate.getMinutes();
    const stringMinutes = `${minutes}`.padStart(2, "0");
    return `${hours}:${stringMinutes}`;
  };

  return (
    <div className="mx-6 my-12 md:mx-12 w-4/5 xl:w-1/2 flex flex-col gap-14 sm:flex-row text-slate-800">
      <div className="basis-1/2 md:border-r-2 pr-4">
        <h2 className="text-3xl font-semibold">{activity.name}</h2>
        <p className="mb-8">
          {parseDate(activity.startDate)} &middot;{" "}
          {parseTime(activity.startDate)}
        </p>
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col gap-2 font-semibold">
            <p>Duration:</p>
            <p>Location:</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>~{activity.duration}</p>
            <p>{activity.location}</p>
          </div>
        </div>
        <p className="font-semibold">Description</p>
        <p>{activity.description}</p>
      </div>
      <div className="flex flex-col basis-1/2">
        <h2 className="text-xl font-semibold pt-2 mb-4">
          Comments from KARMA users
        </h2>

        <ul className="mb-8">
          {activity.feedbacks?.map((feedback) => (
            <li
              key={feedback.id}
              className="relative first:border-t-2 py-4 border-b-2"
            >
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
              {feedback.userId === user?.id && (
                <p className="text-sm text-slate-600">(Your comment)</p>
              )}
              <p className="">{feedback.comment}</p>
            </li>
          ))}
        </ul>

        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
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
    </div>
  );
}
