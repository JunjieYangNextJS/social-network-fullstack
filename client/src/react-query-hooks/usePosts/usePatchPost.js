import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import { showError } from '../../utility/showNotifications';

export default function usePatchPost(postId) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}posts/${postId}`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data),
    {
      onError: () => {
        showError('Something went wrong');
      },

      onSuccess: data => {
        queryClient.setQueryData(['post', postId], data);
      }
    }
  );
}

export function usePatchDraftToPost(postId) {
  // const queryClient = useQueryClient();
  return useMutation(values =>
    axios.patch(`${backendApi}posts/${postId}/update-draftToPost`, values, {
      withCredentials: true,
      credentials: 'include'
    })
  );
}

export function usePatchPostVotes(postId) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}posts/update-postVotes`, values, {
          withCredentials: true
        })
        .then(res => res.data.data),
    {
      onSuccess: data => {
        queryClient.setQueryData(['post', postId], data);
      }
    }
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["post", postId]);
    //   },
    // }
  );
}
