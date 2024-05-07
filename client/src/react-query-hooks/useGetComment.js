import { useQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../utility/backendApi';

export default function useGetComment(route, creationId, creation) {
  return useQuery(
    [creation, creationId],
    () =>
      axios
        .get(`${backendApi}${route}/${creationId}`, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data.data.data),
    {
      retry: 3
    }
  );
}
