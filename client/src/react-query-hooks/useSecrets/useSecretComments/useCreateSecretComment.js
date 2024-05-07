import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "../../../utility/backendApi";

export default function useCreateSecretComment(id) {
  const queryClient = useQueryClient();

  return useMutation(
    (values) =>
      axios
        .post(`${backendApi}secretComments`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["secret", id]);
      },
    }
  );
}
