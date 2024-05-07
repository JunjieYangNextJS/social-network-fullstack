import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { showError } from "../../utility/showNotifications";
import backendApi from "./../../utility/backendApi";

export default function useDeletePostComment(postId) {
  const queryClient = useQueryClient();
  return useMutation(
    (postCommentId) =>
      axios.patch(
        `${backendApi}postComments/deletion/${postCommentId}`,
        { post: postId },
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
        queryClient.invalidateQueries(["post", postId]);
        // queryClient.invalidateQueries("user");
      },
    }
  );
}
