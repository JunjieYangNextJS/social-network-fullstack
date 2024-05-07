import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "./../../../utility/backendApi";

export function useAddSecretReply(secretCommentId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(
          `${backendApi}secretComments/addReply/${secretCommentId}`,
          values,
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["secretComment", secretCommentId]);
      },
    }
  );
}
export function useDeleteSecretReply(secretCommentId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(
          `${backendApi}secretComments/deleteReply/${secretCommentId}`,
          values,
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["secretComment", secretCommentId]);
      },
    }
  );
}
export function useEditSecretReply(secretCommentId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}secretComments/editReply`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["secretComment", secretCommentId]);
      },
    }
  );
}
export function useEditSecretComment(secretCommentId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(
          `${backendApi}secretComments/editComment/${secretCommentId}`,
          values,
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["secretComment", secretCommentId]);
      },
    }
  );
}
export function usePatchSecretCommentHiddenBy(secretCommentId, secretId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(
          `${backendApi}secretComments/patchHiddenBy/${secretCommentId}`,
          values,
          {
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((res) => res.data.data),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["secret", secretId], (old) => {
          return { secret: old.secret, comments: data };
        });
      },
    }
  );
}
