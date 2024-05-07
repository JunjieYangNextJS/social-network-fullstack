import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { showError } from '../../utility/showNotifications';
import backendApi from './../../utility/backendApi';

export default function usePatchOtherUser(
  otherUserUsername,
  otherUserId,
  keep
) {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/${otherUserId}/updateOtherUser`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onError: () => {
        showError('Something went wrong');
      },
      onSuccess: data => {
        queryClient.invalidateQueries(['user', otherUserUsername]);
        !keep && queryClient.invalidateQueries(['user']);
      }
    }
  );
}

export function usePatchOtherUserFriendRequest(
  otherUserUsername,
  method,
  otherUserId,
  keep
) {
  const queryClient = useQueryClient();
  return useMutation(
    friendRequest =>
      axios.patch(
        `${backendApi}users/${otherUserId}/${method}`,
        friendRequest,
        {
          withCredentials: true,
          credentials: 'include'
        }
      ),
    // .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', otherUserUsername]);

        !keep && queryClient.invalidateQueries(['user']);
      }
    }
  );
}

export function useFollowOtherUser(
  otherUserId,
  otherUserUsername,
  otherUserFollowers,
  myId
) {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      axios
        .patch(
          `${backendApi}users/${otherUserId}/followOtherUser`,
          {},
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => res.data.data),
    {
      onMutate: async () => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['user', otherUserUsername]);

        // // Snapshot the previous value
        const previousOtherUser = queryClient.getQueryData([
          'user',
          otherUserUsername
        ]);

        // // Optimistically update to the new value
        queryClient.setQueryData(['user', otherUserUsername], {
          ...previousOtherUser,
          followers: [...otherUserFollowers, myId]
        });

        // // Return a context with the previous and new todo
        return { previousOtherUser };
      },
      onError: (_err, _newTodo, context) => {
        queryClient.setQueryData(
          ['user', otherUserUsername],
          context.previousOtherUser
        );
      },
      onSettled: data => {
        // queryClient.invalidateQueries(["user", otherUserUsername]);
        queryClient.setQueryData(['user', otherUserUsername], data);
      }
    }
  );
}

export function useUnfollowOtherUser(
  otherUserId,
  otherUserUsername,
  otherUserFollowers,
  myId
) {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      axios
        .patch(
          `${backendApi}users/${otherUserId}/unfollowOtherUser`,
          {},
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => res.data.data),
    {
      onMutate: async () => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['user', otherUserUsername]);

        // // Snapshot the previous value
        const previousOtherUser = queryClient.getQueryData([
          'user',
          otherUserUsername
        ]);

        // // Optimistically update to the new value
        queryClient.setQueryData(['user', otherUserUsername], {
          ...previousOtherUser,
          followers: otherUserFollowers.filter(id => id !== myId)
        });

        // // Return a context with the previous and new todo
        return { previousOtherUser };
      },
      onError: (_err, _newTodo, context) => {
        queryClient.setQueryData(
          ['user', otherUserUsername],
          context.previousOtherUser
        );
      },
      onSettled: data => {
        // queryClient.invalidateQueries(["user", otherUserUsername]);
        queryClient.setQueryData(['user', otherUserUsername], data);
      }
    }
  );
}
