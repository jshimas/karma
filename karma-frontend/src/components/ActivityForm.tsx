import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityEdit, ActivityEditSchema } from "../models/Activity";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { useNavigate } from "react-router-dom";

interface ActivityFormProps {
  onSubmit: SubmitHandler<ActivityEdit>;
  isSubmitting: boolean;
  defaultValues?: ActivityEdit;
}

export default function ActivityForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: ActivityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityEdit>({
    resolver: zodResolver(ActivityEditSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <Input {...register("name")} placeholder="Name" />
          {errors.name && (
            <p className="text-destructive text-sm my-1">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="startDate" className="sr-only">
            Start Date
          </label>
          <Input
            type="date"
            {...register("startDate")}
            placeholder="Start Date"
          />
          {errors.startDate && (
            <p className="text-destructive text-sm my-1">
              {errors.startDate?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <Input {...register("location")} placeholder="Location" />
          {errors.location && (
            <p className="text-destructive text-sm my-1">
              {errors.location?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="sr-only">
            Duration
          </label>
          <Input {...register("duration")} placeholder="Duration" />
          {errors.duration && (
            <p className="text-destructive text-sm my-1">
              {errors.duration?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <Textarea
            {...register("description")}
            placeholder="Write activity description here"
          />
          {errors.description && (
            <p className="text-destructive text-sm my-1">
              {errors.description?.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center w-full justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <SpinnerIcon /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}
