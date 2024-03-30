import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, updateUser } from "../../api/usersApi";
import SpinnerIcon from "../../assets/icons/SpinnerIcon";
import { UserEdit } from "../../models/Users";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserEditForm from "../../components/UserEditForm";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const { user: authUser } = useAuth();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", authUser?.id],
    queryFn: async () => await getCurrentUser({}),
  });

  const editUserMutation = useMutation({
    mutationFn: async (userEdit: UserEdit) =>
      await updateUser({
        data: {
          ...userEdit,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile", authUser?.id],
      }); // Invalidate the query
      navigate(`/users/me`);
    },
  });

  const onSubmit: SubmitHandler<UserEdit> = async (data) => {
    await editUserMutation.mutate(data);
  };

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isPending) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center pt-24 bg-slate-50">
      <UserEditForm
        isCreating={false}
        onSubmit={onSubmit}
        onCancel={() => navigate(-1)}
        defaultValues={user}
        isSubmitting={editUserMutation.isPending}
      />
    </div>
  );
}
