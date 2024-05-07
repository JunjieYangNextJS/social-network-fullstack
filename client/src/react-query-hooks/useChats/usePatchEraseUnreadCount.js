import axios from 'axios';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import { showError } from '../../utility/showNotifications';

export default function usePatchEraseUnreadCount() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}chatRooms/eraseUnreadCount`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data),
    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: data => {
        queryClient.setQueryData(['user'], old => {
          const index = old.chatRooms.findIndex(el => el.id === data.id);

          let clonedArray = [...old.chatRooms];

          clonedArray[index] = data;

          return { ...old, chatRooms: clonedArray };
        });
      }
    }
  );
}
