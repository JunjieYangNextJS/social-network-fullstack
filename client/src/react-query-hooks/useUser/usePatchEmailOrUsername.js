import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';

export default function usePatchEmailOrUsername(user) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(
          `${backendApi}users/updateEmailOrUsername`,
          {
            passwordCurrent: values.passwordCurrent,
            email: values.email || user.email,
            username: values.username || user.username
          },
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => res.data),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['user']);
      }
    }
  );
}
