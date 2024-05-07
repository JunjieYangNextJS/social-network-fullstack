import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function useDraftStory(storyId) {
  return useQuery(storyId && ['draftStory', storyId], () =>
    axios
      .get(`${backendApi}stories/draft/${storyId}`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}

export function useDraftStories() {
  return useQuery(['draftStories'], () =>
    axios
      .get(`${backendApi}stories/draft`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
