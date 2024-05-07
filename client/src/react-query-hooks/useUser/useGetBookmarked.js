import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

// const userId = Cookies.get("_id");

export function useGetBookmarkedPosts() {
  return useQuery(['bookmarkedPosts'], () =>
    axios
      .get(`${backendApi}users/getBookmarkedPosts`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetBookmarkedStories() {
  return useQuery(['bookmarkedStories'], () =>
    axios
      .get(`${backendApi}users/getBookmarkedStories`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetBookmarkedSecrets() {
  return useQuery(['bookmarkedSecrets'], () =>
    axios
      .get(`${backendApi}users/getBookmarkedSecrets`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
