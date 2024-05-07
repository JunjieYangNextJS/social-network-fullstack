import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from './../../utility/backendApi';
import { showError, showSuccess } from './../../utility/showNotifications';

export default function useDeletePostReply(postId, postComment) {
  const queryClient = useQueryClient();
  return useMutation(
    postReplyId =>
      axios.delete(`${backendApi}postReplies/${postReplyId}`, {
        withCredentials: true,
        credentials: 'include'
      }),

    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['post', postId, 'comments']);
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['postComment', postComment]);
        // showSuccess("Your reply was successfully deleted");
        showSuccess('Your reply was successfully deleted.');
      }
    }
  );
}
