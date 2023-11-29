import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationForm from "../../components/OrganizationForm";
import { createOrganization } from "../../api/organizationApi";
import { AxiosError } from "axios";
import { OrganizationEdit } from "../../models/Organization";
import { SubmitHandler } from "react-hook-form";

export default function OrganizationCreatePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<OrganizationEdit> = async (data) => {
    setLoading(true);
    try {
      const organization = await createOrganization({ data });
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
    <div className="w-4/5 lg:w-2/3 text-slate-800 m-12">
      <OrganizationForm onSubmit={onSubmit} isSubmitting={loading} />
      {error && <p>{error.message}</p>}
    </div>
  );
}
