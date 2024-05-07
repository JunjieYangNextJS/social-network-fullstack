import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';

export default function useCreatePostReply(
  userId,
  postId,
  postCommentId,
  postTitle
) {
  return useMutation(
    values => {
      console.log(values);

      return axios
        .post(`${backendApi}postReplies`, values, {
          withCredentials: true
          // credentials: "include",
        })
        .then(res => res.data.data.data);
    }

    // {
    //   // onMutate: async (values) => {
    //   //   await queryClient.cancelQueries(["post", postId]);

    //   //   const previousValue = queryClient.getQueryData(["post", postId]);

    //   //   queryClient.setQueryData(["post", postId], (old) => [...old, values]);

    //   //   return { previousValue };
    //   // },

    //   // onError: (error, variables, context) =>
    //   //   queryClient.setQueryData(["post", postId], context.previousValue),

    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["post", postId, "comments"]);
    //     // queryClient.invalidateQueries("user");
    //   },
    // }
  );
}
