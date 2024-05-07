import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";

export default function usePatchStory(storyId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}stories/${storyId}`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["story", storyId]);
      },
    }
  );
}
export function useUpdateOpenComments(storyId) {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      axios
        .patch(
          `${backendApi}stories/${storyId}/updateOpenComments`,
          {},
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        window.location.reload(false);
      },
    }
  );
}
