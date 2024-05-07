import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "../../utility/backendApi";

export default function useGetStoryComment(id) {
  return useQuery(
    ["pinnedStoryComment", id],
    () =>
      axios
        .get(`${backendApi}storyComments/${id}`)
        .then((res) => res.data.data.data),
    {
      enabled: !!id,
    }
  );
}
