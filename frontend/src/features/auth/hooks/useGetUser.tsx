import { getUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: string;
};

export default function useGetUser({ id }: Props) {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });
  return { user, userLoading };
}
