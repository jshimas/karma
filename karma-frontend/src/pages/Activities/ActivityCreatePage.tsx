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

    try {
      const activity = await createActivity({
        data: {
          ...data,
          startDate: data.startDate + "T00:00:00Z",
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

  return (
    <div className="w-4/5 md:w-1/2 lg:w-1/3 text-slate-800 m-12">
      <h1 className="text-2xl mb-8">Please fill the activity details</h1>
      <ActivityForm onSubmit={onSubmit} isSubmitting={loading} />
      {error && <p>{error.message}</p>}
    </div>
  );
}
