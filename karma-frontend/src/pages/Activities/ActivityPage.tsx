import { useParams } from "react-router-dom";

export default function ActivityPage() {
  const { activityId } = useParams();

  return <div>Activity view page with id: {activityId}</div>;
}
