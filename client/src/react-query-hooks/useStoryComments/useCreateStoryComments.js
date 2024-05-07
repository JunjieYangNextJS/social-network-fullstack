import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { showError } from "../../utility/showNotifications";
import backendApi from "./../../utility/backendApi";

export default function useCreateStoryComment(storyId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios.post(
        `${backendApi}storyComments`,

        values,
        {
          withCredentials: true,
        }
      ),
    // .then((res) => res.data.data.data)
    {
      onError: () => {
        showError("Something went wrong");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["story", storyId]);
        // queryClient.invalidateQueries("user");
      },
    }
  );
}
