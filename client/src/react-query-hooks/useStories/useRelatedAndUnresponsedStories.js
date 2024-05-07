import { useQuery } from "react-query";
import axios from "axios";
import backendApi from "./../../utility/backendApi";

export default function useRelatedAndUnresponsedStories(storyId, about) {
  return useQuery(
    storyId && ["relatedAndUnresponsedStories ", storyId],
    () =>
      axios
        .get(
          `${backendApi}stories/relatedAndUnresponsedStories/${storyId}/${about}`
        )
        .then((res) => res.data.data.data),
    {
      enabled: !!storyId,
    }
  );
}
