import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationForm from "../../components/OrganizationForm";
import { createOrganization } from "../../api/organizationApi";
import { AxiosError } from "axios";
import { OrganizationEdit } from "../../models/Organization";
import { SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

export default function OrganizationCreatePage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<OrganizationEdit> = async (data) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not found");
      }
      const { image, ...restData } = data;
      const organization = await createOrganization({
        data: restData,
        file: image,
      });
      login({ ...user, organizationId: organization.id });
      navigate(`/organizations/${organization.id}`);
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
    <div className="w-4/5 lg:w-2/3 text-slate-800 mt-24">
      <OrganizationForm onSubmit={onSubmit} isSubmitting={loading} />
      {error && <p>{error.message}</p>}
    </div>
  );
}
