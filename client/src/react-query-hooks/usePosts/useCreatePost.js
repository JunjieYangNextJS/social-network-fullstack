import axios from "axios";
import { useMutation, queryCache, queryClient } from "react-query";
import backendApi from "./../../utility/backendApi";

export default function useCreatePost() {
  return useMutation((values) =>
    axios
      .post(`${backendApi}posts`, values, {
        withCredentials: true,
        credentials: "include",
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((res) => res.data.data.data)
  );
}

// onMutate: async (values) => {
//   await queryClient.cancelQueries(["post", params.postId]);
//   const previousValue = queryClient.getQueryData([
//     "post",
//     params.postId,
//   ]);
//   // queryClient.setQueryData("post", (old) => ({
//   //   ...old,
//   //   data: [...old.data, values],
//   // }));
//   queryClient.setQueryData(["post", params.postId], (old) => ({
//     ...old,
//     data: [...old.data, values],
//   }));
//   return {
//     previousValue,
//   };
// },
// onError: (_error, _variables, context) => {
//   queryClient.setQueryData(
//     ["post", params.postId],
//     context.previousValue
//   );
// },
// onSettled: () => {
//   queryClient.invalidateQueries(["post", params.postId]);
// },
