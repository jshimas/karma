import { useParams } from "react-router-dom";

export default function OrganizationEditPage() {
  const { organizationId } = useParams();

  return <div>Organization edit page with id: {organizationId}</div>;
}
