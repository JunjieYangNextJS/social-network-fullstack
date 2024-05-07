import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from './../../utility/backendApi';
import { showError, showSuccess } from './../../utility/showNotifications';

export default function useCreatePostComment(postId) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .post(
          `${backendApi}postComments`,

          values,
          {
            withCredentials: true
          }
        )
        .then(res => res.data.data.data),

    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: () => {
        showSuccess('Your comment was successfully created');
        queryClient.invalidateQueries(['post', postId]);

        // queryClient.invalidateQueries("user");
      }
    }
  );
}
