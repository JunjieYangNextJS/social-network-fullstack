import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from '../../utility/backendApi';

export default function usePostComments() {
  return useQuery(['postComments'], () =>
    axios
      .get(`${backendApi}postComments`, {
        withCredentials: true
      })
      .then(res => res.data.data.data)
  );
}

export function useMyPostComments() {
  return useQuery(['myPostComments'], () =>
    axios
      .get(`${backendApi}users/getMyPostComments`, {
        withCredentials: true
      })
      .then(res => res.data.data.data)
  );
}
// export function useMyPostComments() {
//   return useQuery("myPostComments", () =>
//     axios
//       .get(`${backendApi}postComments/getMyPostComments?limit=20&page=1`, {
//         withCredentials: true,
//       })
//       .then((res) => res.data.data.data)
//   );
// }
