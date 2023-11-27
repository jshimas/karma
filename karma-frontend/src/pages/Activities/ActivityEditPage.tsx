import { useParams } from "react-router-dom";

export default function ActivityEditPage() {
  const { organizationId, activityId } = useParams();

  return (
    <div>
      Activity edit page. Organization id: {organizationId}, activity id:{" "}
      {activityId}
    </div>
  );
}
