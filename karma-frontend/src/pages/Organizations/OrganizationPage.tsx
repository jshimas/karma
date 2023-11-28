import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getOrganization } from "../../api/organizationApi";
import Badge from "../../components/Badge";
import { getOrganizationActivities } from "../../api/activityApi";
import { Button } from "../../components/ui/Button";
import PlusIcon from "../../assets/icons/PlusIcon";

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

  const {
    data: activities,
    isPending: isPendingActivities,
    isError: isErrorActivities,
    error: errorActivities,
  } = useQuery({
    queryKey: ["activities", "list", organizationId],
    queryFn: async () =>
      await getOrganizationActivities({
        params: { organizationId: organizationId! },
      }),
  });

  if (isPending || isPendingActivities) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isErrorActivities) {
    return <div>{errorActivities.message}</div>;
  }

  return (
    <div className="mx-6 my-12 md:mx-12 w-4/5 xl:w-1/2 flex flex-col gap-14 sm:flex-row text-slate-800">
      <div className="basis-1/2 md:border-r-2 pr-4">
        <h2 className="text-3xl font-semibold">{organization.name}</h2>
        <p className="mb-1">{organization.mission}</p>
        <div className="mb-8">
          <Badge>{organization.type}</Badge>
        </div>
        <div>
          <p className="uppercase mb-2">Contacts</p>
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col gap-2 font-semibold">
              <p>Address</p>
              <p>Phone</p>
              <p>Website</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>{organization.address}</p>
              <p>{organization.phone}</p>
              <p>{organization.website}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="uppercase mb-2">Socials</h3>
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col gap-2 font-semibold">
              <p>Facebook</p>
              <p>Instgram</p>
              <p>LinkedIn</p>
              <p>YouTube</p>
            </div>
            <div className="flex flex-col gap-2">
              {organization.facebook && (
                <a href="#" className="hover:underline">
                  {organization.facebook}
                </a>
              )}
              {organization.instagram && (
                <a href="#" className="hover:underline">
                  {organization.instagram}
                </a>
              )}
              {organization.linkedin && (
                <a href="#" className="hover:underline">
                  {organization.linkedin}
                </a>
              )}
              {organization.youtube && (
                <a href="#" className="hover:underline">
                  {organization.youtube}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col basis-1/2">
        <h2 className="text-xl font-semibold pt-2 mb-4">
          Organization's events
        </h2>
        <ul className="mb-8">
          {activities?.map((activity) => {
            const date = new Date(activity.startDate * 1000);
            const formatedDate = date.toISOString().split("T")[0];

            return (
              <li
                key={activity.id}
                className="group/item transition-all py-4 border-b-2"
              >
                <Link
                  to={`/organizations/${organization.id}/activities/${activity.id}`}
                >
                  <div className="transition-all group-hover/item:translate-x-4">
                    <div className="flex w-full justify-between items-center">
                      <h2 className="text-lg font-semibold group-hover/item:text-teal-600">
                        {activity.name}
                      </h2>
                    </div>
                    <p className="mb-2 text-sm text-slate-600">
                      {formatedDate}
                    </p>
                    <p>{activity.description}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div>
          <Link to={`/organizations/${organization.id}/activities/create`}>
            <Button>
              <PlusIcon />
              Create event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
