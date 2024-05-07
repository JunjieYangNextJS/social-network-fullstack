import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "../../utility/backendApi";

export default function useGetPostComment(id) {
  return useQuery(
    ["pinnedPostComment", id],
    () =>
      axios
        .get(`${backendApi}postComments/${id}`)
        .then((res) => res.data.data.data),
    {
      enabled: !!id,
    }
  );
}
