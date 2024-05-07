import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "./../utility/backendApi";
import { showSuccess } from "./../utility/showNotifications";

export default function usePatchReports(id, itemEndPoint) {
  // const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios.patch(`${backendApi}${itemEndPoint}/${id}/update-reports`, values, {
        withCredentials: true,
        credentials: "include",
      }),
    {
      onSuccess: () => {
        showSuccess("Your report was successfully filed.");
      },
    }
  );
}
