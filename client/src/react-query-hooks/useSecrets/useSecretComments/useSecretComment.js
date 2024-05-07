import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "./../../../utility/backendApi";

export default function useSecretComment(commentId) {
  return useQuery(commentId && ["private-secretComment", commentId], () =>
    axios
      .get(`${backendApi}secretComments/${commentId}`, {
        withCredentials: true,
      })
      .then((res) => res.data)
  );
}
