import axios from 'axios';
import { useMutation, queryCache, useQueryClient } from 'react-query';
import { useSetChatRoomObj } from '../../contexts/ChatRoomObjContext';
import backendApi from '../../utility/backendApi';
import { showError } from '../../utility/showNotifications';

export default function usePatchChatRoomFromMeBoolean() {
  const queryClient = useQueryClient();
  const setChatRoomObj = useSetChatRoomObj();

  return useMutation(
    values =>
      axios
        .patch(`${backendApi}chatRooms/from-me-boolean`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data),
    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: data => {
        setChatRoomObj(data);

        queryClient.setQueryData(['user'], old => {
          const index = old.chatRooms.findIndex(el => el._id === data.id);

          let clonedArray = [...old.chatRooms];

          clonedArray[index] = data;

          return { ...old, chatRooms: clonedArray };
        });
      }
    }
  );
}

export function usePatchRemoveChatRoom() {
  const queryClient = useQueryClient();
  const setChatRoomObj = useSetChatRoomObj();

  return useMutation(
    values =>
      axios
        .patch(`${backendApi}chatRooms/removeChatRoom`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data),
    {
      onSuccess: data => {
        setChatRoomObj(data);
        queryClient.setQueryData(['user'], data);
      }
    }
  );
}
