import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";

export default function usePatchNotification() {
  return useMutation((id) =>
    axios.patch(
      `${backendApi}users/notifications/${id}`,
      {},
      {
        withCredentials: true,
        credentials: "include",
      }
    )
  );
}
