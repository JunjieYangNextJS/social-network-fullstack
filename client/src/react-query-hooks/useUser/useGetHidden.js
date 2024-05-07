import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

// const userId = Cookies.get("_id");

export function useGetHiddenPosts() {
  return useQuery(['hiddenPosts'], () =>
    axios
      .get(`${backendApi}users/getHiddenPosts`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetHiddenStories() {
  return useQuery(['hiddenStories'], () =>
    axios
      .get(`${backendApi}users/getHiddenStories`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetHiddenSecrets() {
  return useQuery(['hiddenSecrets'], () =>
    axios
      .get(`${backendApi}users/getHiddenSecrets`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
