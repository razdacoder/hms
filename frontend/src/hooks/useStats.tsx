import { getStats } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

type Props = {
  date?: string;
};

export default function useStats({ date }: Props) {
  const {
    data: stats,
    isLoading: statsLoading,
    refetch,
  } = useQuery({
    queryKey: ["stats", date],
    queryFn: () => getStats(date),
  });
  return { stats, statsLoading, refetch };
}
