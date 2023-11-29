import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrganization,
  getAllOrganizations,
} from "../../api/organizationApi";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDelete,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import PlusIcon from "../../assets/icons/PlusIcon";

export default function OrganizationsPage() {
  const queryClient = useQueryClient();

  const {
    data: organizations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizationList"],
    queryFn: async () => await getAllOrganizations({}),
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (params: { id: string }) =>
      await deleteOrganization({
        params: {
          id: params.id!,
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ["organizationList"],
      }),
  });

  console.log(deleteFeedbackMutation.status);
  console.log(deleteFeedbackMutation.error);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex flex-col w-3/4">
      <h1 className="text-slate-900 text-3xl my-12">Organizations</h1>
      <div className="w-full relative overflow-x-auto sm:rounded-lg mb-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Orgnization name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((organization) => (
              <tr
                key={organization.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td>
                  <Link
                    to={`/organizations/${organization.id}`}
                    className="font-medium text-gray-900 whitespace-nowrap "
                  >
                    <Button variant="link">{organization.name}</Button>
                  </Link>
                </td>
                <td className="px-6 py-4">{organization.type}</td>
                <td className="px-6 py-4">{organization.email}</td>
                <td className="px-6 py-4">{`${organization.phone}`}</td>
                <td className="px-6 py-4 text-left">
                  <Link
                    to={`/organizations/${organization.id}/edit`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <a className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer">
                        Remove
                      </a>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure you want to delete?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {`This action cannot be undone. This will permanently
                          delete '${organization.name}' organization and remove all the related activities.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogDelete
                          onClick={async () =>
                            await deleteFeedbackMutation.mutate({
                              id: organization.id,
                            })
                          }
                        >
                          Delete
                        </AlertDialogDelete>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Link to={"/organizations/create"}>
          <Button>
            <PlusIcon />
            Create
          </Button>
        </Link>
      </div>
    </div>
  );
}
