import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

// const userId = Cookies.get("_id");

export function useGetLikedPosts() {
  return useQuery(['likedPosts'], () =>
    axios
      .get(`${backendApi}users/getLikedPosts`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetLikedStories() {
  return useQuery(['likedStories'], () =>
    axios
      .get(`${backendApi}users/getLikedStories`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetLikedSecrets() {
  return useQuery(['likedSecrets'], () =>
    axios
      .get(`${backendApi}users/getLikedSecrets`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetMyComments() {
  return useQuery(['myComments'], () =>
    axios
      .get(`${backendApi}users/getMyComments`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetMyReplies() {
  return useQuery(['myReplies'], () =>
    axios
      .get(`${backendApi}users/getMyReplies`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
