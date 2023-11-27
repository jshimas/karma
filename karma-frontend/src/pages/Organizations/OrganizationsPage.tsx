import { useQuery } from "@tanstack/react-query";
import { getAllOrganizations } from "../../api/organizationApi";

export default function OrganizationsPage() {
  const {
    data: organizations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizationList"],
    queryFn: async () => await getAllOrganizations({}),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  return <div>{organizations[0].name}</div>;
}
