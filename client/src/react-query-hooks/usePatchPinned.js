import axios from 'axios';
import { useMutation } from 'react-query';
import backendApi from './../utility/backendApi';

export default function usePatchPinnedComment(route, id, invalidateVariable) {
  return useMutation(values =>
    axios.patch(`${backendApi}${route}/${id}/update-pinnedComment`, values, {
      withCredentials: true
    })
  );
}
