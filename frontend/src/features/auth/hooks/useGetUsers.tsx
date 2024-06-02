import { getUsers } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export default function useGetUsers() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return {
    users,
    usersLoading,
  };
}
