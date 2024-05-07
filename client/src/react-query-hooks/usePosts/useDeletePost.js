import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";
import { showError, showSuccess } from "./../../utility/showNotifications";

export default function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation(
    (postId) =>
      axios
        .delete(`${backendApi}posts/${postId}`, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data),
    {
      onError: () => {
        showError("Something went wrong");
      },
      onSuccess: () => {
        showSuccess("Your post was successfully deleted.");
      },
    }
  );
}
