import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOrganization } from "../../api/organizationApi";

export default function OrganizationPage() {
  const { organizationId } = useParams();

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

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return <div>{organization.name}</div>;
}
