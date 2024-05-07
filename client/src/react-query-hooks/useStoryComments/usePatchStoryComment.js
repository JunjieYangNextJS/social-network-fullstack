import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { showError } from "../../utility/showNotifications";
import backendApi from "./../../utility/backendApi";

export default function usePatchStoryComment(storyCommentId) {
  return useMutation(
    (values) =>
      axios.patch(`${backendApi}storyComments/${storyCommentId}`, values, {
        withCredentials: true,
        credentials: "include",
      })
    // .then((res) => res.data.data.data)
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["post", [postId]]);
    //     queryClient.invalidateQueries("user");
    //   },
    // }
  );
}

export function usePatchUnderstatedComment(storyCommentId, storyId) {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      axios
        .patch(
          `${backendApi}storyComments/${storyCommentId}/update-understated`,
          {},
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data),
    {
      onError: () => {
        showError("Something went wrong");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["story", storyId, "comments"]);
        // queryClient.invalidateQueries("user");
      },
    }
  );
}
