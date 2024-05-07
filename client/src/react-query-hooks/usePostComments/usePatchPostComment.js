import axios from "axios";
import { useMutation, queryCache, queryClient } from "react-query";
import backendApi from "./../../utility/backendApi";

export default function usePatchPostComment(postCommentId) {
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}postComments/${postCommentId}`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data)
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["post", [postId]]);
    //     queryClient.invalidateQueries("user");
    //   },
    // }
  );
}
