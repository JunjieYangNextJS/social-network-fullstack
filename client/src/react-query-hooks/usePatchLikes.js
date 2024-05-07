import axios from 'axios';
import { useMutation } from 'react-query';
import backendApi from './../utility/backendApi';

export function usePatchPlusLike(route) {
  return useMutation(id =>
    axios.patch(
      `${backendApi}${route}/${id}/update-plusLike`,
      {},
      {
        withCredentials: true
      }
    )
  );
}

export function usePatchMinusLike(route) {
  return useMutation(id =>
    axios.patch(
      `${backendApi}${route}/${id}/update-minusLike`,
      {},
      {
        withCredentials: true
      }
    )
  );
}
