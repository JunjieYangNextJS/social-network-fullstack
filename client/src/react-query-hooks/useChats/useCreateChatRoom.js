import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from '../../utility/backendApi';
import { usePatchArrayMethod } from '../useUser/usePatchUser';
import {
  useSetChatRoomObj,
  useSetOpenChat
} from './../../contexts/ChatRoomObjContext';
import usePatchOtherUserChatRooms from '../useOtherUsers/usePatchOtherUserChatRooms';
import { showError } from '../../utility/showNotifications';

export default function useCreateChatRoom(otherUserId) {
  // const { mutate: updateMyChatRooms } = usePatchArrayMethod("addChatRoom");
  // const { mutate: updateOtherUserChatRooms } =
  //   usePatchOtherUserChatRooms(otherUserId);
  const queryClient = useQueryClient();
  const setChatRoomObj = useSetChatRoomObj();

  return useMutation(
    values =>
      axios
        .post(`${backendApi}chatRooms`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data),
    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: data => {
        // updateMyChatRooms(data._id);
        // updateOtherUserChatRooms({ chatRoom: data._id });

        queryClient.setQueryData(['user'], old => {
          return { ...old, chatRooms: [data, ...old.chatRooms] };
        });

        setChatRoomObj(data);
      }
    }
    // {
    //   onMutate: async () => {
    //     await queryClient.cancelQueries(`posts`);

    //     const previousPosts = queryCache.getQueryData(`posts`);

    //     queryClient.setQueryData(`posts`, (old) => ({
    //       ...old,
    //       items: [...old.items],
    //     }));

    //     return previousPosts;
    //   },

    //   onError: (error, variables, previousValue, postId) =>
    //     queryClient.setQueryData(`posts/${postId}`, previousValue),

    //   onSettled: (postId) => {
    //     queryClient.invalidateQueries(`posts/${postId}`);
    //   },
    // }
    // {
    //   onMutate: async (values) => {
    //     await queryClient.cancelQueries("posts");

    //     const previousPosts = queryCache.getQueryData("posts");

    //     queryClient.setQueryData("posts", (old) => ({
    //       ...old,
    //       items: [...old.items, values],
    //     }));

    //     return previousPosts;
    //   },

    //   onError: (error, variables, previousValue) =>
    //     queryClient.setQueryData("posts", previousValue),

    //   onSettled: () => {
    //     queryClient.invalidateQueries("posts");
    //   },
    // }
  );
}
