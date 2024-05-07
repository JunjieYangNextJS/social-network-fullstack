import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "./../../utility/backendApi";

export default function useSecret(secretId) {
  return useQuery(secretId && ["secret", secretId], () =>
    axios
      .get(`${backendApi}secrets/${secretId}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
  );
}
