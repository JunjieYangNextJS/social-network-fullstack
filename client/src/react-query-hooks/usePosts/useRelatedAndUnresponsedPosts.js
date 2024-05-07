import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function useRelatedAndUnresponsedPosts(postId, about) {
  return useQuery(
    postId && ['relatedAndUnresponsedPosts', postId],
    () =>
      axios
        .get(`${backendApi}posts/relatedAndUnresponsedPosts/${postId}/${about}`)
        .then(res => res.data.data.data),
    {
      enabled: !!postId
    }
  );
}
