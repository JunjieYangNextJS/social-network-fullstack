import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "./../../utility/backendApi";
import { showError, showSuccess } from "../../utility/showNotifications";

export default function usePatchPostReply(postReplyId, postId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}postReplies/${postReplyId}`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data),
    {
      onError: () => {
        showError("Something went wrong");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["post", postId, "comments"]);
        // queryClient.invalidateQueries("user");
      },
    }
  );
}
