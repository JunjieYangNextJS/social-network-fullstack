import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from './../../utility/backendApi';
import { showSuccess } from './../../utility/showNotifications';

export default function useDeleteStoryReply(storyId, storyComment) {
  const queryClient = useQueryClient();
  return useMutation(
    storyReplyId =>
      axios.delete(`${backendApi}storyReplies/${storyReplyId}`, {
        withCredentials: true,
        credentials: 'include'
      }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['story', storyId, 'comments']);
        queryClient.invalidateQueries(['user']);
        if (storyComment)
          queryClient.invalidateQueries(['storyComment', storyComment]);
        showSuccess('Your reply was successfully deleted.');
      }
    }
  );
}
