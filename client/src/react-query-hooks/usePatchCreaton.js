import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "../utility/backendApi";

export default function usePatchCreation(route, parentId) {
  return useMutation(
    (values) =>
      axios.patch(`${backendApi}${route}/${parentId}`, values, {
        withCredentials: true,
        credentials: "include",
      })
    // .then((res) => res.data)
  );
}
export function usePatchCreationSubscribers(route, parentId) {
  return useMutation(
    (values) =>
      axios.patch(
        `${backendApi}${route}/${parentId}/update-subscribers`,
        values,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
    // .then((res) => res.data)
  );
}
