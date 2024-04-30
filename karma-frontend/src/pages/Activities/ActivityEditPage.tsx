import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityForm from "../../components/ActivityForm";
import { getActivity, updateActivity } from "../../api/activityApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityEdit } from "../../models/Activity";
import { SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";

export default function ActivityEditPage() {
  const [errorEdit, setErrorEdit] = useState<AxiosError | null>(null);
  const navigate = useNavigate();
  const { organizationId, activityId } = useParams();

  const queryClient = useQueryClient();

  const {
    data: activity,
    isPending: isFetchingActivity,
    error,
  } = useQuery({
    queryKey: ["activity", "detail", activityId],
    queryFn: async () =>
      await getActivity({
        params: { organizationId: organizationId!, activityId: activityId! },
      }),
  });

  const editActivityMutation = useMutation({
    mutationFn: async (activityEdit: ActivityEdit) =>
      await updateActivity({
        data: {
          ...activityEdit,
        },
        params: { organizationId: organizationId!, activityId: activityId! },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["activity", "detail", activityId],
      }),
  });

  const onSubmit: SubmitHandler<ActivityEdit> = async (data) => {
    try {
      await editActivityMutation.mutate(data);
      navigate(`/organizations/${organizationId}/activities/${activityId}`);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setErrorEdit(error);
      }
    }
  };

  if (isFetchingActivity) {
    return <SpinnerIcon />;
  }

  return (
    <>
      <ActivityForm
        onSubmit={onSubmit}
        isSubmitting={editActivityMutation.isPending}
        defaultValues={activity}
      />
      {error && <p>{error.message}</p>}
      {errorEdit && <p>{errorEdit.message}</p>}
    </>
  );
}
