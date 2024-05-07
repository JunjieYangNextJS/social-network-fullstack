import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function usePost(postId) {
  return useQuery(
    postId && ['post', postId],
    () =>
      axios
        .get(`${backendApi}posts/${postId}`, {
          withCredentials: true
        })
        .catch(err => Promise.reject(err.response.data.message))

        .then(res => res.data.data.data),
    {
      enabled: !!postId
    }
  );
}
