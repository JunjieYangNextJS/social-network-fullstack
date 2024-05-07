import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function useOtherUser(username, setErrorMessage) {
  return useQuery(username && ['user', username], () =>
    axios
      .get(`${backendApi}users/${username}`, {
        withCredentials: true
        // credentials: "include",
      })
      .then(res => res.data.data.data)
      .catch(err => {
        if (err.response.status === 403)
          setErrorMessage('Ouch, You have been forbidden to view this page');
        if (err.response.status === 404) setErrorMessage(404);
        if (err.response.status === 302) setErrorMessage(302);
      })
  );
}

export function useGetHoverOtherUser(userId) {
  return useQuery(
    userId && ['user', userId, 'hover'],
    () =>
      axios
        .get(`${backendApi}users/getHover/${userId}`)
        .then(res => res.data.data),
    { enabled: Boolean(userId) }
  );
}

export function useGetPopularPeople() {
  return useQuery(['popularPeople'], () =>
    axios
      .get(`${backendApi}users/getPopularPeople`, {
        withCredentials: true
      })
      .then(res => res.data.data)
  );
}

export function useGetLikeMindedPeople(userId) {
  return useQuery(
    ['likeMindedPeople'],
    () =>
      axios
        .get(`${backendApi}users/getLikeMindedPeople`, {
          withCredentials: true
        })
        .then(res => res.data.data),
    { enabled: !!userId }
  );
}

export function useGetFollowers(username) {
  return useQuery(
    [username, 'followers'],
    () =>
      axios
        .get(`${backendApi}users/getOtherUserFollowers/${username}`)
        .then(res => res.data.data),
    { enabled: !!username }
  );
}

export function useGetFollowing(username) {
  return useQuery(
    [username, 'following'],
    () =>
      axios
        .get(`${backendApi}users/getOtherUserFollowing/${username}`)
        .then(res => res.data.data),
    { enabled: !!username }
  );
}

export function useOtherUserLikeMinded(username, gender, sexuality) {
  return useQuery(
    [username, 'similar people'],
    () =>
      axios
        .get(
          `${backendApi}users/getOtherUserLikeMinded/${gender}/${sexuality}`,
          {
            withCredentials: true
            // credentials: "include",
          }
        )
        .then(res => res.data.data),
    { enabled: !!username }
  );
}
