import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';

export default function useDeleteSecret() {
  const queryClient = useQueryClient();
  return useMutation(
    secretId =>
      axios
        .delete(`${backendApi}secrets/${secretId}`, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['secrets']);
      }
    }
  );
}
