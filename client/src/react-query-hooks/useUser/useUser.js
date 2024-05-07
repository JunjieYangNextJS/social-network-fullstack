import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

// const userId = Cookies.get("_id");

export default function useUser() {
  return useQuery(['user'], () =>
    axios
      .get(`${backendApi}users/me`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}

export function useGetMyFollowingPeople() {
  return useQuery(['myFollowingPeople'], () =>
    axios
      .get(`${backendApi}users/getMyFollowingPeople`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data)
  );
}
