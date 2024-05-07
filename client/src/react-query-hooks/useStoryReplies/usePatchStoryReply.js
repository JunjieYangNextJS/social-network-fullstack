import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { showError } from "../../utility/showNotifications";
import backendApi from "./../../utility/backendApi";

export default function usePatchStoryReply(storyReplyId, storyId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}storyReplies/${storyReplyId}`, values, {
          withCredentials: true,
          credentials: "include",
        })
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
