import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  OrganizationEdit,
  OrganizationEditSchema,
} from "../../models/Organization";
import { createOrganization } from "../../api/organizationApi";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";

export default function OrganizationCreatePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationEdit>({
    resolver: zodResolver(OrganizationEditSchema),
  });

  const onSubmit: SubmitHandler<OrganizationEdit> = async (data) => {
    setLoading(true);
    try {
      const organization = await createOrganization({ data });
      navigate(`/organizations/:${organization.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-4/5 lg:w-1/2">
      <div className="flex">
        <div className="basis-1/2">
          <h2>Details</h2>
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <Input {...register("name")} placeholder="Name" />
            {errors.name && (
              <p className="text-red-500">{errors.name?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="Phone" className="sr-only">
              Phone
            </label>
            <Input {...register("phone")} placeholder="Phone" />
            {errors.phone && (
              <p className="text-red-500">{errors.phone?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="Mission">Mission</label>
            <Textarea
              {...register("mission")}
              placeholder="Write organization's mission here"
            />
            {errors.mission && (
              <p className="text-red-500">{errors.mission?.message}</p>
            )}
          </div>
        </div>
        <div className="basis-1/2">Socials</div>
      </div>
    </div>
  );
}
