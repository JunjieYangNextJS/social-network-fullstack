import axios from 'axios';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';

export default function usePatchWillNotifyNotifications() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/willNotifyNotifications`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data),
    {
      // onError: () => {
      //   showError('Something went wrong');
      // },

      onSuccess: data => {
        queryClient.invalidateQueries(['willNotifyNotifications']);
      }
    }
  );
}
