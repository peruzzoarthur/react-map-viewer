import { axiosInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";

export const useGetShapes = () => {
  const {
    data: shapes,
    isFetching: isFetchingShapes,
    refetch: refetchShapes,
  } = useQuery({
    queryKey: ["get-shapes" ],
    queryFn: async (): Promise<FeatureCollection | null> => {
      const { data }: { data: FeatureCollection } =
        await axiosInstance.get(`/shapes`);
      if (!data) {
        return null;
      }
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { shapes, isFetchingShapes, refetchShapes };
};
