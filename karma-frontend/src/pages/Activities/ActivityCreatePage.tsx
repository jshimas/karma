import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityForm from "../../components/ActivityForm";
import { createActivity } from "../../api/activityApi";
import { AxiosError } from "axios";
import { ActivityEdit } from "../../models/Activity";
import { SubmitHandler } from "react-hook-form";

export default function ActivityCreatePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ActivityEdit> = async (data) => {
    setLoading(true);

    console.log(organizationId);

    try {
      const activity = await createActivity({
        data: {
          ...data,
          address: data.address.split("::")[0],
        },
        params: { organizationId: organizationId! },
      });

      navigate(`/organizations/${organizationId}/activities/${activity.id}`);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return <ActivityForm onSubmit={onSubmit} isSubmitting={loading} />;
}
