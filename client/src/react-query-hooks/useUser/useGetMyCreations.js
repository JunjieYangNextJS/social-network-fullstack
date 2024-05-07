import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

// const userId = Cookies.get("_id");

export function useGetMyPosts() {
  return useQuery(['myPosts'], () =>
    axios
      .get(`${backendApi}users/getMyPosts`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetMyStories() {
  return useQuery(['myStories'], () =>
    axios
      .get(`${backendApi}users/getMyStories`, {
        withCredentials: true,
        credentials: 'include'
      })
      .then(res => res.data.data.data)
  );
}
export function useGetMySecrets() {
  return useQuery(['mySecrets'], () =>
    axios
      .get(`${backendApi}users/getMySecrets`, {
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
// export function useGetMyReplies() {
//   return useQuery("myReplies", () =>
//     axios
//       .get(`${backendApi}users/getMyReplies`, {
//         withCredentials: true,
//         credentials: "include",
//       })
//       .then((res) => res.data.data.data)
//   );
// }
