import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';

export default function useDeleteStory() {
  const queryClient = useQueryClient();
  return useMutation(
    storyId =>
      axios
        .delete(`${backendApi}stories/${storyId}`, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stories']);
      }
    }
  );
}
