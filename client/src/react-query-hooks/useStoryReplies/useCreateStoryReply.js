import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";

export default function useCreateStoryReply(
  userId,
  postId,
  postCommentId,
  postTitle
) {
  const queryClient = useQueryClient();
  return useMutation((values) =>
    axios.post(`${backendApi}storyReplies`, values, {
      withCredentials: true,
      // credentials: "include",
    })
  );
}
