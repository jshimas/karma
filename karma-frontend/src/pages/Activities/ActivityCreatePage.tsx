import { useParams } from "react-router-dom";

export default function ActivityCreatePage() {
  const { organizationId } = useParams();

  return <div>Activity create page. Organization id: {organizationId}</div>;
}
