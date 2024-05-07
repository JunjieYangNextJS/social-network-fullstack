import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function useDraftPost(postId) {
  return useQuery(
    postId && ['draftPost', postId],
    () =>
      axios
        .get(`${backendApi}posts/draft/${postId}`, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data)
    // {
    //   refetchOnWindowFocus: false,
    // }
  );
}

export function useDraftPosts() {
  return useQuery(['draftPosts'], () =>
    axios
      .get(`${backendApi}posts/draft`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
