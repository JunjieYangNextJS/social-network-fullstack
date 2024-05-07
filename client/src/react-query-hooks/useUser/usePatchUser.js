import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import backendApi from './../../utility/backendApi';
import { useSetOpenChat } from './../../contexts/ChatRoomObjContext';
import { showSuccess } from './../../utility/showNotifications';

export default function usePatchUser() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/updateMe`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        showSuccess('Changes are successfully saved');
      }
    }
  );
}

export function usePatchUserWithoutPhoto() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/updateMeWithoutPhoto`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        showSuccess('Changes are successfully saved');
      }
    }
  );
}

export function usePatchUserWithFormData() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios.post(`${backendApi}users/updateMe`, values, {
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'multipart/form-data',
          acl: 'public-read'
        }
      }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        showSuccess('You have successfully updated your profile');
      }
    }
  );
}

export function usePatchArrayMethod(method, keepOg) {
  const queryClient = useQueryClient();

  return useMutation(
    item =>
      axios
        .patch(
          `${backendApi}users/${method}`,
          { item },
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => res.data),
    {
      onSuccess: data => {
        !keepOg && queryClient.invalidateQueries(['user', { exact: true }]);
      }
    }
  );
}

export function usePatchUserFriendList(otherUserUsername, method, otherUserId) {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      axios
        .patch(
          `${backendApi}users/${otherUserId}/${method}`,
          {},
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => res.data),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['user']);

        queryClient.invalidateQueries(['user', otherUserUsername]);
      }
    }
  );
}

export function useRemoveUserFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation(
    values =>
      axios
        .patch(`${backendApi}users/removeFriendRequest`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
      }
    }
  );
}
