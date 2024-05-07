import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { showError } from "../../utility/showNotifications";
import backendApi from "./../../utility/backendApi";

export default function useDeleteStoryComment(storyId) {
  const queryClient = useQueryClient();
  return useMutation(
    (storyCommentId) =>
      axios.patch(
        `${backendApi}storyComments/deletion/${storyCommentId}`,
        { story: storyId },
        {
          withCredentials: true,
          credentials: "include",
        }
      ),
    {
      onError: () => {
        showError("Something went wrong");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["story", storyId]);
        queryClient.invalidateQueries(["story", storyId, "comments"]);
      },
    }
  );
}
