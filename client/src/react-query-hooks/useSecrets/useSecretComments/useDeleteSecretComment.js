import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "./../../../utility/backendApi";

export default function useDeleteSecretComment(secretCommentId) {
  const queryClient = useQueryClient();
  return useMutation((values) =>
    axios
      .patch(`${backendApi}secretComments/deletion`, values, {
        withCredentials: true,
        credentials: "include",
      })
      .then((res) => res.data)
  );
}
