import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "./../../utility/backendApi";

export default function useStory(storyId) {
  return useQuery(storyId && ["story", storyId], () =>
    axios
      .get(`${backendApi}stories/${storyId}`)
      .then((res) => res.data.data.data)
  );
}
