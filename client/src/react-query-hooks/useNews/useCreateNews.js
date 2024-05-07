import axios from "axios";
import { useMutation, queryCache, queryClient } from "react-query";
import backendApi from "./../../utility/backendApi";
import { showSuccess } from "./../../utility/showNotifications";

export default function useCreateNews() {
  return useMutation(
    (values) =>
      axios
        .post(`${backendApi}news`, values, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            acl: "public-read",
          },
          // headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then((res) => res.data.data),
    {
      onSuccess: () => {
        showSuccess("You have successfully uploaded the news article");
      },
    }
  );
}
