import axios from "axios";
import { useMutation, queryCache, queryClient } from "react-query";
import backendApi from "../../utility/backendApi";

export default function useCreateSecret() {
  return useMutation((values) =>
    axios
      .post(`${backendApi}secrets`, values, {
        withCredentials: true,
        credentials: "include",
      })
      .then((res) => res.data.data.data)
  );
}
